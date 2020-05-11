import { popupTypes } from '@mstr/rc';
import request from 'superagent';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import officeStoreObject from '../office/store/office-store-object';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { popupController } from '../popup/popup-controller';
import {
  refreshRequested, removeRequested, duplicateRequested, highlightRequested
} from '../redux-reducer/operation-reducer/operation-actions';
import { updateObject } from '../redux-reducer/object-reducer/object-actions';
import { CANCEL_REQUEST_IMPORT } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { toggleSecuredFlag, toggleIsClearDataFailedFlag } from '../redux-reducer/office-reducer/office-actions';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { calculateLoadingProgress } from '../operation/operation-loading-progress';
import { officeContext } from '../office/office-context';
import { REMOVE_OPERATION, CLEAR_DATA_OPERATION, HIGHLIGHT_OPERATION } from '../operation/operation-type-names';
import { errorService } from '../error/error-handler';
import { notificationService } from '../notification-v2/notification-service';
import { authenticationHelper } from '../authentication/authentication-helper';
import { incomingErrorStrings } from '../error/constants';

const CONNECTION_CHECK_TIMEOUT = 3000;

class SidePanelService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
   * Opens popup with table of objects
   * Prevent navigation tree from going straight into importing previously selected item.
   */
  addData = async () => {
    this.reduxStore.dispatch({ type: CANCEL_REQUEST_IMPORT });
    await popupController.runPopupNavigation();
  };

  /**
   * Handles the highlighting of object.
   * Creates highlight operation for specific objectWorkingId.
   *
   * @param {Number} objectWorkingId Unique Id of the object, allowing to reference source object.
   */
  highlightObject = async (objectWorkingId) => {
    this.reduxStore.dispatch(highlightRequested(objectWorkingId));
  };

  /**
   * Handles the renaming of object.
   * Calls officeStoreObject.saveObjectsInExcelStore to modify name field in Object Data
   * for object corresponding to passed objectWorkingID
   *
   * @param {Number} objectWorkingId Unique Id of the object, allowing to reference source object.
   * @param {String} newName New name for object
   */
  rename = async (objectWorkingId, newName) => {
    const renamedObject = { objectWorkingId, name: newName };
    this.reduxStore.dispatch(updateObject(renamedObject));
    await officeStoreObject.saveObjectsInExcelStore();
  };

  /**
   * Handles the refresh object and refresh selected.
   * Creates refresh operation per each passed objectWorkingId
   *
   * @param {Array} objectWorkingIds Contains unique Id of the objects, allowing to reference source object.
   */
  refresh = (objectWorkingIds) => {
    objectWorkingIds.forEach(objectWorkingId => {
      this.reduxStore.dispatch(refreshRequested(objectWorkingId));
    });
  };

  /**
   * Handles the remove object and remove selected.
   * Creates remove operation per each passed objectWorkingId
   *
   * @param {Array} objectWorkingIds Contains unique Id of the objects, allowing to reference source object.
   */
  remove = async (objectWorkingIds) => {
    objectWorkingIds.forEach(objectWorkingId => {
      this.reduxStore.dispatch(removeRequested(objectWorkingId));
    });
  };

  /**
   * Creates or updates duplicate popup.
   * Saves the popup and the objectWorkingId in state of RightSidePanel.
   * Called after user click on duplicate icon or after the activeCellAddress changed, while popup was opened.
   *
   * @param {Object} data - Data required to create and update duplicate popup.
   * @param {Number} data.objectWorkingId - Uniqe id of source object for duplication.
   * @param {String} data.activeCellAddress - Adress of selected cell in excel.
   * @param {Function} data.setSidePanelPopup - Callback to save popup in state of RightSidePanel.
   * @param {Function} data.setDuplicatedObjectId - Callback to save objectWorkingId in state of RightSidePanel.
   */
  setDuplicatePopup = ({
    objectWorkingId, activeCellAddress, setSidePanelPopup, setDuplicatedObjectId
  }) => {
    const closePopup = () => {
      setSidePanelPopup(null);
      setDuplicatedObjectId(null);
    };
    setDuplicatedObjectId(objectWorkingId);
    setSidePanelPopup({
      type: popupTypes.DUPLICATE,
      activeCell: activeCellAddress,
      onImport: (isActiveCellOptionSelected) => {
        this.duplicate(objectWorkingId, !isActiveCellOptionSelected, false);
        closePopup();
      },
      onEdit: (isActiveCellOptionSelected) => {
        this.duplicate(objectWorkingId, !isActiveCellOptionSelected, true);
        closePopup();
      },
      onClose: closePopup
    });
  };

  /**
   * Handle the user interaction with duplicate popup UI.
   * Open edit popup for duplicate with edit.
   * Dispatch duplicate operation for duplicate with import.
   *
   * Copy data of source object to new object.
   * Delete references to old object in new object.
   *
   * @param {Number} objectWorkingId Unique Id of the object, allowing to reference source object for duplication.
   * @param {Boolean} insertNewWorksheet  Flag which shows whether the duplication should happen to new excel worksheet.
   * @param {Boolean} withEdit Flag which shows whether the duplication should happen with additional edit popup.
   */
  duplicate = async (objectWorkingId, insertNewWorksheet, withEdit) => {
    const sourceObject = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
    const object = JSON.parse(JSON.stringify(sourceObject));
    object.insertNewWorksheet = insertNewWorksheet;
    object.objectWorkingId = Date.now();

    delete object.bindId;
    delete object.tableName;
    delete object.refreshDate;
    delete object.preparedInstanceId;
    delete object.previousTableDimensions;
    if (object.subtotalsInfo) { delete object.subtotalsInfo.subtotalsAddresses; }

    if (withEdit) {
      this.reduxStore.dispatch(popupActions.callForDuplicate(object));
    } else {
      this.reduxStore.dispatch(duplicateRequested(object));
    }
  };

  /**
   * Handles the editing of object.
   * GEts object data from reducer and opens popup depending of the type of object.
   *
   * @param {Number} objectWorkingId Unique Id of the object, allowing to reference source object.
   */
  edit = async (objectWorkingId) => {
    const objectData = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(objectWorkingId);
    const { bindId, mstrObjectType } = objectData;
    const excelContext = await officeApiHelper.getExcelContext();
    await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);

    if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
      this.reduxStore.dispatch(popupActions.callForEditDossier({ bindId, mstrObjectType }));
    } else {
      this.reduxStore.dispatch(popupActions.callForEdit({ bindId, mstrObjectType }));
    }
  };

  /**
   * Depending of the version of supported Excel Api creates an event listener,
   * allowing us to detect and handle removal of the Excel table
   *
   */
  addRemoveObjectListener = async () => {
    try {
      const excelContext = await officeApiHelper.getExcelContext();

      if (officeContext.isSetSupported(1.9)) {
        this.eventRemove = excelContext.workbook.tables.onDeleted.add(async (e) => {
          const ObjectToDelete = officeReducerHelper.getObjectFromObjectReducerByBindId(e.tableId);
          notificationService.removeExistingNotification(ObjectToDelete.objectWorkingId);
          await officeApiHelper.checkStatusOfSessions();
          this.remove([ObjectToDelete.objectWorkingId]);
        });
      } else if (officeContext.isSetSupported(1.7)) {
        this.eventRemove = excelContext.workbook.worksheets.onDeleted.add(async () => {
          await officeApiHelper.checkStatusOfSessions();
          excelContext.workbook.tables.load('items');
          await excelContext.sync();

          const objectsOfSheets = excelContext.workbook.tables.items;
          const objectsList = officeReducerHelper.getObjectsListFromObjectReducer();

          const objectsToDelete = objectsList.filter(
            (object) => !objectsOfSheets.find((officeTable) => officeTable.name === object.bindId)
          );
          const objectWorkingIds = objectsToDelete.map((object) => object.objectWorkingId);

          objectsToDelete.forEach((object) => {
            notificationService.removeExistingNotification(object.objectWorkingId);
          });

          this.remove(objectWorkingIds);
        });
      }
      await excelContext.sync();
    } catch (error) {
      console.log('Cannot add onDeleted event listener');
    }
  };


  getSidePanelPopup = () => {
    let popup = null;

    const handleViewData = async () => {
      try {
        await officeApiHelper.checkStatusOfSessions();
        this.reduxStore.dispatch(toggleSecuredFlag(false));
        this.reduxStore.dispatch(toggleIsClearDataFailedFlag(false));
        this.refresh(officeReducerHelper.getObjectsListFromObjectReducer()
          .map(({ objectWorkingId }) => objectWorkingId));
      } catch (error) {
        errorService.handleError(error);
      }
    };

    const { isSecured, isClearDataFailed } = this.reduxStore.getState().officeReducer;
    isSecured && (popup = {
      type: popupTypes.DATA_CLEARED,
      onViewData: handleViewData,
    });
    isClearDataFailed && (popup = {
      type: popupTypes.DATA_CLEARED_FAILED,
      onViewData: handleViewData,
    });
    return popup;
  };

  /**
   * Gets initial active cell address and stores it state of RightSidePanel via callback.
   * Creates event listener for cell selection change and passes a state setter callback to event handler.
   *
   * @param {Function} setActiveCellAddress Callback to modify the activeCellAddress in state of RightSidePanel
   */
  initializeActiveCellChangedListener = async (setActiveCellAddress) => {
    const excelContext = await officeApiHelper.getExcelContext();
    const initialCellAddress = await officeApiHelper.getSelectedCell(excelContext);
    const initialCellAddressWithDollars = officeApiHelper.getCellAddressWithDollars(initialCellAddress);
    setActiveCellAddress(initialCellAddressWithDollars);
    await officeApiHelper.addOnSelectionChangedListener(excelContext, setActiveCellAddress);
  };

  injectNotificationsToObjects = (loadedObjects, notifications, operations) => loadedObjects.map((object) => {
    const objectOperation = operations.find((operation) => operation.objectWorkingId === object.objectWorkingId);
    const objectNotificationData = notifications.find(
      (notification) => notification.objectWorkingId === object.objectWorkingId
    );

    const operationBasedNotificationData = this.shouldGenerateProgressPercentage(objectOperation)
      ? {
        percentageComplete: objectOperation.totalRows ? calculateLoadingProgress(objectOperation) : 0,
        itemsTotal: !objectNotificationData.isFetchingComplete ? objectOperation.totalRows : 0,
        itemsComplete: !objectNotificationData.isFetchingComplete ? objectOperation.loadedRows : 0,
      }
      : {};

    let notification;
    if (objectNotificationData) {
      notification = {
        ...objectNotificationData,
        ...operationBasedNotificationData,
      };
    }

    return {
      ...object,
      notification,
    };
  });

  shouldGenerateProgressPercentage = (objectOperation) => objectOperation
  && objectOperation.operationType !== REMOVE_OPERATION
  && objectOperation.operationType !== CLEAR_DATA_OPERATION
  && objectOperation.operationType !== HIGHLIGHT_OPERATION

  /**
   * Handles error thrown during invoking side panel actions like refresh, edit etc.
   * For Webkit based clients (Safari, Excel for Mac)
   * it checks for network connection with custom implementation
   * This logic allows us to provide user with connection lost notification
   *
   * @param {Object} error Plain error object thrown by method calls.
   */
  handleSidePanelActionError = (error) => {
    const castedError = String(error);
    const { CONNECTION_BROKEN } = incomingErrorStrings;
    if (castedError.includes(CONNECTION_BROKEN)) {
      if (navigator.userAgent.toLowerCase().includes('applewebkit')) {
        notificationService.connectionLost();
        this.connectionCheckerLoop();
      }
      return;
    }
    errorService.handleError(error);
  }

  /**
   * This method creates an interval and checkes every CONNECTION_CHECK_TIMOUT seconds
   * wether the connection to the internet has been restored
   *
   */
  connectionCheckerLoop = () => {
    const checkInterval = setInterval(() => {
      authenticationHelper.doesConnectionExist(checkInterval);
    }, CONNECTION_CHECK_TIMEOUT);
  }
}

export const sidePanelService = new SidePanelService();
