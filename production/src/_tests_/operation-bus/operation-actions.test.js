import { importRequested, IMPORT_REQUESTED, markStepCompleted } from '../../operation/operation-actions';

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
    const exampleId = {};
    const exampleStep = I;

    // when
    const completedAction = markStepCompleted(exampleId);
    // then
    expect(importAction.type).toEqual(IMPORT_REQUESTED);
    expect(importAction.payload.object).toBe(exampleObject);
    expect(importAction.payload.operation).toEqual({
      objectWorkingId: exampleObject.objectWorkingId,
      operationType: 'CREATE',
    });
  });
});
