import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepFormatTable from '../../../office/format/step-format-table';
import officeApiDataLoader from '../../../office/api/office-api-data-loader';

describe('StepFormatTable', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formatTable should log exceptions', async () => {
    // given
    console.log = jest.fn();

    const formatCrosstabHeadersMock = jest.spyOn(stepFormatTable, 'formatCrosstabHeaders')
      .mockImplementation(() => {
        throw new Error('errorTest');
      });

    jest.spyOn(operationStepDispatcher, 'completeFormatOfficeTable').mockImplementation();

    // when
    await stepFormatTable.formatTable({}, {
      instanceDefinition: { mstrTable: { crosstabHeaderDimensions: {} } },
      officeTable: {}
    });

    // then
    expect(formatCrosstabHeadersMock).toBeCalledTimes(1);
    expect(formatCrosstabHeadersMock).toThrowError(Error);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith('Error when formatting - no columns autofit applied', new Error('errorTest'));
  });

  it('formatTable should work as expected', async () => {
    // given
    const objectData = {};

    const excelContextSyncMock = jest.fn();
    const operationData = {
      objectWorkingId: 'objectWorkingIdTest',
      excelContext: { sync: excelContextSyncMock },
      instanceDefinition: {
        mstrTable: {
          crosstabHeaderDimensions: { rowsX: 'rowsXTest' },
          isCrosstab: 'isCrosstabTest',
        }
      },
      officeTable: { columns: 'columnsTest' },
    };

    const formatCrosstabHeadersMock = jest.spyOn(stepFormatTable, 'formatCrosstabHeaders').mockImplementation();

    const formatColumnsMock = jest.spyOn(stepFormatTable, 'formatColumns').mockImplementation();

    const completeFormatOfficeTableMock = jest.spyOn(
      operationStepDispatcher, 'completeFormatOfficeTable'
    ).mockImplementation();

    // when
    await stepFormatTable.formatTable(objectData, operationData);

    // then
    expect(formatCrosstabHeadersMock).toBeCalledTimes(1);
    expect(formatCrosstabHeadersMock).toBeCalledWith(
      { columns: 'columnsTest' },
      'isCrosstabTest',
      'rowsXTest',
    );

    expect(formatColumnsMock).toBeCalledTimes(1);
    expect(formatColumnsMock).toBeCalledWith(
      { sync: excelContextSyncMock },
      'columnsTest',
    );

    expect(excelContextSyncMock).toBeCalledTimes(1);

    expect(completeFormatOfficeTableMock).toBeCalledTimes(1);
    expect(completeFormatOfficeTableMock).toBeCalledWith('objectWorkingIdTest');
  });

  it.each`
  isCrosstab | autofitColumnsCalledTimes | showHeaders

  ${true}    | ${1}                      | ${false}
  ${false}   | ${0}                      | ${true}
  
  `('formatCrosstabHeaders should work as expected',
  ({ isCrosstab, autofitColumnsCalledTimes, showHeaders }) => {
    // given
    const autofitColumnsMock = jest.fn();

    const getColumnsBeforeMock = jest.fn().mockImplementation(() => (
      { format: { autofitColumns: autofitColumnsMock } }
    ));

    const officeTableMock = {
      showHeaders: true,
      getDataBodyRange: jest.fn().mockImplementation(() => ({ getColumnsBefore: getColumnsBeforeMock })),
    };

    // when
    stepFormatTable.formatCrosstabHeaders(officeTableMock, isCrosstab, 'rowsXTest');

    // then
    expect(getColumnsBeforeMock).toBeCalledTimes(autofitColumnsCalledTimes);
    if (autofitColumnsCalledTimes !== 0) {
      expect(getColumnsBeforeMock).toBeCalledWith('rowsXTest');
    }

    expect(autofitColumnsMock).toBeCalledTimes(autofitColumnsCalledTimes);

    expect(officeTableMock.showHeaders).toEqual(showHeaders);
  });

  it.each`
  columnsCount
  
  ${0}
  ${1}
  ${2}
  ${42}
  
  `('formatColumns should work as expected',
  async ({ columnsCount }) => {
    // given
    const getItemAtValueMock = `testColumnsCount ${columnsCount}`;
    const getItemAtMock = jest.fn().mockReturnValue(getItemAtValueMock);

    const columnsMock = { getItemAt: getItemAtMock };

    const loadExcelDataSingleMock = jest.spyOn(officeApiDataLoader, 'loadExcelDataSingle').mockImplementation(
      () => columnsCount
    );

    const formatSingleColumnMock = jest.spyOn(stepFormatTable, 'formatSingleColumn').mockImplementation();

    // when
    await stepFormatTable.formatColumns('excelContextTest', columnsMock);

    // then
    expect(loadExcelDataSingleMock).toBeCalledTimes(1);
    expect(loadExcelDataSingleMock).toBeCalledWith('excelContextTest', columnsMock, 'count');

    expect(formatSingleColumnMock).toBeCalledTimes(columnsCount);
    if (columnsCount > 0) {
      expect(formatSingleColumnMock).toBeCalledWith('excelContextTest', getItemAtValueMock);
    }

    expect(getItemAtMock).toBeCalledTimes(columnsCount);
  });

  it('formatSingleColumn should work as expected', async () => {
    // given
    const excelContextSyncMock = jest.fn();
    const excelContextMock = { sync: excelContextSyncMock };

    const autofitColumnsMock = jest.fn();

    const columnMock = {
      getRange: jest.fn().mockImplementation(() => (
        { format: { autofitColumns: autofitColumnsMock } }
      ))
    };


    // when
    await stepFormatTable.formatSingleColumn(excelContextMock, columnMock);

    // then
    expect(excelContextSyncMock).toBeCalledTimes(1);

    expect(autofitColumnsMock).toBeCalledTimes(1);
  });
});
