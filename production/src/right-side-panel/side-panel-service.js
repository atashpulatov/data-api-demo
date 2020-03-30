import { reduxStore } from '../store';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { refreshRequested, removeRequested } from '../operation/operation-actions';
import { officeStoreService } from '../office/store/office-store-service';
import { officeRemoveHelper } from '../office/remove/office-remove-helper';
import { CANCEL_REQUEST_IMPORT } from '../navigation/navigation-tree-actions';
import { popupController } from '../popup/popup-controller';
import { errorService } from '../error/error-handler';

class SidePanelService {
  addData = async () => {
    try {
      // Prevent navigation tree from going straight into importing previously selected item.
      reduxStore.dispatch({ type: CANCEL_REQUEST_IMPORT });
      await popupController.runPopupNavigation();
    } catch (error) {
      errorService.handleError(error);
    }
  };

    refresh = async (objectWorkingId) => {
      const objectData = getObject(objectWorkingId);
      reduxStore.dispatch(refreshRequested(objectData));
    }

    remove = async (objectWorkingId) => {
      reduxStore.dispatch(removeRequested(objectWorkingId));
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
}

const checkIfObjectProtected = async (bindId) => {
  const excelContext = await officeApiHelper.getExcelContext();
  await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);
};

const getObject = (objectWorkingId) => {
  const { objects } = reduxStore.getState().objectReducer;
  return objects.find(object => object.objectWorkingId === objectWorkingId);
};

export const sidePanelService = new SidePanelService();
