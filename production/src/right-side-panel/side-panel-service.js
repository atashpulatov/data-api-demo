import { reduxStore } from '../store';
import { popupActions } from '../popup/popup-actions';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';

class SidePanelService {
    refresh = async (objectWorkingId) => {
      const objectData = getObject(objectWorkingId);
      const { bindId, objectType } = objectData;

      await checkIfObjectProtected(bindId);
      popupActions.refreshReportsArra([{ bindId, objectType }]);
    }
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
