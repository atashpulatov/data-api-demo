import { CONTEXT_LIMIT } from '../../mstr-object/mstr-object-rest-service';
import officeTableHelper from './office-table-helper';
import officeFormatSubtotals from '../format/office-format-subtotals';

class OfficeTableUpdate {
  /**
   * Updates office table if the number of columns or rows of an existing table changes.
   *
   * @param {Object} instanceDefinition
   * @param {Object} excelContext ExcelContext
   * @param {string} startCell  Top left corner cell
   * @param {Object} prevOfficeTable Previous office table to refresh
   *
   */
  updateOfficeTable = async (instanceDefinition, excelContext, startCell, prevOfficeTable) => {
    try {
      const { rows, mstrTable, mstrTable:{ isCrosstab, subtotalsInfo:{ subtotalsAddresses } } } = instanceDefinition;
      const crosstabHeaderDimensions = officeTableHelper.getCrosstabHeaderDimensions(instanceDefinition);

      prevOfficeTable.rows.load('count');
      await excelContext.sync();
      if (subtotalsAddresses.length) {
        await officeFormatSubtotals.applySubtotalFormatting(
          { officeTable:prevOfficeTable, excelContext },
          mstrTable,
          false
        );
      }
      const addedRows = Math.max(0, rows - prevOfficeTable.rows.count);
      // If the new table has more rows during update check validity
      if (addedRows) {
        const bottomRange = prevOfficeTable.getRange().getRowsBelow(addedRows);
        await officeTableHelper.checkRangeValidity(excelContext, bottomRange);
      }
      if (isCrosstab) {
        try {
          const sheet = prevOfficeTable.worksheet;
          officeTableHelper.createCrosstabHeaders(startCell, mstrTable, sheet, crosstabHeaderDimensions);
        } catch (error) {
          console.log(error);
        }
      }
      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
      if (!mstrTable.isCrosstab) {
        prevOfficeTable.getHeaderRowRange().values = [mstrTable.headers.columns[mstrTable.headers.columns.length - 1]];
      }
      await excelContext.sync();
      await this.updateRows(prevOfficeTable, excelContext, rows);
      return prevOfficeTable;
    } catch (error) {
      await excelContext.sync();
      throw error;
    }
  };

  /**
   * Updates number of rows in office table.
   *
   * @param {Object} prevOfficeTable Previous office table to refresh
   * @param {Object} excelContext ExcelContext
   * @param {number} rows  number of rows in the object
   *
   */
  updateRows = async (prevOfficeTable, excelContext, rows) => {
    const tableRows = prevOfficeTable.rows;
    tableRows.load('count');
    await excelContext.sync();
    const tableRowCount = tableRows.count;
    // Delete extra rows if new report is smaller
    if (rows < tableRowCount) {
      prevOfficeTable
        .getRange()
        .getRow(rows + 1)
        .getResizedRange(tableRowCount - rows, 0)
        .clear();
      await excelContext.sync();
      tableRows.load('items');
      await excelContext.sync();
      const rowsToRemove = tableRows.items;
      for (let i = tableRowCount - 1; i >= rows; i--) {
        rowsToRemove[i].delete();
        if (i === rows || i % CONTEXT_LIMIT === 0) {
          await excelContext.sync();
        }
      }
    }
  }
}
const officeTableUpdate = new OfficeTableUpdate();
export default officeTableUpdate;
