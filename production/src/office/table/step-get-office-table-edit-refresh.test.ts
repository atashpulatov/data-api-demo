import getOfficeTableHelper from './get-office-table-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import * as getObjectDetailsMethods from '../../mstr-object/get-object-details-methods';
import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeTableCreate from './office-table-create';
import officeTableRefresh from './office-table-refresh';
import officeTableUpdate from './office-table-update';
import stepGetOfficeTableEditRefresh from './step-get-office-table-edit-refresh';
import { TableOperation } from '../../error/constants';

describe('StepGetOfficeTableEditRefresh', () => {
  const mockFn = jest.fn();

  const excelContextMock = {
    sync: mockFn,
  };

  const mockedOfficeTable = {
    worksheet: {
      id: 1,
      name: 'worksheetTest',
      position: 0,
      load: mockFn,
    },
  };

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
    await stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh(
      {} as ObjectData,
      {
        instanceDefinition: {},
      } as OperationData
    );

    // then
    expect(getOfficeTableHelper.checkReportTypeChange).toHaveBeenCalledTimes(1);
    expect(getOfficeTableHelper.checkReportTypeChange).toThrow(Error);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(new Error('errorTest'));

    expect(operationErrorHandler.handleOperationError).toHaveBeenCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toHaveBeenCalledWith(
      {},
      { instanceDefinition: {} },
      new Error('errorTest')
    );
  });

  it('getOfficeTableEditRefresh should work as expected when tableChanged true', async () => {
    // given
    const objectData = {
      tableName: 'tableNameTest',
      previousTableDimensions: 'previousTableDimensionsTest',
      visualizationInfo: 'visualizationInfoTest',
      objectWorkingId: 'objectWorkingIdTest',
      mstrObjectType: { name: 'report' },
    } as unknown as ObjectData;

    const operationData = {
      excelContext: excelContextMock,
      instanceDefinition: { mstrTable: 'mstrTableTest' },
      oldBindId: 'oldBindIdTest',
    } as unknown as OperationData;

    jest.spyOn(getOfficeTableHelper, 'checkReportTypeChange').mockImplementation();

    jest
      .spyOn(officeTableRefresh, 'getPreviousOfficeTable')
      .mockImplementation(() => 'prevOfficeTableTest' as any);

    jest.spyOn(officeTableRefresh, 'getExistingOfficeTableData').mockImplementation(async () => ({
      tableChanged: true,
      startCell: 'A10',
    }));

    jest.spyOn(officeTableCreate, 'createOfficeTable').mockImplementation(async () => ({
      officeTable: mockedOfficeTable,
      bindId: 'bindIdTest',
      startCell: 'A10',
    }));

    jest.spyOn(officeTableRefresh, 'getCrosstabStartCell').mockImplementation(() => 'A10');

    jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeGetOfficeTableEditRefresh').mockImplementation();

    jest.spyOn(getObjectDetailsMethods, 'getTableOperationAndStartCell').mockImplementation(() => ({
      tableOperation: TableOperation.CREATE_NEW_TABLE,
      startCell: 'A10',
    }));

    // when
    await stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh(objectData, operationData);

    // then
    expect(getOfficeTableHelper.checkReportTypeChange).toBeCalledTimes(1);
    expect(getOfficeTableHelper.checkReportTypeChange).toBeCalledWith('mstrTableTest');

    expect(officeTableRefresh.getExistingOfficeTableData).toBeCalledTimes(1);
    expect(officeTableRefresh.getExistingOfficeTableData).toBeCalledWith(
      excelContextMock,
      // 'oldBindIdTest',
      { mstrTable: 'mstrTableTest' },
      'prevOfficeTableTest',
      'previousTableDimensionsTest',
      false
    );

    expect(officeTableCreate.createOfficeTable).toBeCalledTimes(1);
    expect(officeTableCreate.createOfficeTable).toBeCalledWith({
      instanceDefinition: { mstrTable: 'mstrTableTest' },
      isRepeatStep: false,
      excelContext: excelContextMock,
      startCell: 'A10',
      tableName: 'tableNameTest',
      prevOfficeTable: 'prevOfficeTableTest',
      tableChanged: true,
      objectData,
    });

    expect(operationStepDispatcher.updateOperation).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateOperation).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      officeTable: mockedOfficeTable,
      shouldFormat: true,
      tableChanged: true,
      instanceDefinition: { mstrTable: 'mstrTableTest' },
      startCell: 'A10',
    });

    expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      bindId: 'bindIdTest',
      startCell: 'A10',
      objectDetailsSize: 0,
      worksheet: { id: 1, name: 'worksheetTest', index: 0 },
      groupData: { key: 1, title: 'worksheetTest', index: 0 },
    });

    expect(operationStepDispatcher.completeGetOfficeTableEditRefresh).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeGetOfficeTableEditRefresh).toBeCalledWith(
      'objectWorkingIdTest'
    );
  });

  it.each`
    inputNameAndFormatShouldUpdate | resultShouldFormat
    ${true}                        | ${true}
    ${false}                       | ${false}
  `(
    'getOfficeTableEditRefresh should work as expected when tableChanged',
    async ({ inputNameAndFormatShouldUpdate, resultShouldFormat }) => {
      // given
      const objectData = {
        tableName: 'tableNameTest',
        previousTableDimensions: 'previousTableDimensionsTest',
        objectWorkingId: 'objectWorkingIdTest',
        mstrObjectType: { name: 'report' },
      } as unknown as ObjectData;

      const operationData = {
        excelContext: excelContextMock,
        instanceDefinition: { mstrTable: 'mstrTableTest' },
        oldBindId: 'oldBindIdTest',
        objectEditedData: {
          visualizationInfo: {
            nameAndFormatShouldUpdate: inputNameAndFormatShouldUpdate,
          },
        },
      } as unknown as OperationData;

      jest.spyOn(getOfficeTableHelper, 'checkReportTypeChange').mockImplementation();

      jest
        .spyOn(officeTableRefresh, 'getPreviousOfficeTable')
        .mockImplementation(() => mockedOfficeTable as any);

      jest.spyOn(officeTableRefresh, 'getExistingOfficeTableData').mockImplementation(async () => ({
        tableChanged: false,
        startCell: 'A10',
      }));

      jest
        .spyOn(officeTableUpdate, 'updateOfficeTable')
        .mockImplementation(() => mockedOfficeTable as any);

      jest.spyOn(officeTableRefresh, 'getCrosstabStartCell').mockImplementation(() => 'A10');

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
        excelContextMock,
        { mstrTable: 'mstrTableTest' },
        mockedOfficeTable,
        'previousTableDimensionsTest',
        false
      );

      expect(officeTableUpdate.updateOfficeTable).toBeCalledTimes(1);
      expect(officeTableUpdate.updateOfficeTable).toBeCalledWith(
        { mstrTable: 'mstrTableTest' },
        excelContextMock,
        mockedOfficeTable,
        objectData
      );

      expect(operationStepDispatcher.updateOperation).toBeCalledTimes(1);
      expect(operationStepDispatcher.updateOperation).toBeCalledWith({
        objectWorkingId: 'objectWorkingIdTest',
        officeTable: mockedOfficeTable,
        shouldFormat: resultShouldFormat,
        tableChanged: false,
        instanceDefinition: { mstrTable: 'mstrTableTest' },
        startCell: 'A10',
      });

      expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
      expect(operationStepDispatcher.updateObject).toBeCalledWith({
        objectWorkingId: 'objectWorkingIdTest',
        bindId: 'oldBindIdTest',
        startCell: 'A10',
        objectDetailsSize: 0,
        worksheet: { id: 1, name: 'worksheetTest', index: 0 },
        groupData: { key: 1, title: 'worksheetTest', index: 0 },
      });

      expect(operationStepDispatcher.completeGetOfficeTableEditRefresh).toBeCalledTimes(1);
      expect(operationStepDispatcher.completeGetOfficeTableEditRefresh).toBeCalledWith(
        'objectWorkingIdTest'
      );
    }
  );
});
