import { popupTypes } from '@mstr/rc';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import officeStoreObject from '../office/store/office-store-object';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { officeRemoveHelper } from '../office/remove/office-remove-helper';
import { popupController } from '../popup/popup-controller';
import { errorService } from '../error/error-handler';
import { refreshRequested, removeRequested, duplicateRequested } from '../redux-reducer/operation-reducer/operation-actions';
import { updateObject } from '../redux-reducer/object-reducer/object-actions';
import { CANCEL_REQUEST_IMPORT } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { toggleSecuredFlag, toggleIsClearDataFailedFlag } from '../redux-reducer/office-reducer/office-actions';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { calculateLoadingProgress } from '../operation/operation-loading-progress';

class SidePanelService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  addData = async () => {
    try {
      // Prevent navigation tree from going straight into importing previously selected item.
      this.reduxStore.dispatch({ type: CANCEL_REQUEST_IMPORT });
      await popupController.runPopupNavigation();
    } catch (error) {
      errorService.handleError(error);
    }
  };

  highlightObject = async (objectWorkingId) => {
    const objectData = this.getObject(objectWorkingId);
    await officeApiHelper.onBindingObjectClick(objectData);
  };

  rename = async (objectWorkingId, newName) => {
    const renamedObject = { objectWorkingId, name: newName };
    this.reduxStore.dispatch(updateObject(renamedObject));
    await officeStoreObject.saveObjectsInExcelStore();
  };

  refresh = (objectWorkingIds) => {
    objectWorkingIds.forEach(objectWorkingId => {
      this.reduxStore.dispatch(refreshRequested(objectWorkingId));
    });
  };

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
    setDuplicatedObjectId(objectWorkingId);
    setSidePanelPopup({
      type: popupTypes.DUPLICATE,
      activeCell: activeCellAddress,
      onImport: (isActiveCellOptionSelected) => {
        this.duplicate(objectWorkingId, !isActiveCellOptionSelected, false);
        setSidePanelPopup(null);
        setDuplicatedObjectId(null);
      },
      onEdit: (isActiveCellOptionSelected) => {
        this.duplicate(objectWorkingId, !isActiveCellOptionSelected, true);
        setSidePanelPopup(null);
        setDuplicatedObjectId(null);
      },
      onClose: () => {
        setSidePanelPopup(null);
        setDuplicatedObjectId(null);
      }
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
    const sourceObject = this.getObject(objectWorkingId);
    const object = JSON.parse(JSON.stringify(sourceObject));
    object.insertNewWorksheet = insertNewWorksheet;
    object.objectWorkingId = Date.now();
    if (object.bindId) { delete object.bindId; }
    if (object.tableName) { delete object.tableName; }
    if (object.refreshDate) { delete object.refreshDate; }
    if (object.preparedInstanceId) { delete object.preparedInstanceId; }

    if (withEdit) {
      this.reduxStore.dispatch(popupActions.callForDuplicate(object));
    } else {
      this.reduxStore.dispatch(duplicateRequested(object));
    }
  }

  edit = async (objectWorkingId) => {
    const objectData = this.getObject(objectWorkingId);
    const { bindId, mstrObjectType } = objectData;
    const excelContext = await officeApiHelper.getExcelContext();
    await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);

    if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
      this.reduxStore.dispatch(popupActions.callForEditDossier({ bindId, mstrObjectType }));
    } else {
      this.reduxStore.dispatch(popupActions.callForEdit({ bindId, mstrObjectType }));
    }
  };

  addRemoveObjectListener = async () => {
    try {
      const excelContext = await officeApiHelper.getExcelContext();
      const officeContext = await officeApiHelper.getOfficeContext();

      if (officeContext.requirements.isSetSupported('ExcelApi', 1.9)) {
        this.eventRemove = excelContext.workbook.tables.onDeleted.add(async (e) => {
          await officeApiHelper.checkStatusOfSessions();
          const ObjectToDelete = officeReducerHelper.getObjectFromObjectReducer(e.tableId);
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

  getObject = (objectWorkingId) => {
    const { objects } = this.reduxStore.getState().objectReducer;
    return objects.find(object => object.objectWorkingId === objectWorkingId);
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
    setActiveCellAddress(initialCellAddress);
    await officeApiHelper.addOnSelectionChangedListener(excelContext, setActiveCellAddress);
  };

  injectNotificationsToObjects = (loadedObjects, notifications, operations) => loadedObjects.map((object) => {
    const objectOperation = operations.find((operation) => operation.objectWorkingId === object.objectWorkingId);
    const objectNotification = notifications.find(
      (notification) => notification.objectWorkingId === object.objectWorkingId
    );
    const operationBasedNotificationData = objectOperation ? {
      percentageComplete: objectOperation.totalRows !== 0 ? calculateLoadingProgress(objectOperation) : 0,
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
}

export const sidePanelService = new SidePanelService();
