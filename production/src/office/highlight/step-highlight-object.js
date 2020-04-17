import officeReducerHelper from '../store/office-reducer-helper';
import { officeApiHelper } from '../api/office-api-helper';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepHighlightObject {
    highlightObject = async (objectData, operationData) => {
      try {
        console.warn('yoyoyo');
        await officeApiHelper.onBindingObjectClick(objectData);
      } catch (error) {
        console.error(error);
        operationErrorHandler.handleOperationError(objectData, operationData, error);
      }
    }
}

const stepHighlightObject = new StepHighlightObject();
export default stepHighlightObject;
