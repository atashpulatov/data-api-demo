import {
  importRequested,
  IMPORT_REQUESTED,
  markStepCompleted,
  MARK_STEP_COMPLETED,
  CANCEL_OPERATION,
  cancelOperation,
  backupObject,
  BACKUP_OBJECT
} from '../../operation/operation-actions';

describe('OperationActions', () => {
  it('returns IMPORT_REQUESTED action on importRequested call', () => {
    // given
    const exampleObject = {};

    // when
    const importAction = importRequested(exampleObject);

    // then
    expect(importAction.type).toEqual(IMPORT_REQUESTED);
    expect(importAction.payload.object).toBe(exampleObject);
    expect(importAction.payload.operation.objectWorkingId).toEqual(exampleObject.objectWorkingId,);
    expect(importAction.payload.operation.operationType).toEqual('IMPORT_OPERATION',);
  });

  it('returns MARK_STEP_COMPLETED action on markStepCompleted call', () => {
    // given
    const exampleId = 'exampleId';
    const exampleStep = 'completedStep';

    // when
    const completedAction = markStepCompleted(exampleId, exampleStep);
    // then
    expect(completedAction.type).toEqual(MARK_STEP_COMPLETED);
    expect(completedAction.payload.objectWorkingId).toBe(exampleId);
    expect(completedAction.payload.completedStep).toBe(exampleStep);
  });

  it('returns CANCEL_OPERATION action on cancelOperation call', () => {
    // given
    const exampleId = 'exampleId';

    // when
    const cancelAction = cancelOperation(exampleId);
    // then
    expect(cancelAction.type).toEqual(CANCEL_OPERATION);
    expect(cancelAction.payload.objectWorkingId).toBe(exampleId);
  });

  it('returns BACKUP_OBJECT action on backupObject call', () => {
    // given
    const objectWorkingId = 'exampleId';
    const objectToBkp = { objectWorkingId };

    // when
    const backupAction = backupObject(objectWorkingId, objectToBkp);
    // then
    expect(backupAction.type).toEqual(BACKUP_OBJECT);
    expect(backupAction.payload.objectWorkingId).toBe(objectWorkingId);
    expect(backupAction.payload.objectToBackup).toBe(objectToBkp);
  });
});
