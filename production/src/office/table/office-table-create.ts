import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';
import { officeApiWorksheetHelper } from '../api/office-api-worksheet-helper';
import getOfficeTableHelper from './get-office-table-helper';
import officeTableHelperRange from './office-table-helper-range';

const DEFAULT_TABLE_STYLE = 'TableStyleLight11';

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
  }: {
    instanceDefinition: any;
    excelContext: Excel.RequestContext;
    startCell: string;
    tableName?: string;
    prevOfficeTable?: Excel.Table;
    tableChanged?: boolean;
    isRepeatStep?: boolean;
    insertNewWorksheet: boolean;
  }): Promise<any> {
    const {
      rows,
      columns,
      mstrTable,
      mstrTable: { isCrosstab, crosstabHeaderDimensions, name },
    } = instanceDefinition;

    const newOfficeTableName = getOfficeTableHelper.createTableName(mstrTable, tableName);

    if (insertNewWorksheet) {
      startCell = await officeApiWorksheetHelper.getStartCell(
        insertNewWorksheet,
        excelContext,
        name
      );
    }

    const worksheet = this.getExcelWorksheet(prevOfficeTable, insertNewWorksheet, excelContext);
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

    range.numberFormat = '' as unknown as any[][];

    const officeTable = worksheet.tables.add(tableRange, true); // create office table based on the range
    this.styleHeaders(officeTable);

    if (isCrosstab) {
      officeApiCrosstabHelper.createCrosstabHeaders(
        officeTable,
        mstrTable,
        crosstabHeaderDimensions
      );
    }

    return this.setOfficeTableProperties({
      officeTable,
      newOfficeTableName,
      mstrTable,
      worksheet,
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
   * Get excel worksheet of previous office table or acxtive if no table was passed.
   *
   * @param prevOfficeTable previous office table
   * @param insertNewWorksheet Specify if new worksheet has to be created before creating the table
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @returns Excel worksheet
   */
  getExcelWorksheet(
    prevOfficeTable: Excel.Table,
    insertNewWorksheet: boolean,
    excelContext: Excel.RequestContext
  ): Excel.Worksheet {
    if (prevOfficeTable && !insertNewWorksheet) {
      return prevOfficeTable.worksheet;
    }
    return excelContext.workbook.worksheets.getActiveWorksheet();
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
    excelContext,
  }: {
    officeTable: Excel.Table;
    newOfficeTableName: string;
    mstrTable: any;
    worksheet: Excel.Worksheet;
    excelContext: Excel.RequestContext;
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

      worksheet.activate();
      worksheet.load(['name', 'id']);

      await excelContext.sync();

      const bindId = officeTable.id;

      const { id, name } = worksheet;

      return {
        officeTable,
        bindId,
        tableName: newOfficeTableName,
        worksheet: { id, name },
      };
    } catch (error) {
      await excelContext.sync();
      throw error;
    }
  }
}

const officeTableCreate = new OfficeTableCreate();
export default officeTableCreate;
