import { OperationData, OperationState } from './operation-reducer-types';

import {
  CANCEL_OPERATION,
  MARK_STEP_COMPLETED,
  OperationTypes,
} from '../../operation/operation-type-names';
import { operationReducer } from './operation-reducer';

describe('operation reducer', () => {
  let initialState: any;

  const initialStateMock = {
    empty: { operations: [] as OperationData[] },
    singleOperation: {
      operations: [
        {
          objectWorkingId: 2137,
          operationType: 'someType24',
          stepsQueue: ['step1', 'step2', 'step3'],
          totalRows: 100000,
          loadedRows: 0,
        },
      ],
    },
    multipleOperations: {
      operations: [
        {
          objectWorkingId: 1,
          operationType: 'someType',
          stepsQueue: ['step1', 'step2', 'step3'],
          totalRows: 100000,
          loadedRows: 0,
        },
        {
          objectWorkingId: 2,
          operationType: 'someOtherType',
          stepsQueue: ['step2a', 'step3a', 'step4'],
          totalRows: 100000,
          loadedRows: 2000,
        },
        {
          objectWorkingId: 2137,
          operationType: 'someNextType',
          stepsQueue: ['step1', 'step2', 'step3'],
          totalRows: 100000,
          loadedRows: 1000,
        },
      ],
    },
  };

  beforeEach(() => {
    initialState = JSON.parse(JSON.stringify(initialStateMock));
  });

  it('should have default state', () => {
    // given
    const unhandledAction = { type: 'someType' } as any;

    // when
    const resultState = operationReducer(undefined, unhandledAction);

    // then
    expect(resultState).toEqual({ operations: [] });
  });

  it('should return state if no action is matched', () => {
    // given
    const unhandledAction = { type: 'someType' } as any;

    // when
    const resultState = operationReducer(initialState.multipleOperations, unhandledAction);

    // then
    expect(resultState).toBe(initialState.multipleOperations);
  });

  describe('importRequested and other types of actions', () => {
    it.each`
      actionType
      ${OperationTypes.IMPORT_OPERATION}
      ${OperationTypes.REFRESH_OPERATION}
      ${OperationTypes.EDIT_OPERATION}
      ${OperationTypes.DUPLICATE_OPERATION}
      ${OperationTypes.REMOVE_OPERATION}
      ${OperationTypes.CLEAR_DATA_OPERATION}
    `('should add operation when operations are empty', ({ actionType }) => {
      // given
      const someOperation = {};
      const action: any = {
        type: actionType,
        payload: { operation: someOperation },
      };
      const expectedState = { operations: [someOperation] };

      // when
      const resultState = operationReducer(initialState.empty, action);

      // then
      expect(resultState).toEqual(expectedState);
    });

    it.each`
      actionType
      ${OperationTypes.IMPORT_OPERATION}
      ${OperationTypes.REFRESH_OPERATION}
      ${OperationTypes.EDIT_OPERATION}
      ${OperationTypes.DUPLICATE_OPERATION}
      ${OperationTypes.REMOVE_OPERATION}
      ${OperationTypes.CLEAR_DATA_OPERATION}
    `('should add operation to existing operations', ({ actionType }) => {
      // given
      const someOperation = {};
      const action: any = {
        type: actionType,
        payload: { operation: someOperation },
      };
      const expectedState = {
        operations: [...initialState.singleOperation.operations, someOperation],
      };

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
      const action: any = {
        type: MARK_STEP_COMPLETED,
        payload: {
          objectWorkingId: 1,
          completedStep: stepCompleted,
        },
      };

      // when
      const throwingCall = (): OperationState =>
        operationReducer(initialState.multipleOperations, action);

      // then
      expect(throwingCall).toThrow();
    });

    it('should throw error if the operation object does not exist', () => {
      // given
      const stepCompleted = 'step2';
      const action: any = {
        type: MARK_STEP_COMPLETED,
        payload: {
          objectWorkingId: 'someNotExistingOperation',
          completedStep: stepCompleted,
        },
      };

      // when
      const throwingCall = (): OperationState =>
        operationReducer(initialState.multipleOperations, action);

      // then
      expect(throwingCall).toThrow();
    });

    it('should remove operation if the last step was completed', () => {
      // given
      const initialStateLastStep: any = {
        operations: [
          {
            objectWorkingId: 2137,
            operationType: 'someType24',
            stepsQueue: ['step3'],
            totalRows: 100000,
            loadedRows: 0,
          },
        ],
      };
      const action: any = {
        type: MARK_STEP_COMPLETED,
        payload: {
          objectWorkingId: 2137,
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
      const action: any = {
        type: MARK_STEP_COMPLETED,
        payload: {
          objectWorkingId: 2137,
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
      const action: any = {
        type: MARK_STEP_COMPLETED,
        payload: {
          objectWorkingId: 2,
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
      const action: any = {
        type: CANCEL_OPERATION,
        payload: { objectWorkingId: 'wrongId' },
      };

      // when
      const throwingCall = (): OperationState =>
        operationReducer(initialState.multipleOperations, action);

      // then
      expect(throwingCall).toThrow();
    });

    it('deletes operation when CANCEL_OPERATION called', () => {
      // given
      const action: any = {
        type: CANCEL_OPERATION,
        payload: { objectWorkingId: 2 },
      };

      // when
      const resultState = operationReducer(initialState.multipleOperations, action);

      // then
      expect(resultState.operations).toHaveLength(2);
    });
  });
});
