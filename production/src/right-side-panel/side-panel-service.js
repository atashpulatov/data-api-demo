import { reduxStore } from '../store';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { refreshRequested } from '../operation/operation-actions';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import {popupActions} from '../popup/popup-actions';

class SidePanelService {
    refresh = (objectWorkingId) => {
      const objectData = getObject(objectWorkingId);
      reduxStore.dispatch(refreshRequested(objectData));
    }

    edit = async (objectWorkingId) => {
      const objectData = getObject(objectWorkingId);
      const { bindId, objectName, mstrObjectType } = objectData;
      const excelContext = await officeApiHelper.getExcelContext();
      await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);

      if (await officeApiHelper.onBindingObjectClick(bindId, false, this.deleteObject, objectName)) {
        if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
          reduxStore.dispatch(popupActions.callForEditDossier({ bindId, objectType: mstrObjectType }));
        } else {
          reduxStore.dispatch(popupActions.callForEdit({ bindId, objectType: mstrObjectType }));
        }
      }
    }

    delete = (objectWorkingId) => {
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
