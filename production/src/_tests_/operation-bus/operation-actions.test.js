import {
  importRequested, IMPORT_REQUESTED, markStepCompleted, MARK_STEP_COMPLETED
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
    expect(importAction.payload.operation).toEqual({
      objectWorkingId: exampleObject.objectWorkingId,
      operationType: 'CREATE',
    });
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
});
