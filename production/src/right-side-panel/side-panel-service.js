import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { officeStoreService } from '../office/store/office-store-service';
import { officeRemoveHelper } from '../office/remove/office-remove-helper';
import { popupController } from '../popup/popup-controller';
import { errorService } from '../error/error-handler';
import { refreshRequested, removeRequested } from '../operation/operation-actions';
import { updateObject } from '../operation/object-actions';
import { CANCEL_REQUEST_IMPORT } from '../navigation/navigation-tree-actions';


class SidePanelService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

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
  }

  rename = async (objectWorkingId, newName) => {
    const renamedObject = { objectWorkingId, name: newName };
    // TODO check for changing viz whiel editing dossier
    this.reduxStore.dispatch(updateObject(renamedObject));
    await officeStoreService.saveObjectsInExcelStore();
  }

  refresh = async (objectWorkingId) => {
    // TODO maybe combine with refreshSelected?
    const objectData = this.getObject(objectWorkingId);
    this.reduxStore.dispatch(refreshRequested(objectData));
  }

  remove = async (objectWorkingId) => {
    this.reduxStore.dispatch(removeRequested(objectWorkingId));
  }

  refreshSelected = (objectsList) => {
    objectsList = officeStoreService.getObjectsListFromObjectReducer();
    // TODO remove above, remove not needed functions for old refresh all
    for (let index = 0; index < objectsList.length; index++) {
      const object = objectsList[index];
      this.reduxStore.dispatch(refreshRequested(object));
    }
  };

  removeSelected = async (objectsList) => {
    objectsList = officeStoreService.getObjectsListFromObjectReducer();
    // TODO remove above
    for (let index = 0; index < objectsList.length; index++) {
      const object = objectsList[index];
      this.reduxStore.dispatch(removeRequested(object.objectWorkingId));
    }
  }

  addRemoveObjectListener = async () => {
    try {
      const excelContext = await officeApiHelper.getExcelContext();
      const officeContext = await officeApiHelper.getOfficeContext();

      if (officeContext.requirements.isSetSupported('ExcelApi', 1.9)) {
        this.eventRemove = excelContext.workbook.tables.onDeleted.add(async (e) => {
          await officeApiHelper.checkStatusOfSessions();
          const ObjectToDelete = officeStoreService.getObjectFromObjectReducer(e.tableId);
          officeRemoveHelper.removeObjectAndDisplaytNotification(ObjectToDelete, officeContext);
        });
      } else if (officeContext.requirements.isSetSupported('ExcelApi', 1.7)) {
        this.eventRemove = excelContext.workbook.worksheets.onDeleted.add(async () => {
          await officeApiHelper.checkStatusOfSessions();
          excelContext.workbook.tables.load('items');
          await excelContext.sync();

          const objectsOfSheets = excelContext.workbook.tables.items;
          const objectsList = officeStoreService.getObjectsListFromObjectReducer();

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
}

const checkIfObjectProtected = async (bindId) => {
  const excelContext = await officeApiHelper.getExcelContext();
  await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);
};


export const sidePanelService = new SidePanelService();
