import stepBindOfficeTable from '../../../office/table/step-bind-office-table';
import officeApiDataLoader from '../../../office/api/office-api-data-loader';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../../operation/operation-error-handler';
import { EDIT_OPERATION, IMPORT_OPERATION, REFRESH_OPERATION } from '../../../operation/operation-type-names';

describe('StepBindOfficeTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('bindOfficeTable should handle exception', async () => {
    // given
    const operationData = { tableColumnsChanged: true, };

    jest.spyOn(console, 'error');

    jest.spyOn(officeApiDataLoader, 'loadSingleExcelData').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepBindOfficeTable.bindOfficeTable({}, operationData);

    // then
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith({}, operationData, new Error('errorTest'));
  });

  it('bindOfficeTable should work as expected', async () => {
    // given
    const objectData = {
      bindId: 'bindIdTest',
      objectWorkingId: 'objectWorkingIdTest',
    };
    const operationData = {
      excelContext: 'excelContextTest',
      officeTable: 'officeTableTest',
      tableColumnsChanged: true,
    };

    jest.spyOn(officeApiDataLoader, 'loadSingleExcelData').mockReturnValue('tableNameTest');

    jest.spyOn(officeApiHelper, 'bindNamedItem').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeBindOfficeTable').mockImplementation();

    // when
    await stepBindOfficeTable.bindOfficeTable(objectData, operationData);

    // then
    expect(officeApiDataLoader.loadSingleExcelData).toBeCalledTimes(1);
    expect(officeApiDataLoader.loadSingleExcelData).toBeCalledWith('excelContextTest', 'officeTableTest', 'name');

    expect(officeApiHelper.bindNamedItem).toBeCalledTimes(1);
    expect(officeApiHelper.bindNamedItem).toBeCalledWith('tableNameTest', 'bindIdTest');

    expect(operationStepDispatcher.completeBindOfficeTable).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeBindOfficeTable).toBeCalledWith('objectWorkingIdTest');
  });

  it.each`
  operationType
  ${EDIT_OPERATION}      
  ${REFRESH_OPERATION}     
  
  `('should skip bindOfficeTable if no new table created', async ({ operationType }) => {
  // given
  const objectData = {
    bindId: 'bindIdTest',
    objectWorkingId: 'objectWorkingIdTest',
  };
  const operationData = {
    excelContext: 'excelContextTest',
    officeTable: 'officeTableTest',
    operationType,
    tableColumnsChanged: false,
  };

  jest.spyOn(officeApiDataLoader, 'loadSingleExcelData').mockReturnValue('tableNameTest');

  jest.spyOn(officeApiHelper, 'bindNamedItem').mockImplementation();

  jest.spyOn(operationStepDispatcher, 'completeBindOfficeTable').mockImplementation();

  // when
  await stepBindOfficeTable.bindOfficeTable(objectData, operationData);

  // then
  expect(officeApiDataLoader.loadSingleExcelData).toBeCalledTimes(0);

  expect(officeApiHelper.bindNamedItem).toBeCalledTimes(0);

  expect(operationStepDispatcher.completeBindOfficeTable).toBeCalledTimes(1);
  expect(operationStepDispatcher.completeBindOfficeTable).toBeCalledWith('objectWorkingIdTest');
});
});
