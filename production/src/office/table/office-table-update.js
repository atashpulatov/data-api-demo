import { CONTEXT_LIMIT } from '../../mstr-object/mstr-object-rest-service';
import officeTableHelperRange from './office-table-helper-range';
import officeFormatSubtotals from '../format/office-format-subtotals';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import officeApiDataLoader from '../api/office-api-data-loader';

class OfficeTableUpdate {
  /**
   * Updates office table if the number of columns or rows of an existing table changes.
   *
   * @param {Object} instanceDefinition
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {string} startCell  Top left corner cell
   * @param {Object} prevOfficeTable Previous office table to refresh
   *
   */
  updateOfficeTable = async (instanceDefinition, excelContext, startCell, prevOfficeTable) => {
    console.time('Validate existing table');

    const { rows, mstrTable, mstrTable: { isCrosstab, subtotalsInfo: { subtotalsAddresses } } } = instanceDefinition;

    try {
      await this.handleSubtotalsFormatting(excelContext, prevOfficeTable, mstrTable, subtotalsAddresses);

      await this.validateAddedRowsRange(excelContext, rows, prevOfficeTable);

      if (isCrosstab) {
        this.createHeadersForCrosstab(prevOfficeTable.worksheet, instanceDefinition, startCell);
      } else {
        this.setHeaderValuesNoCrosstab(excelContext, prevOfficeTable, mstrTable.headers.columns);
      }

      await excelContext.sync();

      await this.updateRows(excelContext, prevOfficeTable, rows);

      return prevOfficeTable;
    } catch (error) {
      await excelContext.sync();
      throw error;
    } finally {
      console.timeEnd('Validate existing table');
    }
  };

  handleSubtotalsFormatting = async (excelContext, prevOfficeTable, mstrTable, subtotalsAddresses) => {
    if (subtotalsAddresses && subtotalsAddresses.length) {
      await officeFormatSubtotals.applySubtotalFormatting(prevOfficeTable, excelContext, mstrTable, false);
    }
  };

  validateAddedRowsRange = async (excelContext, newRowsCount, prevOfficeTable) => {
    const addedRowsCount = await this.getAddedRowsCount(excelContext, newRowsCount, prevOfficeTable.rows);

    // If the new table has more rows during update check validity
    if (addedRowsCount) {
      const bottomRange = prevOfficeTable.getRange().getRowsBelow(addedRowsCount);
      await officeTableHelperRange.checkRangeValidity(excelContext, bottomRange);
    }
  };

  getAddedRowsCount = async (excelContext, newRowsCount, prevOfficeTableRows) => {
    const prevRowsCount = await officeApiDataLoader.loadSingleExcelData(excelContext, prevOfficeTableRows, 'count');

    return Math.max(0, newRowsCount - prevRowsCount);
  };

  createHeadersForCrosstab = (sheet, instanceDefinition, startCell) => {
    const crosstabHeaderDimensions = officeApiCrosstabHelper.getCrosstabHeaderDimensions(instanceDefinition);

    const { mstrTable } = instanceDefinition;
    officeApiCrosstabHelper.createCrosstabHeaders(startCell, mstrTable, sheet, crosstabHeaderDimensions);
  };

  setHeaderValuesNoCrosstab = (excelContext, prevOfficeTable, headerColumns) => {
    excelContext.workbook.application.suspendApiCalculationUntilNextSync();

    prevOfficeTable.getHeaderRowRange().values = [headerColumns[headerColumns.length - 1]];
  };

  /**
   * Updates number of rows in office table.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Object} prevOfficeTable Previous office table to refresh
   * @param {number} newRowsCount Number of rows in the object
   *
   */
  updateRows = async (excelContext, prevOfficeTable, newRowsCount) => {
    const tableRows = prevOfficeTable.rows;

    const tableRowCount = await officeApiDataLoader.loadSingleExcelData(excelContext, tableRows, 'count');
    // Delete extra rows if new report is smaller
    if (newRowsCount < tableRowCount) {
      prevOfficeTable
        .getRange()
        .getRow(newRowsCount + 1)
        .getResizedRange(tableRowCount - newRowsCount, 0)
        .clear();

      await excelContext.sync();

      const rowsToRemove = await officeApiDataLoader.loadSingleExcelData(excelContext, tableRows, 'items');

      for (let i = tableRowCount - 1; i >= newRowsCount; i--) {
        rowsToRemove[i].delete();
        if (i === newRowsCount || i % CONTEXT_LIMIT === 0) {
          await excelContext.sync();
        }
      }
    }
  }
}

const officeTableUpdate = new OfficeTableUpdate();
export default officeTableUpdate;
