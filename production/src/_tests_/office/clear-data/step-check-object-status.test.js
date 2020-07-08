import operationErrorHandler from '../../../operation/operation-error-handler';
import stepCheckObjectStatus from '../../../office/clear-data/step-check-object-status';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import { officeRemoveHelper } from '../../../office/remove/office-remove-helper';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';

describe('StepCheckObjectStatus', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('checkObjectStatus should works correctly', async () => {
    // given
    const objectData = { };
    const operationData = { objectWorkingId: 1 };

    const mockedExcelContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation();
    const mockedCheckObject = jest.spyOn(officeRemoveHelper, 'checkIfObjectExist').mockImplementation();
    const mockedUpdateOperation = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();
    const mockedCompleteStep = jest.spyOn(operationStepDispatcher, 'completeCheckObjectStatus').mockImplementation();

    // when
    await stepCheckObjectStatus.checkObjectStatus(objectData, operationData);

    // then
    expect(mockedExcelContext).toBeCalledTimes(1);
    expect(mockedCheckObject).toBeCalledTimes(1);
    expect(mockedUpdateOperation).toBeCalledTimes(1);
    expect(mockedCompleteStep).toBeCalledTimes(1);
    expect(mockedCompleteStep).toBeCalledWith(operationData.objectWorkingId);
  });

  it('should handle error on checkObjectStatus', async () => {
    // given
    const objectData = { objectWorkingId: 1 };
    const operationData = {};
    const error = new Error('error');

    jest.spyOn(console, 'error').mockImplementation();
    const mockedExcelContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => { throw error; });
    const mockedHandleError = jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepCheckObjectStatus.checkObjectStatus(objectData, operationData);

    // then
    expect(mockedExcelContext).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledWith(objectData, operationData, error);
  });
});
