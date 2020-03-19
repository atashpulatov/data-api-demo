import { markStepCompleted } from './operation-actions';
import { BIND_OFFICE_TABLE } from './operation-steps';

class OperationStepDispatcher {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  completeBindOfficeTable = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, BIND_OFFICE_TABLE));
  };
}

const operationStepDispatcher = new OperationStepDispatcher();
export default operationStepDispatcher;
