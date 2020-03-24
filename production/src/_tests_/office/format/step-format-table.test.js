import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepFormatTable from '../../../office/format/step-format-table';
import officeApiDataLoader from '../../../office/api/office-api-data-loader';

describe('StepGetOfficeTableImport', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formatTable should log exceptions', async () => {
    // given
    console.log = jest.fn();

    const mockFormatCrosstabHeaders = jest.spyOn(stepFormatTable, 'formatCrosstabHeaders')
      .mockImplementation(() => {
        throw new Error('testError');
      });

    jest.spyOn(operationStepDispatcher, 'completeFormatOfficeTable').mockImplementation();

    // when
    await stepFormatTable.formatTable({}, {
      instanceDefinition: { mstrTable: { crosstabHeaderDimensions: {} } },
      officeTable: {}
    });

    // then
    expect(mockFormatCrosstabHeaders).toBeCalledTimes(1);
    expect(mockFormatCrosstabHeaders).toThrowError(Error);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith('Error when formatting - no columns autofit applied', new Error('testError'));
  });

  it('formatTable should work as expected', async () => {
    // given
    const objectData = { objectWorkingId: 'testObjectWorkingId' };

    const mockExcelContextSync = jest.fn();
    const operationData = {
      excelContext: { sync: mockExcelContextSync, },
      instanceDefinition: {
        mstrTable: {
          crosstabHeaderDimensions: { rowsX: 'testRowsX' },
          isCrosstab: 'testIsCrosstab',
        }
      },
      officeTable: { columns: 'testColumns' },
    };

    const mockFormatCrosstabHeaders = jest.spyOn(stepFormatTable, 'formatCrosstabHeaders').mockImplementation();

    const mockFormatColumns = jest.spyOn(stepFormatTable, 'formatColumns').mockImplementation();

    const mockCompleteFormatOfficeTable = jest.spyOn(
      operationStepDispatcher, 'completeFormatOfficeTable'
    ).mockImplementation();

    // when
    await stepFormatTable.formatTable(objectData, operationData);

    // then
    expect(mockFormatCrosstabHeaders).toBeCalledTimes(1);
    expect(mockFormatCrosstabHeaders).toBeCalledWith(
      { columns: 'testColumns' },
      'testIsCrosstab',
      'testRowsX',
    );

    expect(mockFormatColumns).toBeCalledTimes(1);
    expect(mockFormatColumns).toBeCalledWith(
      { sync: mockExcelContextSync, },
      'testColumns',
    );

    expect(mockExcelContextSync).toBeCalledTimes(1);

    expect(mockCompleteFormatOfficeTable).toBeCalledTimes(1);
    expect(mockCompleteFormatOfficeTable).toBeCalledWith('testObjectWorkingId');
  });

  it.each`
  isCrosstab | autofitColumnsCalledTimes | showHeaders

  ${true}    | ${1}                      | ${false}
  ${false}   | ${0}                      | ${true}
  
  `('formatCrosstabHeaders should work as expected',
  ({ isCrosstab, autofitColumnsCalledTimes, showHeaders }) => {
    // given
    const mockAutofitColumns = jest.fn();

    const mockGetColumnsBefore = jest.fn().mockImplementation(() => (
      { format: { autofitColumns: mockAutofitColumns } }
    ));

    const mockOfficeTable = {
      showHeaders: true,
      getDataBodyRange: jest.fn().mockImplementation(() => ({ getColumnsBefore: mockGetColumnsBefore })),
    };

    // when
    stepFormatTable.formatCrosstabHeaders(mockOfficeTable, isCrosstab, 'testRowsX');

    // then
    expect(mockGetColumnsBefore).toBeCalledTimes(autofitColumnsCalledTimes);
    if (autofitColumnsCalledTimes !== 0) {
      expect(mockGetColumnsBefore).toBeCalledWith('testRowsX');
    }

    expect(mockAutofitColumns).toBeCalledTimes(autofitColumnsCalledTimes);

    expect(mockOfficeTable.showHeaders).toEqual(showHeaders);
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
    const mockGetItemAtValue = `testColumnsCount ${columnsCount}`;
    const mockGetItemAt = jest.fn().mockReturnValue(mockGetItemAtValue);

    const mockColumns = { getItemAt: mockGetItemAt, };

    const mockLoadExcelDataSingle = jest.spyOn(officeApiDataLoader, 'loadExcelDataSingle').mockImplementation(
      () => columnsCount
    );

    const mockFormatSingleColumn = jest.spyOn(stepFormatTable, 'formatSingleColumn').mockImplementation();

    // when
    await stepFormatTable.formatColumns('testExcelContext', mockColumns);

    // then
    expect(mockLoadExcelDataSingle).toBeCalledTimes(1);
    expect(mockLoadExcelDataSingle).toBeCalledWith('testExcelContext', mockColumns, 'count');

    expect(mockFormatSingleColumn).toBeCalledTimes(columnsCount);
    if (columnsCount > 0) {
      expect(mockFormatSingleColumn).toBeCalledWith('testExcelContext', mockGetItemAtValue);
    }

    expect(mockGetItemAt).toBeCalledTimes(columnsCount);
  });

  it('formatSingleColumn should work as expected', async () => {
    // given
    const mockExcelContextSync = jest.fn();
    const mockExcelContext = { sync: mockExcelContextSync, };

    const mockAutofitColumns = jest.fn();

    const mockColumn = {
      getRange: jest.fn().mockImplementation(() => (
        { format: { autofitColumns: mockAutofitColumns } }
      ))
    };


    // when
    await stepFormatTable.formatSingleColumn(mockExcelContext, mockColumn);

    // then
    expect(mockExcelContextSync).toBeCalledTimes(1);

    expect(mockAutofitColumns).toBeCalledTimes(1);
  });
});
