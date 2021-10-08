import operationErrorHandler from '../../../operation/operation-error-handler';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepClearTableData from '../../../office/clear-data/step-clear-table-data';
import { officeRemoveHelper } from '../../../office/remove/office-remove-helper';

describe('StepclearTableData', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
  objectExist  | calledClearTable
  ${true}      | ${1}
  ${false}     | ${0}

  
`('clearTableData should works correctly', async ({ objectExist, calledClearTable }) => {
  // given
    const objectData = { };
    const operationData = { objectExist };

    const mockedRemoveTable = jest.spyOn(officeRemoveHelper, 'removeOfficeTableBody').mockImplementation();
    const mockedCompleteStep = jest.spyOn(operationStepDispatcher, 'completeClearTableData').mockImplementation();

    // when
    await stepClearTableData.clearTableData(objectData, operationData);

    // then
    expect(mockedRemoveTable).toBeCalledTimes(calledClearTable);
    expect(mockedCompleteStep).toBeCalledTimes(1);
    expect(mockedCompleteStep).toBeCalledWith(operationData.objectWorkingId);
  });

  it('should handle error on clearTableData', async () => {
    // given
    const objectData = { };
    const operationData = { objectExist: true };
    const error = new Error('error');

    jest.spyOn(console, 'error').mockImplementation();
    const mockedRemoveTable = jest.spyOn(officeRemoveHelper, 'removeOfficeTableBody').mockImplementation(() => { throw error; });
    const mockedHandleError = jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepClearTableData.clearTableData(objectData, operationData);

    // then
    expect(mockedRemoveTable).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledTimes(1);
    expect(mockedHandleError).toBeCalledWith(objectData, operationData, error);
  });
});
