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
    console.error = jest.fn();

    const checkReportTypeChangeMock = jest.spyOn(getOfficeTableHelper, 'checkReportTypeChange')
      .mockImplementation(() => {
        throw new Error('errorTest');
      });

    // when
    await stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh({}, { instanceDefinition: {} });

    // then
    expect(checkReportTypeChangeMock).toBeCalledTimes(1);
    expect(checkReportTypeChangeMock).toThrowError(Error);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));
  });

  it('getOfficeTableEditRefresh should work as expected when tableColumnsChanged true', async () => {
    // given
    const objectData = {
      tableName: 'tableNameTest',
      previousTableDimensions: 'previousTableDimensionsTest',
      visualizationInfo: 'visualizationInfoTest',
      objectWorkingId: 'objectWorkingIdTest',
    };

    const operationData = {
      excelContext: 'excelContextTest',
      instanceDefinition: { mstrTable: 'mstrTableTest' },
      oldBindId: 'oldBindIdTest',
    };

    const checkReportTypeChangeMock = jest.spyOn(getOfficeTableHelper, 'checkReportTypeChange').mockImplementation();

    const getExistingOfficeTableDataMock = jest.spyOn(officeTableRefresh, 'getExistingOfficeTableData')
      .mockImplementation(() => ({
        tableColumnsChanged: true,
        prevOfficeTable: 'prevOfficeTableTest',
        startCell: 'startCellTest',
      }));

    const createOfficeTableMock = jest.spyOn(officeTableCreate, 'createOfficeTable')
      .mockImplementation(() => ({
        officeTable: 'officeTableTest',
        bindId: 'bindIdTest',
      }));

    const updateOperationMock = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const updateObjectMock = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const completeGetOfficeTableEditRefreshMock = jest.spyOn(
      operationStepDispatcher, 'completeGetOfficeTableEditRefresh'
    ).mockImplementation();

    // when
    await stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh(objectData, operationData);

    // then
    expect(checkReportTypeChangeMock).toBeCalledTimes(1);
    expect(checkReportTypeChangeMock).toBeCalledWith('mstrTableTest');

    expect(getExistingOfficeTableDataMock).toBeCalledTimes(1);
    expect(getExistingOfficeTableDataMock).toBeCalledWith(
      'excelContextTest',
      'oldBindIdTest',
      { mstrTable: 'mstrTableTest' },
      'previousTableDimensionsTest',
    );

    expect(createOfficeTableMock).toBeCalledTimes(1);
    expect(createOfficeTableMock).toBeCalledWith({
      instanceDefinition: { mstrTable: 'mstrTableTest' },
      excelContext: 'excelContextTest',
      startCell: 'startCellTest',
      tableName: 'tableNameTest',
      prevOfficeTable: 'prevOfficeTableTest',
      tableColumnsChanged: true,
    });

    expect(updateOperationMock).toBeCalledTimes(1);
    expect(updateOperationMock).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      officeTable: 'officeTableTest',
      shouldFormat: undefined,
      tableColumnsChanged: true,
      instanceDefinition: { mstrTable: 'mstrTableTest' },
      startCell: 'startCellTest',
    });

    expect(updateObjectMock).toBeCalledTimes(1);
    expect(updateObjectMock).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      bindId: 'bindIdTest',
    });

    expect(completeGetOfficeTableEditRefreshMock).toBeCalledTimes(1);
    expect(completeGetOfficeTableEditRefreshMock).toBeCalledWith('objectWorkingIdTest');
  });

  it.each`
  inputNameAndFormatShouldUpdate | resultShouldFormat
  
  ${true}                        | ${true}
  ${false}                       | ${false}
  
  `('getOfficeTableEditRefresh should work as expected when tableColumnsChanged',
  async ({ inputNameAndFormatShouldUpdate, resultShouldFormat }) => {
    // given
    const objectData = {
      tableName: 'tableNameTest',
      previousTableDimensions: 'previousTableDimensionsTest',
      objectWorkingId: 'objectWorkingIdTest',
    };

    const operationData = {
      excelContext: 'excelContextTest',
      instanceDefinition: { mstrTable: 'mstrTableTest' },
      oldBindId: 'oldBindIdTest',
      objectEditedData: { visualizationInfo: { nameAndFormatShouldUpdate: inputNameAndFormatShouldUpdate } },
    };

    const checkReportTypeChangeMock = jest.spyOn(getOfficeTableHelper, 'checkReportTypeChange').mockImplementation();

    const getExistingOfficeTableDataMock = jest.spyOn(officeTableRefresh, 'getExistingOfficeTableData')
      .mockImplementation(() => ({
        tableColumnsChanged: false,
        prevOfficeTable: 'prevOfficeTableTest',
        startCell: 'startCellTest',
      }));

    const updateOfficeTableMock = jest.spyOn(officeTableUpdate, 'updateOfficeTable')
      .mockImplementation(() => 'officeTableTest');

    const updateOperationMock = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const updateObjectMock = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const completeGetOfficeTableEditRefreshMock = jest.spyOn(
      operationStepDispatcher, 'completeGetOfficeTableEditRefresh'
    ).mockImplementation();

    // when
    await stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh(objectData, operationData);

    // then
    expect(checkReportTypeChangeMock).toBeCalledTimes(1);
    expect(checkReportTypeChangeMock).toBeCalledWith('mstrTableTest');

    expect(getExistingOfficeTableDataMock).toBeCalledTimes(1);
    expect(getExistingOfficeTableDataMock).toBeCalledWith(
      'excelContextTest',
      'oldBindIdTest',
      { mstrTable: 'mstrTableTest' },
      'previousTableDimensionsTest',
    );

    expect(updateOfficeTableMock).toBeCalledTimes(1);
    expect(updateOfficeTableMock).toBeCalledWith(
      { mstrTable: 'mstrTableTest' },
      'excelContextTest',
      'startCellTest',
      'prevOfficeTableTest',
    );

    expect(updateOperationMock).toBeCalledTimes(1);
    expect(updateOperationMock).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      officeTable: 'officeTableTest',
      shouldFormat: resultShouldFormat,
      tableColumnsChanged: false,
      instanceDefinition: { mstrTable: 'mstrTableTest' },
      startCell: 'startCellTest',
    });

    expect(updateObjectMock).toBeCalledTimes(1);
    expect(updateObjectMock).toBeCalledWith({ objectWorkingId: 'objectWorkingIdTest', bindId: 'oldBindIdTest', });

    expect(completeGetOfficeTableEditRefreshMock).toBeCalledTimes(1);
    expect(completeGetOfficeTableEditRefreshMock).toBeCalledWith('objectWorkingIdTest');
  });
});
