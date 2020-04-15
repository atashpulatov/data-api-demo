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
      bindId: 'bindIdTest',
      objectWorkingId: 'objectWorkingIdTest',
    };
    const operationData = {
      excelContext: 'excelContextTest',
      officeTable: 'officeTableTest',
    };

    const loadExcelDataSingleMock = jest.spyOn(officeApiDataLoader, 'loadExcelDataSingle').mockImplementation(
      () => 'tableNameTest'
    );

    const officeApiHelperMock = jest.spyOn(officeApiHelper, 'bindNamedItem').mockImplementation();

    const completeBindOfficeTableMock = jest.spyOn(
      operationStepDispatcher, 'completeBindOfficeTable'
    ).mockImplementation();

    // when
    await stepBindOfficeTable.bindOfficeTable(objectData, operationData);

    // then
    expect(loadExcelDataSingleMock).toBeCalledTimes(1);
    expect(loadExcelDataSingleMock).toBeCalledWith('excelContextTest', 'officeTableTest', 'name');

    expect(officeApiHelperMock).toBeCalledTimes(1);
    expect(officeApiHelperMock).toBeCalledWith('tableNameTest', 'bindIdTest');

    expect(completeBindOfficeTableMock).toBeCalledTimes(1);
    expect(completeBindOfficeTableMock).toBeCalledWith('objectWorkingIdTest');
  });
});
