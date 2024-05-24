import {
  getObjectDetailsRange,
  insertAndFormatObjectDetails,
} from '../../mstr-object/object-info-helper';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';
import { officeApiWorksheetHelper } from '../api/office-api-worksheet-helper';
import getOfficeTableHelper from './get-office-table-helper';
import officeTableHelperRange from './office-table-helper-range';

import { reduxStore } from '../../store';

import { VisualizationTypes } from '../../mstr-object/mstr-object-types';
import { PageByData } from '../../page-by/page-by-types';
import { InstanceDefinition } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import { calculateOffsetForObjectInfoSettings } from '../../mstr-object/get-object-details-methods';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import officeApiDataLoader from '../api/office-api-data-loader';

const DEFAULT_TABLE_STYLE = 'TableStyleLight11';

// Pair of extra rows required to be appended to formatted crosstab table, in order to track the imported range
export const FORMATTED_TABLE_SINGLE_GRID_LINE = 1;

class OfficeTableCreate {
  /**
   * Creates an office table if it's a new import or if the number of columns of an existing table changes.
   * If we are refreshing a table and the new definiton range is not empty we keep the original table.
   *
   * @param instanceDefinition
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param startCell  Top left corner cell
   * @param tableName Name of the Excel Table
   * @param prevOfficeTable Previous office table to refresh
   * @param tableChanged Specify if table columns has been changed. False by default
   * @param isRepeatStep Specify if repeat creating of the table
   * @param insertNewWorksheet Specify if new worksheet has to be created before creating the table
   * @param pageByData Contains information about page-by elements
   *
   */
  async createOfficeTable({
    instanceDefinition,
    excelContext,
    startCell,
    tableName,
    prevOfficeTable,
    tableChanged = false,
    isRepeatStep,
    insertNewWorksheet,
    pageByData,
    objectData,
  }: {
    instanceDefinition: InstanceDefinition;
    excelContext: Excel.RequestContext;
    startCell: string;
    tableName?: string;
    prevOfficeTable?: Excel.Table;
    tableChanged?: boolean;
    isRepeatStep?: boolean;
    insertNewWorksheet: boolean;
    pageByData?: PageByData;
    objectData: ObjectData;
  }): Promise<any> {
    const {
      rows,
      columns,
      mstrTable,
      mstrTable: { isCrosstab, crosstabHeaderDimensions, name },
    } = instanceDefinition;

    const { importType, mstrObjectType } = objectData;

    const newOfficeTableName = getOfficeTableHelper.createTableName(mstrTable, tableName);
    const worksheet = await officeApiWorksheetHelper.getWorksheet(
      excelContext,
      importType,
      name,
      pageByData,
      prevOfficeTable,
      insertNewWorksheet
    );

    if (insertNewWorksheet) {
      startCell = 'A1';
    } else if (!startCell) {
      startCell = await officeApiHelper.getSelectedCell(excelContext);
    }
    const { worksheetObjectInfoSettings } = reduxStore.getState().settingsReducer;

    const objectDetailsSize = calculateOffsetForObjectInfoSettings(
      worksheetObjectInfoSettings,
      mstrObjectType,
      pageByData?.elements?.length > 0
    );

    const objectDetailsStartCell = startCell;
    if (objectDetailsSize > 0) {
      startCell = officeApiHelper.offsetCellBy(startCell, objectDetailsSize, 0);
    }

    const tableStartCell = this.getTableStartCell(
      startCell,
      instanceDefinition,
      prevOfficeTable,
      tableChanged
    );

    const tableRange = officeApiHelper.getRange(columns, tableStartCell, rows);
    const range = this.getObjectRange(tableStartCell, worksheet, tableRange, mstrTable);

    excelContext.trackedObjects.add(range);

    await officeTableHelperRange.checkObjectRangeValidity(
      prevOfficeTable,
      excelContext,
      range,
      instanceDefinition,
      isRepeatStep
    );

    if (objectDetailsSize > 0) {
      const objectDetailsRange = await getObjectDetailsRange({
        worksheet,
        objectDetailsStartCell,
        objectDetailsSize,
      });
      await insertAndFormatObjectDetails({
        objectData,
        excelContext,
        objectDetailsRange,
      });
    }

    range.numberFormat = '' as unknown as any[][];

    const officeTable = worksheet.tables.add(tableRange, true); // create office table based on the range
    this.styleHeaders(officeTable);

    if (isCrosstab) {
      officeApiCrosstabHelper.createCrosstabHeaders(
        officeTable,
        mstrTable,
        crosstabHeaderDimensions,
        objectData
      );
    }

    return this.setOfficeTableProperties({
      officeTable,
      newOfficeTableName,
      mstrTable,
      worksheet,
      startCell,
      excelContext,
      objectDetailsSize,
    });
  }


