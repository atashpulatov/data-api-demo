import { operationsMap, OperationSteps } from '../../operation/operation-steps';
import {
  CANCEL_OPERATION,
  MARK_STEP_COMPLETED,
  OperationTypes,
} from '../../operation/operation-type-names';
import {
  cancelOperation,
  clearDataRequested,
  duplicateRequested,
  importRequested,
  markStepCompleted,
} from './operation-actions';
import { ObjectImportType } from '../../mstr-object/constants';

describe('OperationActions', () => {
  it('returns IMPORT_OPERATION action on importRequested call', () => {
    // given
    const exampleObject = { objectWorkingId: 2137 };

    // when
    const importAction = importRequested(exampleObject);

    // then
    expect(importAction.type).toEqual(OperationTypes.IMPORT_OPERATION);
    expect(importAction.payload.operation.objectWorkingId).toEqual(exampleObject.objectWorkingId);
    expect(importAction.payload.operation.operationType).toEqual('IMPORT_OPERATION');
  });

  it('returns CLEAR_DATA_OPERATION action on clearDataRequested call', () => {
    // given
    const objectWorkingId = 2137;

    // when
    const importAction = clearDataRequested(objectWorkingId, ObjectImportType.TABLE);

    // then
    expect(importAction.type).toEqual(OperationTypes.CLEAR_DATA_OPERATION);
    expect(importAction.payload.operation.objectWorkingId).toEqual(objectWorkingId);
    expect(importAction.payload.operation.operationType).toEqual(
      OperationTypes.CLEAR_DATA_OPERATION
    );
    expect(importAction.payload.operation.stepsQueue).toEqual(
      operationsMap.table[OperationTypes.CLEAR_DATA_OPERATION]
    );
  });

  it('returns MARK_STEP_COMPLETED action on markStepCompleted call', () => {
    // given
    const objectWorkingId = 2137;
    const exampleStep = 'completedStep' as OperationSteps;

    // when
    const completedAction = markStepCompleted(objectWorkingId, exampleStep);
    // then
    expect(completedAction.type).toEqual(MARK_STEP_COMPLETED);
    expect(completedAction.payload.objectWorkingId).toBe(objectWorkingId);
    expect(completedAction.payload.completedStep).toBe(exampleStep);
  });

  it('returns CANCEL_OPERATION action on cancelOperation call', () => {
    // given
    const objectWorkingId = 2137;

    // when
    const cancelAction = cancelOperation(objectWorkingId);
    // then
    expect(cancelAction.type).toEqual(CANCEL_OPERATION);
    expect(cancelAction.payload.objectWorkingId).toBe(objectWorkingId);
  });

  it('returns DUPLICATE_OPERATION action on duplicateRequested call', () => {
    // given
    const exampleObject = {
      objectWorkingId: 123,
      otherProperty: 'someValue',
    };
    // when
    const duplicateAction = duplicateRequested(exampleObject);
    // then
    expect(duplicateAction.type).toEqual(OperationTypes.DUPLICATE_OPERATION);
    expect(duplicateAction.payload.operation.objectWorkingId).toEqual(
      exampleObject.objectWorkingId
    );
    expect(duplicateAction.payload.operation.operationType).toEqual('DUPLICATE_OPERATION');
  });
});
