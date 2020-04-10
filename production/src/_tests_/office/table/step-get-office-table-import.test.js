import officeTableCreate from '../../../office/table/office-table-create';
import stepGetOfficeTableImport from '../../../office/table/step-get-office-table-import';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';

describe('StepGetOfficeTableImport', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getOfficeTableImport should log exceptions', async () => {
    // given
    console.error = jest.fn();

    const createOfficeTableMock = jest.spyOn(officeTableCreate, 'createOfficeTable').mockImplementation(() => {
      throw new Error('errorTest');
    });

    // when
    await stepGetOfficeTableImport.getOfficeTableImport({}, {});

    // then
    expect(createOfficeTableMock).toBeCalledTimes(1);
    expect(createOfficeTableMock).toThrowError(Error);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));
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

    const createOfficeTableMock = jest.spyOn(officeTableCreate, 'createOfficeTable').mockImplementation(() => ({
      officeTable: 'officeTableTest',
      bindId: 'bindIdTest',
      tableName: 'newOfficeTableNameTest',
    }));

    const updateOperationMock = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const updateObjectMock = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const completeGetOfficeTableImportMock = jest.spyOn(
      operationStepDispatcher, 'completeGetOfficeTableImport'
    ).mockImplementation();

    // when
    await stepGetOfficeTableImport.getOfficeTableImport(objectData, operationData);

    // then
    expect(createOfficeTableMock).toBeCalledTimes(1);
    expect(createOfficeTableMock).toBeCalledWith({
      excelContext: 'excelContextTest',
      instanceDefinition: 'instanceDefinitionTest',
      startCell: 'startCellTest',
    });

    expect(updateOperationMock).toBeCalledTimes(1);
    expect(updateOperationMock).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      officeTable: 'officeTableTest',
      shouldFormat: true,
      tableColumnsChanged: false,
      instanceDefinition: 'instanceDefinitionTest',
      startCell: 'startCellTest',
    });

    expect(updateObjectMock).toBeCalledTimes(1);
    expect(updateObjectMock).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      tableName: 'newOfficeTableNameTest',
      bindId: 'bindIdTest',
    });

    expect(completeGetOfficeTableImportMock).toBeCalledTimes(1);
    expect(completeGetOfficeTableImportMock).toBeCalledWith('objectWorkingIdTest');
  });
});
