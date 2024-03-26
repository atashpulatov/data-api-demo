/* eslint-disable no-import-assign */
import * as mstrObjectRestService from '../../mstr-object/mstr-object-rest-service';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeRemoveHelper } from '../remove/office-remove-helper';
import officeTableHelperRange from './office-table-helper-range';

import officeApiDataLoader from '../api/office-api-data-loader';
import officeFormatSubtotals from '../format/office-format-subtotals';
import officeTableRefresh from './office-table-refresh';
import officeTableUpdate from './office-table-update';

describe('OfficeTableUpdate', () => {
  let contextLimitOriginal: any;
  beforeAll(() => {
    contextLimitOriginal = mstrObjectRestService.CONTEXT_LIMIT;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    // @ts-expect-error
    mstrObjectRestService.CONTEXT_LIMIT = contextLimitOriginal;
  });

  it('updateOfficeTable should handle an error', async () => {
    // given
    const instanceDefinitionMock = {
      mstrTable: {
        subtotalsInfo: {},
      },
    };

    jest.spyOn(officeTableUpdate, 'handleSubtotalsFormatting').mockImplementation(() => {
      throw new Error('errorTest');
    });

    const excelContextSyncMock = jest.fn();
    const excelContextMock = { sync: excelContextSyncMock } as unknown as Excel.RequestContext;

    // when
    try {
      await officeTableUpdate.updateOfficeTable(
        instanceDefinitionMock,
        excelContextMock,
        undefined
      );
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('errorTest');
    }

    // then
    expect(officeTableUpdate.handleSubtotalsFormatting).toBeCalledTimes(1);
    expect(excelContextSyncMock).toBeCalledTimes(1);
    expect(excelContextSyncMock).toBeCalledWith();
  });

  it.each`
    isCrosstabParam
    ${true}
    ${false}
  `('updateOfficeTable should should work as expected', async ({ isCrosstabParam }) => {
    // given
    const mstrTableMock = {
      isCrosstab: isCrosstabParam,
      headers: {
        columns: 'columnsTest',
      },
      subtotalsInfo: {
        subtotalsAddresses: 'subtotalsAddressesTest',
      },
    };

    const instanceDefinitionMock = {
      rows: 'rowsTest',
      mstrTable: mstrTableMock,
    };

    const prevOfficeTableMock = {
      worksheet: 'worksheetTest',
    } as unknown as Excel.Table;

    jest.spyOn(officeTableUpdate, 'handleSubtotalsFormatting').mockImplementation();

    jest.spyOn(officeTableUpdate, 'validateAddedRowsRange').mockImplementation();

    jest.spyOn(officeTableUpdate, 'createHeadersForCrosstab').mockImplementation();

    jest.spyOn(officeTableUpdate, 'setHeaderValuesNoCrosstab').mockImplementation();

    jest.spyOn(officeRemoveHelper, 'deleteRowsInChunks').mockImplementation();

    const excelContextSyncMock = jest.fn();
    const excelContextMock = { sync: excelContextSyncMock } as unknown as Excel.RequestContext;

    const result = await officeTableUpdate.updateOfficeTable(
      instanceDefinitionMock,
      excelContextMock,
      prevOfficeTableMock
    );

    // then
    expect(officeTableUpdate.handleSubtotalsFormatting).toBeCalledTimes(1);
    expect(officeTableUpdate.handleSubtotalsFormatting).toBeCalledWith(
      excelContextMock,
      prevOfficeTableMock,
      mstrTableMock,
      'subtotalsAddressesTest'
    );

    expect(officeTableUpdate.validateAddedRowsRange).toBeCalledTimes(1);
    expect(officeTableUpdate.validateAddedRowsRange).toBeCalledWith(
      excelContextMock,
      'rowsTest',
      prevOfficeTableMock
    );

    if (isCrosstabParam) {
      expect(officeTableUpdate.createHeadersForCrosstab).toBeCalledTimes(1);
      expect(officeTableUpdate.createHeadersForCrosstab).toBeCalledWith(
        { worksheet: 'worksheetTest' },
        instanceDefinitionMock
      );
    } else {
      expect(officeTableUpdate.setHeaderValuesNoCrosstab).toBeCalledTimes(1);
      expect(officeTableUpdate.setHeaderValuesNoCrosstab).toBeCalledWith(
        excelContextMock,
        prevOfficeTableMock,
        'columnsTest'
      );
    }

    expect(officeRemoveHelper.deleteRowsInChunks).toBeCalledTimes(1);
    expect(officeRemoveHelper.deleteRowsInChunks).toBeCalledWith(
      excelContextMock,
      prevOfficeTableMock,
      500,
      'rowsTest'
    );

    expect(result).toEqual(prevOfficeTableMock);
  });

  it.each`
    expectedApplySubtotalFormattingCallsNo | subtotalsAddressesParam
    ${0}                                   | ${undefined}
    ${0}                                   | ${[]}
    ${1}                                   | ${[42]}
    ${1}                                   | ${[42, 4242]}
  `(
    'handleSubtotalsFormatting should work as expected',
    async ({ expectedApplySubtotalFormattingCallsNo, subtotalsAddressesParam }) => {
      // given
      jest.spyOn(officeFormatSubtotals, 'applySubtotalFormatting').mockImplementation();

      // when
      await officeTableUpdate.handleSubtotalsFormatting(
        'excelContextTest' as unknown as Excel.RequestContext,
        'prevOfficeTableTest' as unknown as Excel.Table,
        'mstrTableTest',
        subtotalsAddressesParam
      );

      // then
      expect(officeFormatSubtotals.applySubtotalFormatting).toBeCalledTimes(
        expectedApplySubtotalFormattingCallsNo
      );
      if (expectedApplySubtotalFormattingCallsNo > 0) {
        expect(officeFormatSubtotals.applySubtotalFormatting).toBeCalledWith(
          'prevOfficeTableTest',
          'excelContextTest',
          'mstrTableTest',
          false
        );
      }
    }
  );

  it('validateAddedRowsRange should work as expected when addedRowsCount === 0', async () => {
    // given
    jest.spyOn(officeTableUpdate, 'getAddedRowsCount').mockResolvedValue(0);

    // when
    await officeTableUpdate.validateAddedRowsRange(
      'excelContextTest' as unknown as Excel.RequestContext,
      1,
      {
        rows: 'rowsTest',
      } as unknown as Excel.Table
    );

    // then
    expect(officeTableUpdate.getAddedRowsCount).toBeCalledTimes(1);
    expect(officeTableUpdate.getAddedRowsCount).toBeCalledWith('excelContextTest', 1, 'rowsTest');
  });

  it('validateAddedRowsRange should work as expected when addedRowsCount > 0', async () => {
    // given
    jest
      .spyOn(officeTableUpdate, 'getAddedRowsCount')
      .mockReturnValue('getAddedRowsCountTest' as any);

    const getRowsBelowMock = jest.fn().mockReturnValue('bottomRangeTest');
    const prevOfficeTableMock = {
      rows: 'rowsTest',
      getRange: jest.fn().mockReturnValue({
        getRowsBelow: getRowsBelowMock,
      }),
    } as unknown as Excel.Table;

    jest.spyOn(officeTableHelperRange, 'checkRangeValidity').mockImplementation();

    // when
    await officeTableUpdate.validateAddedRowsRange(
      'excelContextTest' as unknown as Excel.RequestContext,
      1,
      prevOfficeTableMock
    );

    // then
    expect(officeTableUpdate.getAddedRowsCount).toBeCalledTimes(1);
    expect(officeTableUpdate.getAddedRowsCount).toBeCalledWith('excelContextTest', 1, 'rowsTest');

    expect(getRowsBelowMock).toBeCalledTimes(1);
    expect(getRowsBelowMock).toBeCalledWith('getAddedRowsCountTest');

    expect(officeTableHelperRange.checkRangeValidity).toBeCalledTimes(1);
    expect(officeTableHelperRange.checkRangeValidity).toBeCalledWith(
      'excelContextTest',
      'bottomRangeTest'
    );
  });

  it.each`
    expectedResult | newRowsCountParam | prevRowsCount
    ${0}           | ${0}              | ${0}
    ${1}           | ${1}              | ${0}
    ${0}           | ${0}              | ${1}
    ${0}           | ${1}              | ${1}
  `(
    'getAddedRowsCount should work as expected',
    async ({ expectedResult, newRowsCountParam, prevRowsCount }) => {
      // given
      jest.spyOn(officeApiDataLoader, 'loadSingleExcelData').mockReturnValue(prevRowsCount);

      // when
      const result = await officeTableUpdate.getAddedRowsCount(
        'excelContextTest' as unknown as Excel.RequestContext,
        newRowsCountParam,
        'prevOfficeTableRowsTest' as unknown as Excel.TableRowCollection
      );

      // then
      expect(officeApiDataLoader.loadSingleExcelData).toBeCalledTimes(1);
      expect(officeApiDataLoader.loadSingleExcelData).toBeCalledWith(
        'excelContextTest',
        'prevOfficeTableRowsTest',
        'count'
      );

      expect(result).toEqual(expectedResult);
    }
  );

  it('createHeadersForCrosstab should work as expected', () => {
    // given
    const prevOfficeTableMock = {} as unknown as Excel.Table;

    jest
      .spyOn(officeApiCrosstabHelper, 'getCrosstabHeaderDimensions')
      .mockReturnValue('crosstabHeaderDimensionsTest');

    jest.spyOn(officeApiCrosstabHelper, 'createCrosstabHeaders').mockImplementation();

    // when
    officeTableUpdate.createHeadersForCrosstab(prevOfficeTableMock, { mstrTable: 'mstrTableTest' });

    // then
    expect(officeApiCrosstabHelper.getCrosstabHeaderDimensions).toBeCalledTimes(1);
    expect(officeApiCrosstabHelper.getCrosstabHeaderDimensions).toBeCalledWith({
      mstrTable: 'mstrTableTest',
    });

    expect(officeApiCrosstabHelper.createCrosstabHeaders).toBeCalledTimes(1);
    expect(officeApiCrosstabHelper.createCrosstabHeaders).toBeCalledWith(
      prevOfficeTableMock,
      'mstrTableTest',
      'crosstabHeaderDimensionsTest'
    );
  });

  it.each`
    expectedValues      | headerColumnsParam
    ${{ values: [42] }} | ${[42]}
    ${{ values: [42] }} | ${[41, 42]}
    ${{ values: [42] }} | ${[40, 41, 42]}
  `(
    'setHeaderValuesNoCrosstab should work as expected',
    ({ expectedValues, headerColumnsParam }) => {
      // given
      const excelContextMock = {
        workbook: {
          application: {
            suspendApiCalculationUntilNextSync: jest.fn(),
          },
        },
      } as unknown as Excel.RequestContext;

      const getHeaderRowRangeMock = {};
      const prevOfficeTableMock = {
        getHeaderRowRange: jest.fn().mockReturnValue(getHeaderRowRangeMock),
      } as unknown as Excel.Table;

      // when
      officeTableUpdate.setHeaderValuesNoCrosstab(
        excelContextMock,
        prevOfficeTableMock,
        headerColumnsParam
      );

      // then
      expect(
        excelContextMock.workbook.application.suspendApiCalculationUntilNextSync
      ).toBeCalledTimes(1);
      expect(
        excelContextMock.workbook.application.suspendApiCalculationUntilNextSync
      ).toBeCalledWith();

      expect(prevOfficeTableMock.getHeaderRowRange).toBeCalledTimes(1);
      expect(getHeaderRowRangeMock).toEqual(expectedValues);
    }
  );

  it.each`
    startCell | isCrosstab | fromCrosstabChange | crosstabHeaderDimensions     | prevCrosstabDimensions       | tableChanged | expectedResult
    ${'B3'}   | ${true}    | ${false}           | ${{ rowsX: 1, columnsY: 2 }} | ${false}                     | ${false}     | ${'A1'}
    ${'E5'}   | ${true}    | ${false}           | ${{ rowsX: 4, columnsY: 4 }} | ${{ rowsX: 2, columnsY: 4 }} | ${false}     | ${'A1'}
    ${'C5'}   | ${false}   | ${true}            | ${false}                     | ${{ rowsX: 2, columnsY: 4 }} | ${false}     | ${'A1'}
    ${'D2'}   | ${false}   | ${true}            | ${false}                     | ${{ rowsX: 3, columnsY: 1 }} | ${false}     | ${'A1'}
    ${'A1'}   | ${false}   | ${false}           | ${false}                     | ${false}                     | ${false}     | ${'A1'}
  `(
    'getCrosstabStartCell should work as expected',
    ({
      startCell,
      isCrosstab,
      fromCrosstabChange,
      crosstabHeaderDimensions,
      prevCrosstabDimensions,
      tableChanged,
      expectedResult,
    }) => {
      // given
      const mockedInstanceDefinition = {
        mstrTable: {
          isCrosstab,
          fromCrosstabChange,
          crosstabHeaderDimensions,
          prevCrosstabDimensions,
        },
      };

      // when
      const result = officeTableRefresh.getCrosstabStartCell(
        startCell,
        mockedInstanceDefinition,
        tableChanged
      );

      // then
      expect(result).toEqual(expectedResult);
    }
  );
});
