import { officeApiHelper } from '../api/office-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { OperationTypes } from '../../operation/operation-type-names';
import officeApiDataLoader from '../api/office-api-data-loader';
import stepBindOfficeTable from './step-bind-office-table';

describe('StepBindOfficeTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('bindOfficeTable should handle exception', async () => {
    // given
    const operationData = { tableChanged: true } as unknown as OperationData;

    jest.spyOn(console, 'error');

    jest.spyOn(officeApiDataLoader, 'loadSingleExcelData').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepBindOfficeTable.bindOfficeTable({} as ObjectData, operationData);

    // then
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith(
      {},
      operationData,
      new Error('errorTest')
    );
  });

  it('bindOfficeTable should work as expected', async () => {
    // given
    const objectData = {
      bindId: 'bindIdTest',
      objectWorkingId: 2137,
      isCrosstab: true,
    } as unknown as ObjectData;
    const excelContext = { sync: jest.fn() };
    const operationData = {
      excelContext,
      officeTable: {},
      tableChanged: true,
    } as unknown as OperationData;

    jest.spyOn(officeApiDataLoader, 'loadSingleExcelData').mockResolvedValue('tableNameTest');

    jest.spyOn(officeApiHelper, 'bindNamedItem').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeBindOfficeTable').mockImplementation();

    // when
    await stepBindOfficeTable.bindOfficeTable(objectData, operationData);

    // then
    expect(officeApiDataLoader.loadSingleExcelData).toBeCalledTimes(1);
    expect(officeApiDataLoader.loadSingleExcelData).toBeCalledWith(
      excelContext,
      { showHeaders: false, showTotals: false },
      'name'
    );

    expect(officeApiHelper.bindNamedItem).toBeCalledTimes(1);
    expect(officeApiHelper.bindNamedItem).toBeCalledWith('tableNameTest', 'bindIdTest');

    expect(operationStepDispatcher.completeBindOfficeTable).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeBindOfficeTable).toBeCalledWith(2137);
  });

  it.each`
    operationType
    ${OperationTypes.EDIT_OPERATION}
    ${OperationTypes.REFRESH_OPERATION}
  `('should skip bindOfficeTable if no new table created', async ({ operationType }) => {
    // given
    const objectData = {
      bindId: 'bindIdTest',
      objectWorkingId: 2137,
      isCrosstab: true,
    } as unknown as ObjectData;
    const excelContext = { sync: jest.fn() };
    const operationData = {
      excelContext,
      officeTable: {},
      operationType,
      tableChanged: false,
    } as unknown as OperationData;

    jest.spyOn(officeApiDataLoader, 'loadSingleExcelData').mockResolvedValue('tableNameTest');

    jest.spyOn(officeApiHelper, 'bindNamedItem').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeBindOfficeTable').mockImplementation();

    // when
    await stepBindOfficeTable.bindOfficeTable(objectData, operationData);

    // then
    expect(officeApiDataLoader.loadSingleExcelData).toBeCalledTimes(0);

    expect(officeApiHelper.bindNamedItem).toBeCalledTimes(0);

    expect(operationStepDispatcher.completeBindOfficeTable).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeBindOfficeTable).toBeCalledWith(2137);
  });
});
