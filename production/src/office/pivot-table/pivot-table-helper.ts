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
}

export const pivotTableHelper = new PivotTableHelper();
