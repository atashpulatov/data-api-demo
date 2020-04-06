import { popupTypes } from '@mstr/rc';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { officeStoreService } from '../office/store/office-store-service';
import { officeRemoveHelper } from '../office/remove/office-remove-helper';
import { popupController } from '../popup/popup-controller';
import { errorService } from '../error/error-handler';
import { refreshRequested, removeRequested, duplicateRequested } from '../operation/operation-actions';
import { updateObject } from '../operation/object-actions';
import { CANCEL_REQUEST_IMPORT } from '../navigation/navigation-tree-actions';
import { toggleSecuredFlag } from '../office/store/office-actions';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { popupActions } from '../popup/popup-actions';

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
    // TODO check for changing viz whiel editing dossier
    this.reduxStore.dispatch(updateObject(renamedObject));
    await officeStoreService.saveObjectsInExcelStore();
  };

  refresh = (...objectWorkingIds) => {
    console.log('objectWorkingIds:', objectWorkingIds);
    for (let index = 0; index < objectWorkingIds.length; index++) {
      const object = this.getObject(objectWorkingIds[index]);
      this.reduxStore.dispatch(refreshRequested(object));
    }
  };

  remove = async (...objectWorkingIds) => {
    console.log('objectWorkingIds:', objectWorkingIds);
    for (let index = 0; index < objectWorkingIds.length; index++) {
      this.reduxStore.dispatch(removeRequested(objectWorkingIds[index]));
    }
  };

  duplicate = async (objectWorkingId) => {
    const objectData = this.getObject(objectWorkingId);
    this.reduxStore.dispatch(duplicateRequested(objectData));
  };

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

  getSidePanelPopup = () => {
    let popup = null;

    const handleViewData = () => {
      this.reduxStore.dispatch(toggleSecuredFlag(false));
      this.refresh(officeStoreService.getObjectsListFromObjectReducer()
        .map(({ objectWorkingId }) => objectWorkingId));
    };

    const { isSecured } = this.reduxStore.getState().officeReducer;
    isSecured && (popup = {
      type: popupTypes.DATA_CLEARED,
      onViewData: handleViewData,
    });
    return popup;
  };
}

const checkIfObjectProtected = async (bindId) => {
  const excelContext = await officeApiHelper.getExcelContext();
  await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);
};


export const sidePanelService = new SidePanelService();
