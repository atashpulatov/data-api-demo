import officeTableCreate from '../../../office/table/office-table-create';
import stepGetOfficeTableImport from '../../../office/table/step-get-office-table-import';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';

describe('StepGetOfficeTableImport', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getOfficeTableImport should log exceptions', async () => {
    // given
    console.log = jest.fn();

    // given
    const mockCreateOfficeTable = jest.spyOn(officeTableCreate, 'createOfficeTable').mockImplementation(() => {
      throw new Error('testError');
    });

    // when
    await stepGetOfficeTableImport.getOfficeTableImport({}, {});

    // then
    expect(mockCreateOfficeTable).toBeCalledTimes(1);
    expect(mockCreateOfficeTable).toThrowError(Error);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith('error:', new Error('testError'));
  });

  it('getOfficeTableImport should work as expected', async () => {
    // given
    const objectData = { objectWorkingId: 'testObjectWorkingId' };

    const operationData = {
      excelContext: 'testExcelContext',
      instanceDefinition: 'testInstanceDefinition',
      startCell: 'testStartCell',
    };

    const mockCreateOfficeTable = jest.spyOn(officeTableCreate, 'createOfficeTable').mockImplementation(() => ({
      officeTable: 'testOfficeTable',
      bindId: 'testBindId',
      newOfficeTableName: 'testNewOfficeTableName',
    }));

    const mockUpdateOperation = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const mockUpdateObject = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const mockCompleteGetOfficeTableImport = jest.spyOn(
      operationStepDispatcher, 'completeGetOfficeTableImport'
    ).mockImplementation();

    // when
    await stepGetOfficeTableImport.getOfficeTableImport(objectData, operationData);

    // then
    expect(mockCreateOfficeTable).toBeCalledTimes(1);
    expect(mockCreateOfficeTable).toBeCalledWith({
      excelContext: 'testExcelContext',
      instanceDefinition: 'testInstanceDefinition',
      startCell: 'testStartCell',
    });

    expect(mockUpdateOperation).toBeCalledTimes(1);
    expect(mockUpdateOperation).toBeCalledWith({
      objectWorkingId: 'testObjectWorkingId',
      officeTable: 'testOfficeTable',
      shouldFormat: true,
      tableColumnsChanged: false,
      instanceDefinition: 'testInstanceDefinition',
      startCell: 'testStartCell',
    });

    expect(mockUpdateObject).toBeCalledTimes(1);
    expect(mockUpdateObject).toBeCalledWith({
      objectWorkingId: 'testObjectWorkingId',
      newOfficeTableName: 'testNewOfficeTableName',
      bindId: 'testBindId',
    });

    expect(mockCompleteGetOfficeTableImport).toBeCalledTimes(1);
    expect(mockCompleteGetOfficeTableImport).toBeCalledWith('testObjectWorkingId');
  });
});
