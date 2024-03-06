import { operationsMap } from "../../operation/operation-steps";
import {
  CANCEL_OPERATION,
  CLEAR_DATA_OPERATION,
  DUPLICATE_OPERATION,
  IMPORT_OPERATION,
  MARK_STEP_COMPLETED,
} from "../../operation/operation-type-names";
import {
  cancelOperation,
  clearDataRequested,
  duplicateRequested,
  importRequested,
  markStepCompleted,
} from "../../redux-reducer/operation-reducer/operation-actions";

describe("OperationActions", () => {
  it("returns IMPORT_OPERATION action on importRequested call", () => {
    // given
    const exampleObject = {};

    // when
    const importAction = importRequested(exampleObject);

    // then
    expect(importAction.type).toEqual(IMPORT_OPERATION);
    expect(importAction.payload.object).toBe(exampleObject);
    expect(importAction.payload.operation.objectWorkingId).toEqual(
      exampleObject.objectWorkingId
    );
    expect(importAction.payload.operation.operationType).toEqual(
      "IMPORT_OPERATION"
    );
  });

  it("returns CLEAR_DATA_OPERATION action on clearDataRequested call", () => {
    // given
    const objectWorkingId = "testId";

    // when
    const importAction = clearDataRequested(objectWorkingId);

    // then
    expect(importAction.type).toEqual(CLEAR_DATA_OPERATION);
    expect(importAction.payload.objectWorkingId).toBe(objectWorkingId);
    expect(importAction.payload.operation.objectWorkingId).toEqual(
      objectWorkingId
    );
    expect(importAction.payload.operation.operationType).toEqual(
      CLEAR_DATA_OPERATION
    );
    expect(importAction.payload.operation.stepsQueue).toEqual(
      operationsMap.table[CLEAR_DATA_OPERATION]
    );
  });

  it("returns MARK_STEP_COMPLETED action on markStepCompleted call", () => {
    // given
    const exampleId = "exampleId";
    const exampleStep = "completedStep";

    // when
    const completedAction = markStepCompleted(exampleId, exampleStep);
    // then
    expect(completedAction.type).toEqual(MARK_STEP_COMPLETED);
    expect(completedAction.payload.objectWorkingId).toBe(exampleId);
    expect(completedAction.payload.completedStep).toBe(exampleStep);
  });

  it("returns CANCEL_OPERATION action on cancelOperation call", () => {
    // given
    const exampleId = "exampleId";

    // when
    const cancelAction = cancelOperation(exampleId);
    // then
    expect(cancelAction.type).toEqual(CANCEL_OPERATION);
    expect(cancelAction.payload.objectWorkingId).toBe(exampleId);
  });

  it("returns DUPLICATE_OPERATION action on duplicateRequested call", () => {
    // given
    const exampleObject = {
      objectWorkingId: 123,
      otherProperty: "someValue",
    };
    // when
    const duplicateAction = duplicateRequested(exampleObject);
    // then
    expect(duplicateAction.type).toEqual(DUPLICATE_OPERATION);
    expect(duplicateAction.payload.operation.objectWorkingId).toEqual(
      exampleObject.objectWorkingId
    );
    expect(duplicateAction.payload.operation.operationType).toEqual(
      "DUPLICATE_OPERATION"
    );
  });
});
