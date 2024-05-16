import { officeApiHelper } from '../api/office-api-helper';
import { pivotTableHelper } from './pivot-table-helper';

describe('PivotTableHelper', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('removePivotSourceWorksheet should work correctly', async () => {
    // Given
    const worksheet = {
      load: jest.fn(),
      visibility: Excel.SheetVisibility.veryHidden,
      delete: jest.fn(),
    } as unknown as Excel.Worksheet;

    const excelContext = {
      sync: jest.fn(),
      runtime: {
        enableEvents: false,
      },
    } as unknown as Excel.RequestContext;

    const officeTable = {} as Excel.Table;

    const pivotTableId = 'test';

    jest.spyOn(officeApiHelper, 'getOfficeContext').mockResolvedValue({
      document: {
        bindings: {
          releaseByIdAsync: jest.fn(),
        },
      },
    } as unknown as Office.Context);

    // When
    await pivotTableHelper.removePivotSourceWorksheet(
      worksheet,
      excelContext,
      officeTable,
      pivotTableId
    );

    // Then
    expect(worksheet.load).toHaveBeenCalledWith('isNullObject');
    expect(excelContext.sync).toHaveBeenCalled();
    expect(worksheet.visibility).toBe(Excel.SheetVisibility.hidden);
    expect(excelContext.sync).toHaveBeenCalled();
    expect(worksheet.delete).toHaveBeenCalled();
    expect(excelContext.sync).toHaveBeenCalled();
  });

  it('removePivotTable should work correctly', async () => {
    // Given
    const pivotTable = {
      delete: jest.fn(),
    } as unknown as Excel.PivotTable;

    const excelContext = {
      sync: jest.fn(),
    } as unknown as Excel.RequestContext;

    // When
    await pivotTableHelper.removePivotTable(pivotTable, excelContext);

    // Then
    expect(pivotTable.delete).toHaveBeenCalled();
    expect(excelContext.sync).toHaveBeenCalled();
  });
});
