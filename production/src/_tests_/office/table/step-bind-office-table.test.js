import stepBindOfficeTable from '../../../office/table/step-bind-office-table';
import officeApiDataLoader from '../../../office/api/office-api-data-loader';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';

describe('StepBindOfficeTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('bindOfficeTable should work as expected', async () => {
    // given
    const objectData = {
      bindId: 'testBindId',
      objectWorkingId: 'testObjectWorkingId',
    };
    const operationData = {
      excelContext: 'testExcelContext',
      officeTable: 'testOfficeTable',
    };

    const mockLoadExcelDataSingle = jest.spyOn(officeApiDataLoader, 'loadExcelDataSingle').mockImplementation(
      () => 'testTableName'
    );

    const mockOfficeApiHelper = jest.spyOn(officeApiHelper, 'bindNamedItem').mockImplementation();

    const mockCompleteBindOfficeTable = jest.spyOn(
      operationStepDispatcher, 'completeBindOfficeTable'
    ).mockImplementation();

    // when
    await stepBindOfficeTable.bindOfficeTable(objectData, operationData);

    // then
    expect(mockLoadExcelDataSingle).toBeCalledTimes(1);
    expect(mockLoadExcelDataSingle).toBeCalledWith('testExcelContext', 'testOfficeTable', 'name');

    expect(mockOfficeApiHelper).toBeCalledTimes(1);
    expect(mockOfficeApiHelper).toBeCalledWith('testTableName', 'testBindId');

    expect(mockCompleteBindOfficeTable).toBeCalledTimes(1);
    expect(mockCompleteBindOfficeTable).toBeCalledWith('testObjectWorkingId');
  });
});
