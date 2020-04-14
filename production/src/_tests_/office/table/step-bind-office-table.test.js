import stepBindOfficeTable from '../../../office/table/step-bind-office-table';
import officeApiDataLoader from '../../../office/api/office-api-data-loader';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../../operation/operation-error-handler';

describe('StepBindOfficeTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('bindOfficeTable should handle exception', async () => {
    // given
    console.error = jest.fn();

    jest.spyOn(officeApiDataLoader, 'loadExcelDataSingle').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepBindOfficeTable.bindOfficeTable({}, {});

    // then
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith({}, {}, new Error('errorTest'));
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
    };

    jest.spyOn(officeApiDataLoader, 'loadExcelDataSingle').mockReturnValue('tableNameTest');

    jest.spyOn(officeApiHelper, 'bindNamedItem').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeBindOfficeTable').mockImplementation();

    // when
    await stepBindOfficeTable.bindOfficeTable(objectData, operationData);

    // then
    expect(officeApiDataLoader.loadExcelDataSingle).toBeCalledTimes(1);
    expect(officeApiDataLoader.loadExcelDataSingle).toBeCalledWith('excelContextTest', 'officeTableTest', 'name');

    expect(officeApiHelper.bindNamedItem).toBeCalledTimes(1);
    expect(officeApiHelper.bindNamedItem).toBeCalledWith('tableNameTest', 'bindIdTest');

    expect(operationStepDispatcher.completeBindOfficeTable).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeBindOfficeTable).toBeCalledWith('objectWorkingIdTest');
  });
});
