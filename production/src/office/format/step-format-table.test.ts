import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeApiDataLoader from '../api/office-api-data-loader';
import stepFormatTable from './step-format-table';

describe('StepFormatTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formatTable should log exceptions', async () => {
    // given
    jest.spyOn(console, 'log');

    jest.spyOn(stepFormatTable, 'formatCrosstabHeaders').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationStepDispatcher, 'completeFormatOfficeTable').mockImplementation();

    // when
    await stepFormatTable.formatTable(
      {} as ObjectData,
      {
        instanceDefinition: {
          mstrTable: { crosstabHeaderDimensions: {} },
          columns: 42,
        },
        officeTable: {} as Excel.Table,
        shouldFormat: true,
      } as unknown as OperationData
    );

    // then
    expect(stepFormatTable.formatCrosstabHeaders).toBeCalledTimes(1);
    expect(stepFormatTable.formatCrosstabHeaders).toThrowError(Error);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith(
      'Error when formatting - no columns autofit applied',
      new Error('errorTest')
    );
  });

  it('formatTable should be skipped for shouldFormat false', async () => {
    // given
    const objectData = {} as ObjectData;

    const excelContextSyncMock = jest.fn();
    const operationData = {
      objectWorkingId: 2137,
      excelContext: { sync: excelContextSyncMock },
      instanceDefinition: {
        mstrTable: {
          crosstabHeaderDimensions: { rowsX: 'rowsXTest' },
          isCrosstab: 'isCrosstabTest',
          columns: 42,
        },
      },
      officeTable: { columns: 'columnsTest' },
      shouldFormat: false,
    } as unknown as OperationData;

    jest.spyOn(stepFormatTable, 'formatCrosstabHeaders').mockImplementation();

    jest.spyOn(stepFormatTable, 'formatColumns').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeFormatOfficeTable').mockImplementation();

    // when
    await stepFormatTable.formatTable(objectData, operationData);

    // then
    expect(stepFormatTable.formatCrosstabHeaders).toBeCalledTimes(0);

    expect(stepFormatTable.formatColumns).toBeCalledTimes(0);

    expect(excelContextSyncMock).toBeCalledTimes(0);

    expect(operationStepDispatcher.completeFormatOfficeTable).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeFormatOfficeTable).toBeCalledWith(2137);
  });

  it('formatTable should log no autofit, when columns are more than 49', async () => {
    // given
    jest.spyOn(console, 'log');
    const objectData = {} as ObjectData;
    const excelContextSyncMock = jest.fn();
    const operationData = {
      objectWorkingId: 2137,
      excelContext: { sync: excelContextSyncMock },
      instanceDefinition: {
        mstrTable: {
          crosstabHeaderDimensions: { rowsX: 'rowsXTest' },
          isCrosstab: 'isCrosstabTest',
          columns: 50,
        },
      },
      officeTable: { columns: 'columnsTest' },
      shouldFormat: true,
    } as unknown as OperationData;

    jest.spyOn(stepFormatTable, 'formatCrosstabHeaders').mockImplementation();

    jest.spyOn(stepFormatTable, 'formatColumns').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeFormatOfficeTable').mockImplementation();

    // when
    await stepFormatTable.formatTable(objectData, operationData);

    // then
    expect(stepFormatTable.formatCrosstabHeaders).toBeCalledTimes(0);

    expect(stepFormatTable.formatColumns).toBeCalledTimes(0);

    expect(excelContextSyncMock).toBeCalledTimes(0);

    expect(operationStepDispatcher.completeFormatOfficeTable).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeFormatOfficeTable).toBeCalledWith(2137);
    expect(console.log).toBeCalledWith(
      'The column count is more than columns autofit limit or should not format - no columns autofit applied.'
    );
  });

  it('formatTable should work as expected', async () => {
    // given
    const objectData = {} as ObjectData;

    const excelContextSyncMock = jest.fn();
    const operationData = {
      objectWorkingId: 2137,
      excelContext: { sync: excelContextSyncMock },
      instanceDefinition: {
        mstrTable: {
          crosstabHeaderDimensions: { rowsX: 'rowsXTest' },
          isCrosstab: 'isCrosstabTest',
        },
        columns: 42,
      },
      officeTable: { columns: 'columnsTest' },
      shouldFormat: true,
    } as unknown as OperationData;

    jest.spyOn(stepFormatTable, 'formatCrosstabHeaders').mockImplementation();

    jest.spyOn(stepFormatTable, 'formatColumns').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeFormatOfficeTable').mockImplementation();

    // when
    await stepFormatTable.formatTable(objectData, operationData);

    // then
    expect(stepFormatTable.formatCrosstabHeaders).toBeCalledTimes(1);
    expect(stepFormatTable.formatCrosstabHeaders).toBeCalledWith(
      { columns: 'columnsTest' },
      'isCrosstabTest',
      'rowsXTest'
    );

    expect(stepFormatTable.formatColumns).toBeCalledTimes(1);
    expect(stepFormatTable.formatColumns).toBeCalledWith(
      { sync: excelContextSyncMock },
      'columnsTest'
    );

    expect(excelContextSyncMock).toBeCalledTimes(1);

    expect(operationStepDispatcher.completeFormatOfficeTable).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeFormatOfficeTable).toBeCalledWith(2137);
  });

  it.each`
    isCrosstab | autofitColumnsCalledTimes | showHeaders
    ${true}    | ${1}                      | ${false}
    ${false}   | ${0}                      | ${true}
  `(
    'formatCrosstabHeaders should work as expected',
    ({ isCrosstab, autofitColumnsCalledTimes, showHeaders }) => {
      // given
      const autofitColumnsMock = jest.fn();

      const getColumnsBeforeMock = jest
        .fn()
        .mockReturnValue({ format: { autofitColumns: autofitColumnsMock } });

      const officeTableMock = {
        showHeaders: true,
        getDataBodyRange: jest.fn().mockReturnValue({ getColumnsBefore: getColumnsBeforeMock }),
      } as unknown as Excel.Table;

      // when
      stepFormatTable.formatCrosstabHeaders(officeTableMock, isCrosstab, 1);

      // then
      expect(getColumnsBeforeMock).toBeCalledTimes(autofitColumnsCalledTimes);
      if (autofitColumnsCalledTimes !== 0) {
        expect(getColumnsBeforeMock).toBeCalledWith(1);
      }

      expect(autofitColumnsMock).toBeCalledTimes(autofitColumnsCalledTimes);

      expect(officeTableMock.showHeaders).toEqual(showHeaders);
    }
  );

  it.each`
    columnsCount
    ${0}
    ${1}
    ${2}
    ${42}
  `('formatColumns should work as expected', async ({ columnsCount }) => {
    // given
    const getItemAtValueMock = `testColumnsCount ${columnsCount}`;
    const getItemAtMock = jest.fn().mockReturnValue(getItemAtValueMock);
    const excelContextSyncMock = jest.fn();
    const excelContextMock = { sync: excelContextSyncMock } as unknown as Excel.RequestContext;

    const columnsMock = { getItemAt: getItemAtMock } as unknown as Excel.TableColumnCollection;

    jest.spyOn(officeApiDataLoader, 'loadSingleExcelData').mockReturnValue(columnsCount);

    jest.spyOn(stepFormatTable, 'formatSingleColumn').mockImplementation();

    // when
    await stepFormatTable.formatColumns(excelContextMock, columnsMock);

    // then
    expect(officeApiDataLoader.loadSingleExcelData).toBeCalledTimes(1);
    expect(officeApiDataLoader.loadSingleExcelData).toBeCalledWith(
      excelContextMock,
      columnsMock,
      'count'
    );

    expect(stepFormatTable.formatSingleColumn).toBeCalledTimes(columnsCount);
    if (columnsCount > 0) {
      expect(stepFormatTable.formatSingleColumn).toBeCalledWith(
        excelContextMock,
        getItemAtValueMock
      );
    }

    expect(getItemAtMock).toBeCalledTimes(columnsCount);
  });

  it('formatSingleColumn should work as expected', async () => {
    // given
    const excelContextSyncMock = jest.fn();
    const excelContextMock = { sync: excelContextSyncMock } as unknown as Excel.RequestContext;

    const autofitColumnsMock = jest.fn();

    const columnMock = {
      getRange: jest.fn().mockReturnValue({ format: { autofitColumns: autofitColumnsMock } }),
    } as unknown as Excel.TableColumn;

    // when
    await stepFormatTable.formatSingleColumn(excelContextMock, columnMock);

    // then
    expect(excelContextSyncMock).toBeCalledTimes(1);

    expect(autofitColumnsMock).toBeCalledTimes(1);
  });
});
