import officeReducerHelper from '../store/office-reducer-helper';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepPrepareRefresh {
    prepareRefresh = (objectData) => {
      const { objectWorkingId } = objectData;
      const backupObjectData = JSON.parse(JSON.stringify(objectData));
      operationStepDispatcher.updateOperation({ objectWorkingId, backupObjectData });
      operationStepDispatcher.completePrepareRefresh(objectWorkingId);
    }
}

const stepPrepareRefresh = new StepPrepareRefresh();
export default stepPrepareRefresh;
