import officeApiDataLoader from '../../../office/api/office-api-data-loader';
import officeTableUpdate from '../../../office/table/office-table-update';
import * as mstrObjectRestService from '../../../mstr-object/mstr-object-rest-service';
import { officeApiCrosstabHelper } from '../../../office/api/office-api-crosstab-helper';
import officeTableHelperRange from '../../../office/table/office-table-helper-range';
import officeFormatSubtotals from '../../../office/format/office-format-subtotals';
import { officeRemoveHelper } from '../../../office/remove/office-remove-helper';

describe('OfficeTableUpdate', () => {
  let contextLimitOriginal;
  beforeAll(() => {
    contextLimitOriginal = mstrObjectRestService.CONTEXT_LIMIT;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    mstrObjectRestService.CONTEXT_LIMIT = contextLimitOriginal;
  });

  it('updateOfficeTable should handle an error', async () => {
    // given
    const instanceDefinitionMock = {
      mstrTable: {
        subtotalsInfo: {}
      }
    };

    jest.spyOn(officeTableUpdate, 'handleSubtotalsFormatting').mockImplementation(() => {
      throw new Error('errorTest');
    });

    const excelContextSyncMock = jest.fn();
    const excelContextMock = { sync: excelContextSyncMock };

    // when
    try {
      await officeTableUpdate.updateOfficeTable(instanceDefinitionMock, excelContextMock, undefined, undefined);
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
  
  `('updateOfficeTable should should work as expected',
    async ({ isCrosstabParam }) => {
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
        mstrTable: mstrTableMock
      };

      const prevOfficeTableMock = {
        worksheet: 'worksheetTest',
      };

      jest.spyOn(officeTableUpdate, 'handleSubtotalsFormatting').mockImplementation();

      jest.spyOn(officeTableUpdate, 'validateAddedRowsRange').mockImplementation();

      jest.spyOn(officeTableUpdate, 'createHeadersForCrosstab').mockImplementation();

      jest.spyOn(officeTableUpdate, 'setHeaderValuesNoCrosstab').mockImplementation();

      jest.spyOn(officeRemoveHelper, 'deleteRowsInChunks').mockImplementation();

      const excelContextSyncMock = jest.fn();
      const excelContextMock = { sync: excelContextSyncMock };

      const result = await officeTableUpdate.updateOfficeTable(
        instanceDefinitionMock,
        excelContextMock,
        'startCellTest',
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
      expect(officeTableUpdate.validateAddedRowsRange).toBeCalledWith(excelContextMock, 'rowsTest', prevOfficeTableMock);

      if (isCrosstabParam) {
        expect(officeTableUpdate.createHeadersForCrosstab).toBeCalledTimes(1);
        expect(officeTableUpdate.createHeadersForCrosstab).toBeCalledWith(
          'worksheetTest',
          instanceDefinitionMock,
          'startCellTest'
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
        excelContextMock, prevOfficeTableMock, 500, 'rowsTest'
      );

      expect(result).toEqual(prevOfficeTableMock);
    });

  it.each`
  expectedApplySubtotalFormattingCallsNo | subtotalsAddressesParam
  
  ${0}                                   | ${undefined}
  ${0}                                   | ${[]}
  ${1}                                   | ${[42]}
  ${1}                                   | ${[42, 4242]}
  
  `('handleSubtotalsFormatting should work as expected',
    async ({ expectedApplySubtotalFormattingCallsNo, subtotalsAddressesParam }) => {
    // given
      jest.spyOn(officeFormatSubtotals, 'applySubtotalFormatting').mockImplementation();

      // when
      await officeTableUpdate.handleSubtotalsFormatting(
        'excelContextTest',
        'prevOfficeTableTest',
        'mstrTableTest',
        subtotalsAddressesParam
      );

      // then
      expect(officeFormatSubtotals.applySubtotalFormatting).toBeCalledTimes(expectedApplySubtotalFormattingCallsNo);
      if (expectedApplySubtotalFormattingCallsNo > 0) {
        expect(officeFormatSubtotals.applySubtotalFormatting).toBeCalledWith(
          'prevOfficeTableTest',
          'excelContextTest',
          'mstrTableTest',
          false
        );
      }
    });

  it('validateAddedRowsRange should work as expected when addedRowsCount === 0', async () => {
    // given
    jest.spyOn(officeTableUpdate, 'getAddedRowsCount').mockReturnValue(0);

    // when
    await officeTableUpdate.validateAddedRowsRange('excelContextTest', 'newRowsCountTest', { rows: 'rowsTest' });

    // then
    expect(officeTableUpdate.getAddedRowsCount).toBeCalledTimes(1);
    expect(officeTableUpdate.getAddedRowsCount).toBeCalledWith('excelContextTest', 'newRowsCountTest', 'rowsTest');
  });

  it('validateAddedRowsRange should work as expected when addedRowsCount > 0', async () => {
    // given
    jest.spyOn(officeTableUpdate, 'getAddedRowsCount').mockReturnValue('getAddedRowsCountTest');

    const getRowsBelowMock = jest.fn().mockReturnValue('bottomRangeTest');
    const prevOfficeTableMock = {
      rows: 'rowsTest',
      getRange: jest.fn().mockReturnValue({
        getRowsBelow: getRowsBelowMock,
      })
    };

    jest.spyOn(officeTableHelperRange, 'checkRangeValidity').mockImplementation();

    // when
    await officeTableUpdate.validateAddedRowsRange('excelContextTest', 'newRowsCountTest', prevOfficeTableMock);

    // then
    expect(officeTableUpdate.getAddedRowsCount).toBeCalledTimes(1);
    expect(officeTableUpdate.getAddedRowsCount).toBeCalledWith('excelContextTest', 'newRowsCountTest', 'rowsTest');

    expect(getRowsBelowMock).toBeCalledTimes(1);
    expect(getRowsBelowMock).toBeCalledWith('getAddedRowsCountTest');

    expect(officeTableHelperRange.checkRangeValidity).toBeCalledTimes(1);
    expect(officeTableHelperRange.checkRangeValidity).toBeCalledWith('excelContextTest', 'bottomRangeTest');
  });

  it.each`
  expectedResult | newRowsCountParam | prevRowsCount
  
  ${0} | ${0} | ${0}
  ${1} | ${1} | ${0}
  ${0} | ${0} | ${1}
  ${0} | ${1} | ${1}
  
  `('getAddedRowsCount should work as expected',
    async ({ expectedResult, newRowsCountParam, prevRowsCount }) => {
    // given
      jest.spyOn(officeApiDataLoader, 'loadSingleExcelData').mockReturnValue(prevRowsCount);

      // when
      const result = await officeTableUpdate.getAddedRowsCount('excelContextTest', newRowsCountParam, 'prevOfficeTableRowsTest');

      // then
      expect(officeApiDataLoader.loadSingleExcelData).toBeCalledTimes(1);
      expect(officeApiDataLoader.loadSingleExcelData).toBeCalledWith('excelContextTest', 'prevOfficeTableRowsTest', 'count');

      expect(result).toEqual(expectedResult);
    });

  it('createHeadersForCrosstab should work as expected', () => {
    // given
    jest.spyOn(officeApiCrosstabHelper, 'getCrosstabHeaderDimensions').mockReturnValue('crosstabHeaderDimensionsTest');

    jest.spyOn(officeApiCrosstabHelper, 'createCrosstabHeaders').mockImplementation();

    // when
    officeTableUpdate.createHeadersForCrosstab('sheetTest', { mstrTable: 'mstrTableTest' }, 'startCellTest');

    // then
    expect(officeApiCrosstabHelper.getCrosstabHeaderDimensions).toBeCalledTimes(1);
    expect(officeApiCrosstabHelper.getCrosstabHeaderDimensions).toBeCalledWith({ mstrTable: 'mstrTableTest' });

    expect(officeApiCrosstabHelper.createCrosstabHeaders).toBeCalledTimes(1);
    expect(officeApiCrosstabHelper.createCrosstabHeaders).toBeCalledWith(
      'startCellTest',
      'mstrTableTest',
      'sheetTest',
      'crosstabHeaderDimensionsTest'
    );
  });

  it.each`
  expectedValues               | headerColumnsParam
  
  ${{ values: [42] }}          | ${[42]}
  ${{ values: [42] }}          | ${[41, 42]}
  ${{ values: [42] }}          | ${[40, 41, 42]}
  
  `('setHeaderValuesNoCrosstab should work as expected',
    ({ expectedValues, headerColumnsParam }) => {
    // given
      const excelContextMock = {
        workbook: {
          application: {
            suspendApiCalculationUntilNextSync: jest.fn()
          }
        }
      };

      const getHeaderRowRangeMock = {};
      const prevOfficeTableMock = {
        getHeaderRowRange: jest.fn().mockReturnValue(getHeaderRowRangeMock)
      };

      // when
      officeTableUpdate.setHeaderValuesNoCrosstab(excelContextMock, prevOfficeTableMock, headerColumnsParam);

      // then
      expect(excelContextMock.workbook.application.suspendApiCalculationUntilNextSync).toBeCalledTimes(1);
      expect(excelContextMock.workbook.application.suspendApiCalculationUntilNextSync).toBeCalledWith();

      expect(prevOfficeTableMock.getHeaderRowRange).toBeCalledTimes(1);
      expect(getHeaderRowRangeMock).toEqual(expectedValues);
    });
});
