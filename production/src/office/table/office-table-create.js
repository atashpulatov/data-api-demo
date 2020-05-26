import { officeApiHelper } from '../api/office-api-helper';
import officeTableHelperRange from './office-table-helper-range';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import getOfficeTableHelper from './get-office-table-helper';
import { officeApiWorksheetHelper } from '../api/office-api-worksheet-helper';

const DEFAULT_TABLE_STYLE = 'TableStyleLight11';
const TABLE_HEADER_FONT_COLOR = '#000000';
const TABLE_HEADER_FILL_COLOR = '#ffffff';

class OfficeTableCreate {
  /**
   * Creates an office table if it's a new import or if the number of columns of an existing table changes.
   * If we are refreshing a table and the new definiton range is not empty we keep the original table.
   *
   * @param {Object} instanceDefinition
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {string} startCell  Top left corner cell
   * @param {string} tableName Name of the Excel Table
   * @param {Object} prevOfficeTable Previous office table to refresh
   * @param {Boolean} tableChanged Specify if table columns has been changed. False by default
   *
   */
  createOfficeTable = async (
    {
      instanceDefinition,
      excelContext,
      startCell,
      tableName,
      prevOfficeTable,
      tableChanged = false,
      newStartCell,
      insertNewWorksheet
    }) => {
    const {
      rows, columns, mstrTable, mstrTable: { isCrosstab, crosstabHeaderDimensions }
    } = instanceDefinition;

    const newOfficeTableName = getOfficeTableHelper.createTableName(mstrTable, tableName);

    if (insertNewWorksheet) {
      newStartCell = await officeApiWorksheetHelper.getStartCell(insertNewWorksheet, excelContext);
      console.log('newStartCell:', newStartCell);
    }
    const newStartCellAdress = newStartCell || startCell;

    const worksheet = this.getExcelWorksheet(prevOfficeTable, insertNewWorksheet, excelContext);
    const tableStartCell = this.getTableStartCell(
      newStartCellAdress,
      worksheet,
      instanceDefinition,
      prevOfficeTable,
      tableChanged
    );

    const tableRange = officeApiHelper.getRange(columns, tableStartCell, rows);
    const range = this.getObjectRange(tableStartCell, worksheet, tableRange, mstrTable);
    excelContext.trackedObjects.add(range);

    await officeTableHelperRange.checkObjectRangeValidity(prevOfficeTable, excelContext, range, instanceDefinition, newStartCell);

    if (isCrosstab) {
      officeApiCrosstabHelper.createCrosstabHeaders(tableStartCell, mstrTable, worksheet, crosstabHeaderDimensions,);
    }


    const officeTable = worksheet.tables.add(tableRange, true); // create office table based on the range
    this.styleHeaders(officeTable, TABLE_HEADER_FONT_COLOR, TABLE_HEADER_FILL_COLOR);

    return this.setOfficeTableProperties({
      officeTable,
      newOfficeTableName,
      mstrTable,
      worksheet,
      excelContext
    });
  };


  /**
   * Set style for office table
   *
   * @param {Object} officeTable
   * @param {string} fontColor
   * @param {string} fillColor
   *
   */
  styleHeaders = (officeTable, fontColor, fillColor) => {
    officeTable.style = DEFAULT_TABLE_STYLE;
    // Temporarily disabling header formatting
    // const headerRowRange = officeTable.getHeaderRowRange();
    // headerRowRange.format.fill.color = fillColor;
    // headerRowRange.format.font.color = fontColor;
  };


  /**
   * Get excel worksheet of previous office table or acxtive if no table was passed.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   *
   */
  getExcelWorksheet = (prevOfficeTable, insertNewWorksheet, excelContext) => {
    if (prevOfficeTable && !insertNewWorksheet) {
      return prevOfficeTable.worksheet;
    }
    return excelContext.workbook.worksheets.getActiveWorksheet();
  }

  /**
   * Get range of the table. For crosstabs range is extended by headers.
   *
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   * @param {Object} tableStartCell  Top left corner cell
   * @param {Object} crosstabHeaderDimensions contains dimension of crosstab headers (columnsY, cloumnsX, RowsY, RowsX)
   * @param {Object} sheet  excel worksheet
   * @param {Object} tableRange range of the table
   *
   */
  getObjectRange = (tableStartCell, sheet, tableRange, mstrTable) => {
    const { isCrosstab, crosstabHeaderDimensions } = mstrTable;
    if (isCrosstab) {
      return officeApiCrosstabHelper.getCrosstabRange(tableStartCell, crosstabHeaderDimensions, sheet);
    }
    return sheet.getRange(tableRange);
  };

  /**
   * Get top left cell from the excel table. For crosstabs return the first cell of Excel table not crosstab headers.
   *
   * @param {string} startCell  Top left corner cell
   * @param {Object} sheet  excel worksheet
   * @param {Object} instanceDefinition
   * @param {Object} prevOfficeTable previous office table
   * @param {Boolean} tableChanged Specify if table columns has been changed.
   *
   */
  getTableStartCell = (startCell, sheet, instanceDefinition, prevOfficeTable, tableChanged) => {
    const { mstrTable } = instanceDefinition;
    const { isCrosstab, prevCrosstabDimensions = false, crosstabHeaderDimensions = false } = mstrTable;
    const { rowsX: prevRowsX, columnsY: prevColumnsY } = prevCrosstabDimensions;
    const { rowsX, columnsY } = crosstabHeaderDimensions;

    let tableStartCell = officeApiHelper.getTableStartCell({
      startCell,
      sheet,
      instanceDefinition,
      prevOfficeTable,
      tableChanged
    });


    if (prevCrosstabDimensions && prevCrosstabDimensions !== crosstabHeaderDimensions && isCrosstab) {
      if (tableChanged) {
        tableStartCell = officeApiHelper.offsetCellBy(tableStartCell, columnsY, rowsX);
      } else {
        tableStartCell = officeApiHelper.offsetCellBy(tableStartCell, columnsY - prevColumnsY, rowsX - prevRowsX);
      }
    }

    return tableStartCell;
  }

  /**
   * Set name of the table and format office table headers
   *
   * @param {Object} officeTable previous office table
   * @param {Object} officeTableId office table name
   * @param {Object} mstrTable  contains informations about mstr object
   * @param {Object} worksheet  excel worksheet
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   *
   */
  setOfficeTableProperties = async ({
    officeTable,
    newOfficeTableName,
    mstrTable,
    worksheet,
    excelContext
  }) => {
    const { isCrosstab } = mstrTable;
    try {
      officeTable.load(['name', 'id']);
      officeTable.name = newOfficeTableName;
      if (isCrosstab) {
        officeTable.showFilterButton = false;
        officeTable.showHeaders = false;
      } else {
        officeTable.getHeaderRowRange().values = [mstrTable.headers.columns[mstrTable.headers.columns.length - 1]];
      }
      worksheet.activate();
      await excelContext.sync();
      const bindId = officeTable.id;

      return { officeTable, bindId, tableName: newOfficeTableName };
    } catch (error) {
      await excelContext.sync();
      throw error;
    }
  }
}
const officeTableCreate = new OfficeTableCreate();
export default officeTableCreate;
