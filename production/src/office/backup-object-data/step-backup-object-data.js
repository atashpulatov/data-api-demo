import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepBackupObjectData {
    backupObjectData = (objectData) => {
      const { objectWorkingId } = objectData;
      const backupObjectData = JSON.parse(JSON.stringify(objectData));
      operationStepDispatcher.updateOperation({ objectWorkingId, backupObjectData });
      operationStepDispatcher.completeBackupObjectData(objectWorkingId);
    }
}

const stepBackupObjectData = new StepBackupObjectData();
export default stepBackupObjectData;
