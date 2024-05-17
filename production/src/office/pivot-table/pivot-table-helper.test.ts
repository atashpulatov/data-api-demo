import { officeApiHelper } from '../api/office-api-helper';
import { pivotTableHelper } from './pivot-table-helper';

import { reduxStore } from '../../store';

import stepApplyFormatting from '../format/step-apply-formatting';

describe('PivotTableHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('retrieves Excel pivot table by ID', async () => {
    // given
    const excelContextMock = {
      sync: jest.fn(),
      workbook: {
        pivotTables: {
          getItemOrNullObject: jest.fn().mockImplementation(id => ({
            id,
            load: jest.fn(),
          })),
        },
      },
    } as unknown as Excel.RequestContext;

    const pivotTableId = 'pivotTableId';

    // when
    const pivotTable = await pivotTableHelper.getPivotTable(excelContextMock, pivotTableId);

    // then
    expect(excelContextMock.workbook.pivotTables.getItemOrNullObject).toHaveBeenCalledWith(
      pivotTableId
    );
    expect(pivotTable.id).toEqual(pivotTableId);
  });

  it('adds attributes to Pivot Table columns', async () => {
    // given
    const excelContextMock = {
      sync: jest.fn(),
    } as unknown as Excel.RequestContext;

    jest.spyOn(reduxStore, 'getState').mockReturnValue({
      // @ts-ignore
      settingsReducer: {
        pivotTableAddAttributesToColumns: true,
      },
    });

    const pivotTableMock = {
      rowHierarchies: {
        items: [
          {
            id: 'Category',
          },
        ],
        add: jest.fn().mockImplementation(item => item),
      },
      hierarchies: {
        getItem: jest
          .fn()
          .mockReturnValueOnce({ name: 'Region' })
          .mockReturnValueOnce({ name: 'Call Center' }),
      },
      load: jest.fn(),
    } as unknown as Excel.PivotTable;

    const attributesInfo = ['Category', 'Region', 'Call Center'];

    // when
    await pivotTableHelper.addAttributesToColumns(pivotTableMock, attributesInfo, excelContextMock);

    // then
    expect(pivotTableMock.load).toHaveBeenCalledWith('rowHierarchies/items/id');
    expect(pivotTableMock.hierarchies.getItem).toHaveBeenCalledTimes(2);
    expect(pivotTableMock.rowHierarchies.add).toHaveBeenCalledTimes(2);
    expect(pivotTableMock.rowHierarchies.add).toHaveBeenCalledWith({ name: 'Region' });
    expect(pivotTableMock.rowHierarchies.add).toHaveBeenCalledWith({ name: 'Call Center' });
  });

  it('adds metrics to Pivot Table values', async () => {
    // given
    const excelContextMock = {
      sync: jest.fn(),
    } as unknown as Excel.RequestContext;

    jest.spyOn(reduxStore, 'getState').mockReturnValue({
      // @ts-ignore
      settingsReducer: {
        pivotTableAddMetricsToValues: true,
      },
    });

    jest.spyOn(stepApplyFormatting, 'getFormat').mockImplementation();

    const pivotTableMock = {
      dataHierarchies: {
        items: [
          {
            field: {
              id: 'Profit',
            },
          },
        ],
        add: jest.fn().mockImplementation(item => item),
      },
      hierarchies: {
        getItem: jest
          .fn()
          .mockReturnValueOnce({ name: 'Revenue' })
          .mockReturnValueOnce({ name: 'Cost' }),
      },
      load: jest.fn(),
    } as unknown as Excel.PivotTable;

    const metricsInfo = [{ name: 'Revenue' }, { name: 'Profit' }, { name: 'Cost' }];

    // when
    await pivotTableHelper.addMetricsToValues(pivotTableMock, metricsInfo, excelContextMock);

    // then
    expect(pivotTableMock.load).toHaveBeenCalledWith('dataHierarchies/items/field/id');
    expect(pivotTableMock.hierarchies.getItem).toHaveBeenCalledTimes(2);
    expect(pivotTableMock.dataHierarchies.add).toHaveBeenCalledTimes(2);
    expect(pivotTableMock.dataHierarchies.add).toHaveBeenCalledWith({ name: 'Revenue' });
    expect(pivotTableMock.dataHierarchies.add).toHaveBeenCalledWith({ name: 'Cost' });
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