  /**
   * Creates an office table if it's a new import or if the number of columns of an existing table changes.
   * If we are refreshing a table and the new definiton range is not empty we keep the original table.
   *
   * @param instanceDefinition
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param startCell  Top left corner cell
   * @param tableName Name of the Excel Table
   * @param prevOfficeTable Previous office table to refresh
   * @param isRepeatStep Specify if repeat creating of the table
   * @param insertNewWorksheet Specify if new worksheet has to be created before creating the table
   * @param pageByData Contains information about page-by elements
   * @param objectData Contains information about the MSTR object
   *
   */
  async createDefaultOfficeTable({
    instanceDefinition,
    excelContext,
    startCell,
    tableName,
    prevOfficeTable,
    isRepeatStep,
    insertNewWorksheet,
    pageByData,
    objectData,
  }: {
    instanceDefinition: InstanceDefinition;
    excelContext: Excel.RequestContext;
    startCell: string;
    tableName?: string;
    prevOfficeTable?: Excel.Table;
    tableChanged?: boolean;
    isRepeatStep?: boolean;
    insertNewWorksheet: boolean;
    pageByData?: PageByData;
    objectData: ObjectData;
  }): Promise<any> {
    const {
      mstrTable,
      mstrTable: { isCrosstab, name, visualizationType },
    } = instanceDefinition;
    const { importType, crosstabHeaderDimensions, mstrObjectType } = objectData;

    const newOfficeTableName = getOfficeTableHelper.createTableName(mstrTable, tableName);
    const worksheet = await officeApiWorksheetHelper.getWorksheet(
      excelContext,
      importType,
      name,
      pageByData,
      prevOfficeTable,
      insertNewWorksheet
    );

    if (insertNewWorksheet) {
      startCell = 'A1';
    } else if (!startCell) {
      startCell = await officeApiHelper.getSelectedCell(excelContext);
    }

    let { rows, columns } = instanceDefinition;
    if (isCrosstab) {
      const { rowsX, rowsY, columnsX, columnsY } = crosstabHeaderDimensions;
      rows = columnsY + rowsY;
      columns = columnsX + rowsX;

      if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name
        && visualizationType !== VisualizationTypes.GRID) {
        columns -= FORMATTED_TABLE_SINGLE_GRID_LINE;
      }
    }
    const tableRange = officeApiHelper.getRange(columns, startCell, rows);
    const range = worksheet.getRange(tableRange)

    excelContext.trackedObjects.add(range);

    await officeTableHelperRange.checkObjectRangeValidity(
      prevOfficeTable,
      excelContext,
      range,
      instanceDefinition,
      isRepeatStep
    );

    const a = range.getOffsetRange(-1, 0).getResizedRange(1, 0);
    a.load('address');

    a.clear();
    await excelContext.sync();

    console.log('aaaaa', a);


    const officeTable = worksheet.tables.add(tableRange, true); // create office table based on the range

    if (isCrosstab) {
      officeTable.showHeaders = false;
    }

    this.styleHeaders(officeTable);

