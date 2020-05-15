import stepGetOfficeTableEditRefresh from '../../../office/table/step-get-office-table-edit-refresh';
import getOfficeTableHelper from '../../../office/table/get-office-table-helper';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import officeTableRefresh from '../../../office/table/office-table-refresh';
import officeTableCreate from '../../../office/table/office-table-create';
import officeTableUpdate from '../../../office/table/office-table-update';
import operationErrorHandler from '../../../operation/operation-error-handler';

describe('StepGetOfficeTableEditRefresh', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getOfficeTableEditRefresh should handle error', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(getOfficeTableHelper, 'checkReportTypeChange').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh({}, { instanceDefinition: {} });

    // then
    expect(getOfficeTableHelper.checkReportTypeChange).toBeCalledTimes(1);
    expect(getOfficeTableHelper.checkReportTypeChange).toThrowError(Error);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith({}, { instanceDefinition: {} }, new Error('errorTest'));
  });

  it('getOfficeTableEditRefresh should work as expected when tableChanged true', async () => {
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

    jest.spyOn(getOfficeTableHelper, 'checkReportTypeChange').mockImplementation();

    jest.spyOn(officeTableRefresh, 'getExistingOfficeTableData').mockImplementation(() => ({
      tableChanged: true,
      prevOfficeTable: 'prevOfficeTableTest',
      startCell: 'startCellTest',
    }));

    jest.spyOn(officeTableCreate, 'createOfficeTable').mockImplementation(() => ({
      officeTable: 'officeTableTest',
      bindId: 'bindIdTest',
    }));

    jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeGetOfficeTableEditRefresh').mockImplementation();

    // when
    await stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh(objectData, operationData);

    // then
    expect(getOfficeTableHelper.checkReportTypeChange).toBeCalledTimes(1);
    expect(getOfficeTableHelper.checkReportTypeChange).toBeCalledWith('mstrTableTest');

    expect(officeTableRefresh.getExistingOfficeTableData).toBeCalledTimes(1);
    expect(officeTableRefresh.getExistingOfficeTableData).toBeCalledWith(
      'excelContextTest',
      'oldBindIdTest',
      { mstrTable: 'mstrTableTest' },
      'previousTableDimensionsTest',
    );

    expect(officeTableCreate.createOfficeTable).toBeCalledTimes(1);
    expect(officeTableCreate.createOfficeTable).toBeCalledWith({
      instanceDefinition: { mstrTable: 'mstrTableTest' },
      excelContext: 'excelContextTest',
      startCell: 'startCellTest',
      tableName: 'tableNameTest',
      prevOfficeTable: 'prevOfficeTableTest',
      tableChanged: true,
    });

    expect(operationStepDispatcher.updateOperation).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateOperation).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      officeTable: 'officeTableTest',
      shouldFormat: undefined,
      tableChanged: true,
      instanceDefinition: { mstrTable: 'mstrTableTest' },
      startCell: 'startCellTest',
    });

    expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      bindId: 'bindIdTest',
    });

    expect(operationStepDispatcher.completeGetOfficeTableEditRefresh).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeGetOfficeTableEditRefresh).toBeCalledWith('objectWorkingIdTest');
  });

  it.each`
  inputNameAndFormatShouldUpdate | resultShouldFormat
  
  ${true}                        | ${true}
  ${false}                       | ${false}
  
  `('getOfficeTableEditRefresh should work as expected when tableChanged',
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

    jest.spyOn(getOfficeTableHelper, 'checkReportTypeChange').mockImplementation();

    jest.spyOn(officeTableRefresh, 'getExistingOfficeTableData')
      .mockImplementation(() => ({
        tableChanged: false,
        prevOfficeTable: 'prevOfficeTableTest',
        startCell: 'startCellTest',
      }));

    jest.spyOn(officeTableUpdate, 'updateOfficeTable').mockReturnValue('officeTableTest');

    jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeGetOfficeTableEditRefresh').mockImplementation();

    // when
    await stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh(objectData, operationData);

    // then
    expect(getOfficeTableHelper.checkReportTypeChange).toBeCalledTimes(1);
    expect(getOfficeTableHelper.checkReportTypeChange).toBeCalledWith('mstrTableTest');

    expect(officeTableRefresh.getExistingOfficeTableData).toBeCalledTimes(1);
    expect(officeTableRefresh.getExistingOfficeTableData).toBeCalledWith(
      'excelContextTest',
      'oldBindIdTest',
      { mstrTable: 'mstrTableTest' },
      'previousTableDimensionsTest',
    );

    expect(officeTableUpdate.updateOfficeTable).toBeCalledTimes(1);
    expect(officeTableUpdate.updateOfficeTable).toBeCalledWith(
      { mstrTable: 'mstrTableTest' },
      'excelContextTest',
      'startCellTest',
      'prevOfficeTableTest',
    );

    expect(operationStepDispatcher.updateOperation).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateOperation).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      officeTable: 'officeTableTest',
      shouldFormat: resultShouldFormat,
      tableChanged: false,
      instanceDefinition: { mstrTable: 'mstrTableTest' },
      startCell: 'startCellTest',
    });

    expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({ objectWorkingId: 'objectWorkingIdTest', bindId: 'oldBindIdTest', });

    expect(operationStepDispatcher.completeGetOfficeTableEditRefresh).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeGetOfficeTableEditRefresh).toBeCalledWith('objectWorkingIdTest');
  });
});
