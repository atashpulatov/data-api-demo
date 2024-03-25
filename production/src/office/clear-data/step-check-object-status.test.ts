import { officeApiHelper } from '../api/office-api-helper';
import { officeRemoveHelper } from '../remove/office-remove-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepCheckObjectStatus from './step-check-object-status';

describe('StepCheckObjectStatus', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('checkObjectStatus should works correctly', async () => {
    // given
    const objectData = {} as ObjectData;
    const operationData = { objectWorkingId: 1 } as unknown as OperationData;

    const mockedExcelContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation();
    const mockedCheckObject = jest
      .spyOn(officeRemoveHelper, 'checkIfObjectExist')
      .mockImplementation();
    const mockedUpdateOperation = jest
      .spyOn(operationStepDispatcher, 'updateOperation')
      .mockImplementation();
    const mockedCompleteStep = jest
      .spyOn(operationStepDispatcher, 'completeCheckObjectStatus')
      .mockImplementation();

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
    const operationData = {} as OperationData;
    const error = new Error('error');

    jest.spyOn(console, 'error').mockImplementation();
    const mockedExcelContext = jest
      .spyOn(officeApiHelper, 'getExcelContext')
      .mockImplementation(() => {
        throw error;
      });
    const mockedHandleError = jest
      .spyOn(operationErrorHandler, 'handleOperationError')
      .mockImplementation();

    // when
    await stepCheckObjectStatus.checkObjectStatus(objectData, operationData);

    // then
    expect(mockedExcelContext).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledWith(objectData, operationData, error);
  });
});
