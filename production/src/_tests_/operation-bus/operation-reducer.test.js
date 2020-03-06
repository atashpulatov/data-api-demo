import { IMPORT_REQUESTED, MARK_STEP_COMPLETED } from '../../operation/operation-actions';
import { operationReducer } from '../../operation/operation-reducer';

describe('operation reducer', () => {
  const initialOperation = {
    objectWorkingId: 'someStringId123',
    operationType: 'someType',
    objectId: 'someId',
  };
  const initialState = {
    empty: { operations:[] },
    singleOperation:{
      operations: [{
        objectWorkingId: 'someOtherString234',
        operationType: 'someType24',
        stepsQueue: ['step1', 'step2', 'step3'],
        totalRows: 100000,
        loadedRows: 0,
      }]
    },
    multipleOperations:   {
      operations:[{
        objectWorkingId: 'someOtherString2',
        operationType: 'someType',
        stepsQueue: ['step1', 'step2', 'step3'],
        totalRows: 100000,
        loadedRows: 0,
      },
      {
        objectWorkingId: 'someOtherString23',
        operationType: 'someOtherType',
        stepsQueue: ['step2a', 'step3a', 'step4'],
        totalRows: 100000,
        loadedRows: 2000,
      },
      {
        objectWorkingId: 'someOtherString234',
        operationType: 'someNextType',
        stepsQueue: ['step1', 'step2', 'step3'],
        totalRows: 100000,
        loadedRows: 1000,
      }]
    }
  };

  it('should have default state', () => {
    // given
    const unhandledAction = { type: 'someType', };

    // when
    const resultState = operationReducer(undefined, unhandledAction);

    // then
    expect(resultState).toEqual({ operations: [] });
  });

  it('should return state if no action is matched', () => {
    // given
    const unhandledAction = { type: 'someType', };

    // when
    const resultState = operationReducer(initialState.multipleOperations, unhandledAction);

    // then
    expect(resultState).toBe(initialState.multipleOperations);
  });

  describe('importRequested', () => {
    it('should add operation when operations are empty', () => {
      // given
      const someOperation = {};
      const action = {
        type: IMPORT_REQUESTED,
        payload: { operation: someOperation, },
      };
      const expectedState = { operations: [someOperation] };

      // when
      const resultState = operationReducer(initialState.empty, action);

      // then
      expect(resultState).toEqual(expectedState);
    });

    it('should add operation to existing operations', () => {
      // given
      const someOperation = {};
      const action = {
        type: IMPORT_REQUESTED,
        payload: { operation: someOperation, },
      };
      const expectedState = { operations: [...initialState.singleOperation.operations, someOperation] };

      // when
      const resultState = operationReducer(initialState.singleOperation, action);

      // then
      expect(resultState).toEqual(expectedState);
    });
  });

  describe('markStepCompleted', () => {

  });
});
