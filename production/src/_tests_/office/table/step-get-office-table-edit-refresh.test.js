import stepGetOfficeTableEditRefresh from '../../../office/table/step-get-office-table-edit-refresh';
import getOfficeTableHelper from '../../../office/table/get-office-table-helper';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import officeTableRefresh from '../../../office/table/office-table-refresh';
import officeTableCreate from '../../../office/table/office-table-create';
import officeTableUpdate from '../../../office/table/office-table-update';

describe('StepGetOfficeTableEditRefresh', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getOfficeTableEditRefresh should log exceptions', async () => {
    // given
    console.log = jest.fn();

    const mockCheckReportTypeChange = jest.spyOn(getOfficeTableHelper, 'checkReportTypeChange')
      .mockImplementation(() => {
        throw new Error('testError');
      });

    // when
    await stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh({}, { instanceDefinition: {} });

    // then
    expect(mockCheckReportTypeChange).toBeCalledTimes(1);
    expect(mockCheckReportTypeChange).toThrowError(Error);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith('error:', new Error('testError'));
  });

  it('getOfficeTableEditRefresh should work as expected when tableColumnsChanged true', async () => {
    // given
    const objectData = {
      oldBindId: 'testOldBindId',
      tableName: 'testTableName',
      previousTableDimensions: 'testPreviousTableDimensions',
      visualizationInfo: 'testVisualizationInfo',
      objectWorkingId: 'testObjectWorkingId',
    };

    const operationData = {
      excelContext: 'testExcelContext',
      instanceDefinition: { mstrTable: 'testMstrTable' },
    };

    const mockCheckReportTypeChange = jest.spyOn(getOfficeTableHelper, 'checkReportTypeChange').mockImplementation();

    const mockGetExistingOfficeTableData = jest.spyOn(officeTableRefresh, 'getExistingOfficeTableData')
      .mockImplementation(() => ({
        tableColumnsChanged: true,
        prevOfficeTable: 'testPrevOfficeTable',
        startCell: 'testStartCell',
      }));

    const mockCreateOfficeTable = jest.spyOn(officeTableCreate, 'createOfficeTable')
      .mockImplementation(() => ({
        officeTable: 'testOfficeTable',
        bindId: 'testBindId',
      }));

    const mockUpdateOperation = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const mockUpdateObject = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const mockCompleteGetOfficeTableEditRefresh = jest.spyOn(
      operationStepDispatcher, 'completeGetOfficeTableEditRefresh'
    ).mockImplementation();

    // when
    await stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh(objectData, operationData);

    // then
    expect(mockCheckReportTypeChange).toBeCalledTimes(1);
    expect(mockCheckReportTypeChange).toBeCalledWith('testMstrTable');

    expect(mockGetExistingOfficeTableData).toBeCalledTimes(1);
    expect(mockGetExistingOfficeTableData).toBeCalledWith(
      'testExcelContext',
      'testOldBindId',
      { mstrTable: 'testMstrTable' },
      'testPreviousTableDimensions',
    );

    expect(mockCreateOfficeTable).toBeCalledTimes(1);
    expect(mockCreateOfficeTable).toBeCalledWith({
      instanceDefinition: { mstrTable: 'testMstrTable' },
      excelContext: 'testExcelContext',
      startCell: 'testStartCell',
      tableName: 'testTableName',
      prevOfficeTable: 'testPrevOfficeTable',
      tableColumnsChanged: true,
    });

    expect(mockUpdateOperation).toBeCalledTimes(1);
    expect(mockUpdateOperation).toBeCalledWith({
      objectWorkingId: 'testObjectWorkingId',
      officeTable: 'testOfficeTable',
      shouldFormat: undefined,
      tableColumnsChanged: true,
      instanceDefinition: { mstrTable: 'testMstrTable' },
      startCell: 'testStartCell',
    });

    expect(mockUpdateObject).toBeCalledTimes(1);
    expect(mockUpdateObject).toBeCalledWith({
      objectWorkingId: 'testObjectWorkingId',
      bindId: 'testBindId',
    });

    expect(mockCompleteGetOfficeTableEditRefresh).toBeCalledTimes(1);
    expect(mockCompleteGetOfficeTableEditRefresh).toBeCalledWith('testObjectWorkingId');
  });

  it.each`
  inputFormatShouldUpdate | resultShouldFormat
  
  ${true}                 | ${true}
  ${false}                | ${false}
  
  `('getOfficeTableEditRefresh should work as expected when tableColumnsChanged',
  async ({ inputFormatShouldUpdate, resultShouldFormat }) => {
    // given
    const objectData = {
      oldBindId: 'testOldBindId',
      tableName: 'testTableName',
      previousTableDimensions: 'testPreviousTableDimensions',
      visualizationInfo: { formatShouldUpdate: inputFormatShouldUpdate },
      objectWorkingId: 'testObjectWorkingId',
    };

    const operationData = {
      excelContext: 'testExcelContext',
      instanceDefinition: { mstrTable: 'testMstrTable' },
    };

    const mockCheckReportTypeChange = jest.spyOn(getOfficeTableHelper, 'checkReportTypeChange').mockImplementation();

    const mockGetExistingOfficeTableData = jest.spyOn(officeTableRefresh, 'getExistingOfficeTableData')
      .mockImplementation(() => ({
        tableColumnsChanged: false,
        prevOfficeTable: 'testPrevOfficeTable',
        startCell: 'testStartCell',
      }));

    const mockUpdateOfficeTable = jest.spyOn(officeTableUpdate, 'updateOfficeTable')
      .mockImplementation(() => 'testOfficeTable');

    const mockUpdateOperation = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const mockUpdateObject = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const mockCompleteGetOfficeTableEditRefresh = jest.spyOn(
      operationStepDispatcher, 'completeGetOfficeTableEditRefresh'
    ).mockImplementation();

    // when
    await stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh(objectData, operationData);

    // then
    expect(mockCheckReportTypeChange).toBeCalledTimes(1);
    expect(mockCheckReportTypeChange).toBeCalledWith('testMstrTable');

    expect(mockGetExistingOfficeTableData).toBeCalledTimes(1);
    expect(mockGetExistingOfficeTableData).toBeCalledWith(
      'testExcelContext',
      'testOldBindId',
      { mstrTable: 'testMstrTable' },
      'testPreviousTableDimensions',
    );

    expect(mockUpdateOfficeTable).toBeCalledTimes(1);
    expect(mockUpdateOfficeTable).toBeCalledWith(
      { mstrTable: 'testMstrTable' },
      'testExcelContext',
      'testStartCell',
      'testPrevOfficeTable',
    );

    expect(mockUpdateOperation).toBeCalledTimes(1);
    expect(mockUpdateOperation).toBeCalledWith({
      objectWorkingId: 'testObjectWorkingId',
      officeTable: 'testOfficeTable',
      shouldFormat: resultShouldFormat,
      tableColumnsChanged: false,
      instanceDefinition: { mstrTable: 'testMstrTable' },
      startCell: 'testStartCell',
    });

    expect(mockUpdateObject).toBeCalledTimes(1);
    expect(mockUpdateObject).toBeCalledWith({
      objectWorkingId: 'testObjectWorkingId',
      bindId: 'testOldBindId',
    });

    expect(mockCompleteGetOfficeTableEditRefresh).toBeCalledTimes(1);
    expect(mockCompleteGetOfficeTableEditRefresh).toBeCalledWith('testObjectWorkingId');
  });
});
