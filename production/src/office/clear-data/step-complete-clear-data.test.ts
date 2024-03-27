import officeReducerHelper from '../store/office-reducer-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepCompleteClearData from './step-complete-clear-data';

describe('StepClearCrosstabHeaders', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('StepHighlightObject should highligh object', async () => {
    // given
    const objectData = {} as ObjectData;
    const operationData = { objectWorkingId: 1 } as OperationData;

    const mockedGetOperations = jest
      .spyOn(officeReducerHelper, 'getOperationsListFromOperationReducer')
      .mockReturnValue([{}, {}] as OperationData[]);
    const mockedGetObjects = jest
      .spyOn(officeReducerHelper, 'getObjectsListFromObjectReducer')
      .mockImplementation();
    const mockedCompleteStep = jest
      .spyOn(operationStepDispatcher, 'completeClearData')
      .mockImplementation();

    // when
    await stepCompleteClearData.completeClearData(objectData, operationData);

    // then
    expect(mockedGetOperations).toBeCalledTimes(1);
    expect(mockedGetObjects).toBeCalledTimes(1);
    expect(mockedCompleteStep).toBeCalledTimes(1);
  });

  it('should handle error on clearCrosstabHeaders', async () => {
    // given
    const objectData = {} as ObjectData;
    const operationData = { objectWorkingId: 1 } as OperationData;
    const error = new Error('error');

    jest.spyOn(console, 'error').mockImplementation();
    const mockedGetOperations = jest
      .spyOn(officeReducerHelper, 'getOperationsListFromOperationReducer')
      .mockImplementation(() => {
        throw error;
      });
    const mockedHandleError = jest
      .spyOn(operationErrorHandler, 'handleOperationError')
      .mockImplementation();

    // when
    await stepCompleteClearData.completeClearData(objectData, operationData);

    // then
    expect(mockedGetOperations).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledWith(objectData, operationData, error);
  });
});
