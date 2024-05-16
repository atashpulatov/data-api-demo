import { officeApiHelper } from '../api/office-api-helper';

import { reduxStore } from '../../store';

import { MstrTable } from '../../redux-reducer/operation-reducer/operation-reducer-types';

import stepApplyFormatting from '../format/step-apply-formatting';

class PivotTableHelper {
  async getPivotTable(
    excelContext: Excel.RequestContext,
    pivotTableId: string
  ): Promise<Excel.PivotTable> {
    const pivotTableOrNullObject =
      excelContext.workbook.pivotTables.getItemOrNullObject(pivotTableId);

    pivotTableOrNullObject.load('isNullObject');
    await excelContext.sync();

    return pivotTableOrNullObject;
  }

  async addAttributesToColumns(
    pivotTable: Excel.PivotTable,
    attributesInfo: any,
    excelContext: Excel.RequestContext
  ): Promise<void> {
    pivotTable.load('rowHierarchies/items/id');
    await excelContext.sync();

    const attributesIds = new Set(pivotTable.rowHierarchies.items.map(({ id }) => id));

    for (const name of attributesInfo) {
      if (!attributesIds.has(name)) {
        pivotTable.rowHierarchies.add(pivotTable.hierarchies.getItem(name));
      }
    }
  }

  async addMetricsToValues(
    pivotTable: Excel.PivotTable,
    metricsInfo: any,
    excelContext: Excel.RequestContext
  ): Promise<void> {
    pivotTable.load('dataHierarchies/items/field/id');
    await excelContext.sync();

    const metricsIds = new Set(pivotTable.dataHierarchies.items.map(({ field }) => field.id));

    for (const metric of metricsInfo) {
      if (!metricsIds.has(metric.name)) {
        const item = pivotTable.dataHierarchies.add(pivotTable.hierarchies.getItem(metric.name));
        item.numberFormat = stepApplyFormatting.getFormat(metric) as any;
      }
    }
  }

  async populatePivotTable(
    pivotTable: Excel.PivotTable,
    mstrTable: MstrTable,
    excelContext: Excel.RequestContext
  ): Promise<void> {
    const { pivotTableAddAttributesToColumns, pivotTableAddMetricsToValues } =
      reduxStore.getState().settingsReducer;

    if (pivotTableAddAttributesToColumns) {
      await this.addAttributesToColumns(
        pivotTable,
        mstrTable.attributesNames.rowsAttributes,
        excelContext
      );
    }

    if (pivotTableAddMetricsToValues) {
      await this.addMetricsToValues(
        pivotTable,
        mstrTable.columnInformation.filter(({ isAttribute }) => !isAttribute),
        excelContext
      );
    }
  }

  async removePivotSourceWorksheet(
    worksheet: Excel.Worksheet,
    excelContext: Excel.RequestContext,
    officeTable: Excel.Table,
    pivotTableId: string
  ): Promise<void> {
    let doesWorksheetExist = false;

    worksheet.load('isNullObject');
    await excelContext.sync();

    if (worksheet && !worksheet.isNullObject) {
      doesWorksheetExist = true;
    }

    // Added not to trigger the onDelete sheet event
    excelContext.runtime.enableEvents = false;

    if (officeTable && doesWorksheetExist) {
      worksheet.visibility = Excel.SheetVisibility.hidden;
      await excelContext.sync();

      worksheet.delete();
      await excelContext.sync();

      if (pivotTableId) {
        const officeContext = await officeApiHelper.getOfficeContext();
        officeContext.document.bindings.releaseByIdAsync(pivotTableId);
      }
    }

    excelContext.runtime.enableEvents = true;
  }

  async removePivotTable(
    pivotTable: Excel.PivotTable,
    excelContext: Excel.RequestContext
  ): Promise<void> {
    if (!pivotTable.isNullObject) {
      pivotTable.delete();
      await excelContext.sync();
    }
  }
}

export const pivotTableHelper = new PivotTableHelper();