    return this.setOfficeTableProperties({
      officeTable,
      newOfficeTableName,
      mstrTable,
      worksheet,
      startCell,
      excelContext,
    });
  }

  /**
   * Set style for office table
   * @param officeTable
   *
   */
  styleHeaders(officeTable: Excel.Table): void {
    officeTable.style = DEFAULT_TABLE_STYLE;
  }

  /**
   * Get range of the table. For crosstabs range is extended by headers.
   *
   * @param tableStartCell  Top left corner cell address
   * @param sheet  excel worksheet
   * @param tableRange address of range of the table
   * @param mstrTable  contains informations about mstr object
   * @returns Excel Range
   *
   */
  getObjectRange(
    tableStartCell: string,
    sheet: Excel.Worksheet,
    tableRange: string,
    mstrTable: any
  ): Excel.Range {
    const { isCrosstab, crosstabHeaderDimensions } = mstrTable;
    if (isCrosstab) {
      return officeApiCrosstabHelper.getCrosstabRange(
        tableStartCell,
        crosstabHeaderDimensions,
        sheet
      );
    }
    return sheet.getRange(tableRange);
  }

  /**
   * Get top left cell from the excel table. For crosstabs return the first cell of Excel table not crosstab headers.
   *
   * @param startCell  Top left corner cell
   * @param instanceDefinition
   * @param prevOfficeTable previous office table
   * @param tableChanged Specify if table columns has been changed.
   * @returns Table start cell address
   */
  getTableStartCell(
    startCell: string,
    instanceDefinition: any,
    prevOfficeTable: Excel.Table,
    tableChanged: boolean
  ): string {
    const { mstrTable } = instanceDefinition;
    const {
      isCrosstab,
      prevCrosstabDimensions = false,
      crosstabHeaderDimensions = false,
    } = mstrTable;
    const { rowsX: prevRowsX, columnsY: prevColumnsY } = prevCrosstabDimensions;
    const { rowsX, columnsY } = crosstabHeaderDimensions;

    let tableStartCell = officeApiHelper.getTableStartCell({
      startCell,
      instanceDefinition,
      prevOfficeTable,
    });

    if (
      prevCrosstabDimensions &&
      prevCrosstabDimensions !== crosstabHeaderDimensions &&
      isCrosstab
    ) {
      if (tableChanged) {
        tableStartCell = officeApiHelper.offsetCellBy(tableStartCell, columnsY - 1, rowsX);
      } else {
        tableStartCell = officeApiHelper.offsetCellBy(
          tableStartCell,
          columnsY - prevColumnsY,
          rowsX - prevRowsX
        );
      }
    }

    return tableStartCell;
  }

  /**
   * Set name of the table and format office table headers
   *
   * @param officeTable previous office table
   * @param newOfficeTableName office table name
   * @param mstrTable  contains informations about mstr object
   * @param worksheet  excel worksheet
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @returns Object containing office table properties
   */
  async setOfficeTableProperties({
    officeTable,
    newOfficeTableName,
    mstrTable,
    worksheet,
    startCell,
    excelContext,
    objectDetailsSize,
  }: {
    officeTable: Excel.Table;
    newOfficeTableName: string;
    mstrTable: any;
    worksheet: Excel.Worksheet;
    startCell: string;
    excelContext: Excel.RequestContext;
    objectDetailsSize?: number;
  }): Promise<any> {
    const { isCrosstab } = mstrTable;
    try {
      officeTable.load(['name', 'id']);
      officeTable.name = newOfficeTableName;
      if (!isCrosstab) {
        officeTable.getHeaderRowRange().values = [
          mstrTable.headers.columns[mstrTable.headers.columns.length - 1],
        ];
      }

      await excelContext.sync();
      const bindId = officeTable.id;

      const {
        name,
        id,
        position: index,
      } = await officeApiDataLoader.loadExcelData(excelContext, [
        { object: worksheet, key: 'name' },
        { object: worksheet, key: 'id' },
        { object: worksheet, key: 'position' },
      ]);

      return {
        officeTable,
        bindId,
        tableName: newOfficeTableName,
        worksheet: { id, name, index },
        startCell,
        groupData: { key: id, title: name, index },
        objectDetailsSize,
      };
    } catch (error) {
      await excelContext.sync();
      throw error;
    }
  }
}

const officeTableCreate = new OfficeTableCreate();
export default officeTableCreate;
