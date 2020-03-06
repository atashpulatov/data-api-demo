import { officeApiHelper } from '../api/office-api-helper';
import officeTableHelper from './office-table-helper';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';

const DEFAULT_TABLE_STYLE = 'TableStyleLight11';
const TABLE_HEADER_FONT_COLOR = '#000000';
const TABLE_HEADER_FILL_COLOR = '#ffffff';

class OfficeTableCreate {
  /**
   * Creates an office table if it's a new import or if the number of columns of an existing table changes.
   * If we are refreshing a table and the new definiton range is not empty we keep the original table.
   *
   * @param {Object} instanceDefinition
   * @param {Object} excelContext ExcelContext
   * @param {string} startCell  Top left corner cell
   * @param {string} newOfficeTableName Excel Binding ID
   * @param {Object} prevOfficeTable Previous office table to refresh
   * @param {Boolean} tableColumnsChanged Specify if table columns has been changed. False by default
   *
   */
  createOfficeTable = async (
    {
      instanceDefinition,
      excelContext,
      startCell,
      newOfficeTableName,
      prevOfficeTable,
      tableColumnsChanged = false
    }) => {
    const {
      rows, columns, mstrTable, mstrTable:{ isCrosstab, crosstabHeaderDimensions }
    } = instanceDefinition;

    const worksheet = this.getExcelWorksheet(prevOfficeTable, excelContext);
    const tableStartCell = this.getTableStartCell(
      startCell,
      worksheet,
      instanceDefinition,
      prevOfficeTable,
      tableColumnsChanged
    );

    const tableRange = officeApiHelper.getRange(columns, tableStartCell, rows);
    const range = this.getObjectRange(tableStartCell, worksheet, tableRange, mstrTable);
    excelContext.trackedObjects.add(range);
    await officeTableHelper.checkObjectRangeValidity(prevOfficeTable, excelContext, range, instanceDefinition);

    if (isCrosstab) {
      officeTableHelper.createCrosstabHeaders(tableStartCell, mstrTable, worksheet, crosstabHeaderDimensions);
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
   * @param {Object} excelContext excelContext
   *
   */
  getExcelWorksheet = (prevOfficeTable, excelContext) => {
    if (prevOfficeTable) {
      return prevOfficeTable.worksheet;
    }
    return excelContext.workbook.worksheets.getActiveWorksheet();
  }

  /**
   * Get range of the table. For crosstabs range is extended by headers.
   *
   * @param {Boolean} isCrosstab  Specified if object is crosstab report
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
   * @param {Boolean} tableColumnsChanged Specify if table columns has been changed
   *
   */
  getTableStartCell = (startCell, sheet, instanceDefinition, prevOfficeTable, tableColumnsChanged) => {
    const { mstrTable } = instanceDefinition;
    const { isCrosstab, prevCrosstabDimensions = false, crosstabHeaderDimensions = false } = mstrTable;
    const { rowsX: prevRowsX, columnsY: prevColumnsY } = prevCrosstabDimensions;
    const { rowsX, columnsY } = crosstabHeaderDimensions;

    let tableStartCell = officeApiHelper.getTableStartCell({
      startCell,
      sheet,
      instanceDefinition,
      prevOfficeTable,
      tableColumnsChanged
    });


    if (prevCrosstabDimensions && prevCrosstabDimensions !== crosstabHeaderDimensions && isCrosstab) {
      if (tableColumnsChanged) {
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
   * @param {Object} excelContext excelContext
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
      const newBindingId = officeTable.id;

      return { officeTable, newBindingId };
    } catch (error) {
      await excelContext.sync();
      throw error;
    }
  }
}
const officeTableCreate = new OfficeTableCreate();
export default officeTableCreate;
