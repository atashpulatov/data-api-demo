import { popupTypes } from '@mstr/rc';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import officeStoreObject from '../office/store/office-store-object';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { officeRemoveHelper } from '../office/remove/office-remove-helper';
import { popupController } from '../popup/popup-controller';
import { refreshRequested, removeRequested, duplicateRequested, highlightRequested } from '../redux-reducer/operation-reducer/operation-actions';
import { updateObject } from '../redux-reducer/object-reducer/object-actions';
import { CANCEL_REQUEST_IMPORT } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { toggleSecuredFlag, toggleIsClearDataFailedFlag } from '../redux-reducer/office-reducer/office-actions';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { calculateLoadingProgress } from '../operation/operation-loading-progress';
import { REMOVE_OPERATION, CLEAR_DATA_OPERATION } from '../operation/operation-type-names';

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
   * Gets object from reducer based on objectWorkingId and
   * calls officeApiHelper.onBindingObjectClick to highlight object on Excel worksheet
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
      const officeContext = await officeApiHelper.getOfficeContext();

      if (officeContext.requirements.isSetSupported('ExcelApi', 1.9)) {
        this.eventRemove = excelContext.workbook.tables.onDeleted.add(async (e) => {
          await officeApiHelper.checkStatusOfSessions();
          const ObjectToDelete = officeReducerHelper.getObjectFromObjectReducerByBindId(e.tableId);
          officeRemoveHelper.removeObjectAndDisplaytNotification(ObjectToDelete, officeContext);
        });
      } else if (officeContext.requirements.isSetSupported('ExcelApi', 1.7)) {
        this.eventRemove = excelContext.workbook.worksheets.onDeleted.add(async () => {
          await officeApiHelper.checkStatusOfSessions();
          excelContext.workbook.tables.load('items');
          await excelContext.sync();

          const objectsOfSheets = excelContext.workbook.tables.items;
          const objectsList = officeReducerHelper.getObjectsListFromObjectReducer();

          const objectsToDelete = objectsList.filter(
            (object) => !objectsOfSheets.find((officeTable) => officeTable.name === object.bindId)
          );
          for (const object of objectsToDelete) {
            officeRemoveHelper.removeObjectAndDisplaytNotification(object, officeContext);
          }
        });
      }
      await excelContext.sync();
    } catch (error) {
      console.log('Cannot add onDeleted event listener');
    }
  };


  getSidePanelPopup = () => {
    let popup = null;

    const handleViewData = () => {
      this.reduxStore.dispatch(toggleSecuredFlag(false));
      this.reduxStore.dispatch(toggleIsClearDataFailedFlag(false));
      this.refresh(officeReducerHelper.getObjectsListFromObjectReducer()
        .map(({ objectWorkingId }) => objectWorkingId));
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
    const objectNotification = notifications.find(
      (notification) => notification.objectWorkingId === object.objectWorkingId
    );

    const operationBasedNotificationData = this.shouldGenerateProgressPercentage(objectOperation) ? {
      percentageComplete: objectOperation.totalRows ? calculateLoadingProgress(objectOperation) : 0,
      itemsTotal: objectOperation.totalRows,
      itemsComplete: objectOperation.loadedRows,
    } : {};
    const obj = objectNotification ? {
      ...object,
      notification: {
        ...objectNotification,
        ...operationBasedNotificationData,
      }
    }
      : object;

    return obj;
  });

  shouldGenerateProgressPercentage = (objectOperation) => objectOperation
  && objectOperation.operationType !== REMOVE_OPERATION
  && objectOperation.operationType !== CLEAR_DATA_OPERATION
}

export const sidePanelService = new SidePanelService();
