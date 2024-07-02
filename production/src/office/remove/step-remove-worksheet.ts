import { officeApiHelper } from '../api/office-api-helper';
import { officeApiWorksheetHelper } from '../api/office-api-worksheet-helper';

import { reduxStore } from '../../store';

import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepRemoveWorksheet {
  async removeWorksheet(objectData: ObjectData): Promise<void> {
    const { objectWorkingId, worksheet } = objectData;
    const { isShapeAPISupported } = reduxStore.getState().officeReducer;

    try {
      if (isShapeAPISupported) {
        const excelContext = await officeApiHelper.getExcelContext();
        await officeApiWorksheetHelper.removeWorksheetIfEmpty(excelContext, worksheet.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      operationStepDispatcher.completeRemoveWorksheet(objectWorkingId);
    }
  }
}

const stepRemoveWorksheet = new StepRemoveWorksheet();
export default stepRemoveWorksheet;
