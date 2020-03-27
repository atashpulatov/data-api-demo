
import operationStepDispatcher from '../operation/operation-step-dispatcher';
import { officeApiRemoveHelper } from '../office/api/office-api-remove-helper';

class StepRemoveObject {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  // TODO add jsdoc after integration
  removeObject = async (objectData, operationData) => {
    const {
      bindId,
      isCrosstab = false,
      crosstabHeaderDimensions = {},
      objectWorkingId,
    } = objectData;

    await officeApiRemoveHelper.removeReportFromExcel(bindId, isCrosstab, crosstabHeaderDimensions, objectWorkingId);
    operationStepDispatcher.completeRemoveObject(objectWorkingId);
  }
}

const stepRemoveObject = new StepRemoveObject();
export default stepRemoveObject;
