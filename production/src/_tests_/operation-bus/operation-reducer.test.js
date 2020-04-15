/* eslint-disable object-curly-newline, indent */
import {
  IMPORT_OPERATION,
  MARK_STEP_COMPLETED,
  CANCEL_OPERATION,
  DUPLICATE_OPERATION,
  REFRESH_OPERATION,
  EDIT_OPERATION,
  REMOVE_OPERATION,
  CLEAR_DATA_OPERATION,
} from '../../operation/operation-type-names';
import { operationReducer } from '../../redux-reducer/operation-reducer/operation-reducer';

describe('operation reducer', () => {
  let initialState;
  // eslint-disable-next-line no-underscore-dangle
  const _initialState = {
    empty: { operations: [] },
    singleOperation: {
      operations: [{
        objectWorkingId: 'someOtherString234',
        operationType: 'someType24',
        stepsQueue: ['step1', 'step2', 'step3'],
        totalRows: 100000,
        loadedRows: 0,
      }]
    },
    multipleOperations: {
      operations: [{
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

  beforeEach(() => {
    initialState = JSON.parse(JSON.stringify(_initialState));
  });

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

  describe('importRequested and other types of actions', () => {
    it.each`
      actionType
      ${IMPORT_OPERATION}
      ${REFRESH_OPERATION}
      ${EDIT_OPERATION}
      ${DUPLICATE_OPERATION}
      ${REMOVE_OPERATION} 
      ${CLEAR_DATA_OPERATION} 
    `('should add operation when operations are empty', ({ actionType }) => {
      // given
      const someOperation = {};
      const action = {
        type: actionType,
        payload: { operation: someOperation, },
      };
      const expectedState = { operations: [someOperation] };

      // when
      const resultState = operationReducer(initialState.empty, action);

      // then
      expect(resultState).toEqual(expectedState);
    });

    it.each`
      actionType
      ${IMPORT_OPERATION}
      ${REFRESH_OPERATION}
      ${EDIT_OPERATION}
      ${DUPLICATE_OPERATION}
      ${REMOVE_OPERATION} 
      ${CLEAR_DATA_OPERATION} 
    `('should add operation to existing operations', ({ actionType }) => {
      // given
      const someOperation = {};
      const action = {
        type: actionType,
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
    it('should throw error if the current operation is not the completed step', () => {
      // given
      const stepCompleted = 'step2';
      const action = {
        type: MARK_STEP_COMPLETED,
        payload: {
          objectWorkingId: 'someOtherString2',
          completedStep: stepCompleted
        },
      };

      // when
      const throwingCall = () => operationReducer(initialState.multipleOperations, action);

      // then
      expect(throwingCall).toThrow();
    });

    it('should throw error if the operation object does not exist', () => {
      // given
      const stepCompleted = 'step2';
      const action = {
        type: MARK_STEP_COMPLETED,
        payload: {
          objectWorkingId: 'someNotExistingOperation',
          completedStep: stepCompleted
        },
      };

      // when
      const throwingCall = () => operationReducer(initialState.multipleOperations, action);

      // then
      expect(throwingCall).toThrow();
    });

    it('should remove operation if the last step was completed', () => {
      // given
      const initialStateLastStep = {
        operations: [{
          objectWorkingId: 'someOtherString234',
          operationType: 'someType24',
          stepsQueue: ['step3'],
          totalRows: 100000,
          loadedRows: 0,
        }]
      };
      const action = {
        type: MARK_STEP_COMPLETED,
        payload: {
          objectWorkingId: 'someOtherString234',
          completedStep: 'step3',
        },
      };

      // when
      const resultState = operationReducer(initialStateLastStep, action);

      // then
      expect(resultState).toEqual({ operations: [] });
    });
    it('should remove completed step on single operation queue', () => {
      // given
      const action = {
        type: MARK_STEP_COMPLETED,
        payload: {
          objectWorkingId: 'someOtherString234',
          completedStep: 'step1',
        },
      };

      // when
      const resultState = operationReducer(initialState.singleOperation, action);

      // then
      expect(resultState.operations[0].stepsQueue).toHaveLength(2);
      expect(resultState.operations[0].stepsQueue).toEqual(['step2', 'step3']);
    });
    it('should remove completed step on multi operation queue', () => {
      // given
      const action = {
        type: MARK_STEP_COMPLETED,
        payload: {
          objectWorkingId: 'someOtherString23',
          completedStep: 'step2a',
        },
      };

      // when
      const resultState = operationReducer(initialState.multipleOperations, action);

      // then
      expect(resultState.operations[1].stepsQueue).toHaveLength(2);
      expect(resultState.operations[1].stepsQueue).toEqual(['step3a', 'step4']);
    });
  });

  describe('cancelOperation', () => {
    it('throws error if there is no operation with given ID', () => {
      // given
      const action = {
        type: CANCEL_OPERATION,
        payload: { objectWorkingId: 'wrongId', },
      };

      // when
      const throwingCall = () => operationReducer(initialState.multipleOperations, action);

      // then
      expect(throwingCall).toThrow();
    });

    it('deletes operation when CANCEL_OPERATION called', () => {
      // given
      const action = {
        type: CANCEL_OPERATION,
        payload: { objectWorkingId: 'someOtherString23', },
      };

      // when
      const resultState = operationReducer(initialState.multipleOperations, action);

      // then
      expect(resultState.operations).toHaveLength(2);
    });
  });
});
