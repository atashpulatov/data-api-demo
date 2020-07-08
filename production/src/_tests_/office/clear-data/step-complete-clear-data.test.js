import operationErrorHandler from '../../../operation/operation-error-handler';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepClearCrosstabHeaders from '../../../office/clear-data/step-clear-crosstab-headers';
import stepCompleteClearData from '../../../office/clear-data/step-complete-clear-data';
import officeReducerHelper from '../../../office/store/office-reducer-helper';

describe('StepClearCrosstabHeaders', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });


  it('StepHighlightObject should highligh object', async () => {
    // given
    const objectData = { };
    const operationData = { objectWorkingId: 1 };

    const mockedGetOperations = jest.spyOn(officeReducerHelper, 'getOperationsListFromOperationReducer').mockReturnValue([{}, {}]);
    const mockedGetObjects = jest.spyOn(officeReducerHelper, 'getObjectsListFromObjectReducer').mockImplementation();
    const mockedCompleteStep = jest.spyOn(operationStepDispatcher, 'completeClearData').mockImplementation();

    // when
    await stepCompleteClearData.completeClearData(objectData, operationData);

    // then
    expect(mockedGetOperations).toBeCalledTimes(1);
    expect(mockedGetObjects).toBeCalledTimes(1);
    expect(mockedCompleteStep).toBeCalledTimes(1);
  });

  it('should handle error on clearCrosstabHeaders', async () => {
    // given
    const objectData = {};
    const operationData = { objectWorkingId: 1 };
    const error = new Error('error');

    jest.spyOn(console, 'error').mockImplementation();
    const mockedGetOperations = jest.spyOn(officeReducerHelper, 'getOperationsListFromOperationReducer').mockImplementation(() => { throw error; });
    const mockedHandleError = jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepCompleteClearData.completeClearData(objectData, operationData);

    // then
    expect(mockedGetOperations).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledWith(objectData, operationData);
  });
});
