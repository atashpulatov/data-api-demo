import officeTableCreate from '../../../office/table/office-table-create';
import stepGetOfficeTableImport from '../../../office/table/step-get-office-table-import';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../../operation/operation-error-handler';

describe('StepGetOfficeTableImport', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getOfficeTableImport should log exceptions', async () => {
    // given
    console.error = jest.fn();

    jest.spyOn(officeTableCreate, 'createOfficeTable').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepGetOfficeTableImport.getOfficeTableImport({}, {});

    // then
    expect(officeTableCreate.createOfficeTable).toBeCalledTimes(1);
    expect(officeTableCreate.createOfficeTable).toThrowError(Error);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith({}, {}, new Error('errorTest'));
  });

  it('getOfficeTableImport should work as expected', async () => {
    // given
    const objectData = {};

    const operationData = {
      objectWorkingId: 'objectWorkingIdTest',
      excelContext: 'excelContextTest',
      instanceDefinition: 'instanceDefinitionTest',
      startCell: 'startCellTest',
    };

    jest.spyOn(officeTableCreate, 'createOfficeTable').mockImplementation(() => ({
      officeTable: 'officeTableTest',
      bindId: 'bindIdTest',
      tableName: 'newOfficeTableNameTest',
    }));

    jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeGetOfficeTableImport').mockImplementation();

    // when
    await stepGetOfficeTableImport.getOfficeTableImport(objectData, operationData);

    // then
    expect(officeTableCreate.createOfficeTable).toBeCalledTimes(1);
    expect(officeTableCreate.createOfficeTable).toBeCalledWith({
      excelContext: 'excelContextTest',
      instanceDefinition: 'instanceDefinitionTest',
      startCell: 'startCellTest',
    });

    expect(operationStepDispatcher.updateOperation).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateOperation).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      officeTable: 'officeTableTest',
      shouldFormat: true,
      tableColumnsChanged: false,
      instanceDefinition: 'instanceDefinitionTest',
      startCell: 'startCellTest',
    });

    expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      tableName: 'newOfficeTableNameTest',
      bindId: 'bindIdTest',
    });

    expect(operationStepDispatcher.completeGetOfficeTableImport).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeGetOfficeTableImport).toBeCalledWith('objectWorkingIdTest');
  });
});
