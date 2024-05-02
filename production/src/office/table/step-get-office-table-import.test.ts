import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeTableCreate from './office-table-create';
import stepGetOfficeTableImport from './step-get-office-table-import';

describe('StepGetOfficeTableImport', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getOfficeTableImport should log exceptions', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeTableCreate, 'createOfficeTable').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepGetOfficeTableImport.getOfficeTableImport({} as ObjectData, {} as OperationData);

    // then
    expect(officeTableCreate.createOfficeTable).toBeCalledTimes(1);
    expect(officeTableCreate.createOfficeTable).toThrowError(Error);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith(
      {},
      {},
      new Error('errorTest')
    );
  });

  it('getOfficeTableImport should work as expected', async () => {
    // given
    const objectData = {} as ObjectData;

    const operationData = {
      objectWorkingId: 'objectWorkingIdTest',
      excelContext: 'excelContextTest',
      instanceDefinition: 'instanceDefinitionTest',
      startCell: 'startCellTest',
    } as unknown as OperationData;

    jest.spyOn(officeTableCreate, 'createOfficeTable').mockImplementation(async () => ({
      officeTable: 'officeTableTest',
      bindId: 'bindIdTest',
      tableName: 'newOfficeTableNameTest',
      worksheet: 'worksheetTest',
      startCell: 'startCellTest',
      groupData: { key: 'key', title: 'name' },
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
      objectData,
    });

    expect(operationStepDispatcher.updateOperation).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateOperation).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      officeTable: 'officeTableTest',
      shouldFormat: true,
      tableChanged: false,
      instanceDefinition: 'instanceDefinitionTest',
      startCell: 'startCellTest',
    });

    expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      tableName: 'newOfficeTableNameTest',
      bindId: 'bindIdTest',
      startCell: 'startCellTest',
      worksheet: 'worksheetTest',
      groupData: { key: 'key', title: 'name' },
    });

    expect(operationStepDispatcher.completeGetOfficeTableImport).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeGetOfficeTableImport).toBeCalledWith(
      'objectWorkingIdTest'
    );
  });
});
