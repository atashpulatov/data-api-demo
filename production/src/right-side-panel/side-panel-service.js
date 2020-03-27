import { reduxStore } from '../store';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { refreshRequested } from '../operation/operation-actions';

class SidePanelService {
    refresh = async (objectWorkingId) => {
      const objectData = getObject(objectWorkingId);
      reduxStore.dispatch(refreshRequested(objectData));
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
