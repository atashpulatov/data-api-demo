import { officeApiHelper } from '../api/office-api-helper';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';


class OfficeTableRefresh {
  getExistingOfficeTableData = async (excelContext, bindId, instanceDefinition, previousTableDimensions) => {
    const { mstrTable } = instanceDefinition;

    const prevOfficeTable = await officeApiHelper.getTable(excelContext, bindId);
    await this.clearEmptyCrosstabRow(mstrTable, prevOfficeTable, excelContext);

    prevOfficeTable.showHeaders = true;
    prevOfficeTable.load('name');
    await excelContext.sync();

    let startCell = await this.getStartCellOnRefresh(prevOfficeTable, excelContext);

    let tableColumnsChanged = false;
    ({ tableColumnsChanged, startCell } = await this.handleColumnChange(
      prevOfficeTable,
      excelContext,
      instanceDefinition,
      previousTableDimensions,
      startCell,
    ));

    return { tableColumnsChanged, prevOfficeTable, startCell };
  };

  handleColumnChange = async (
    prevOfficeTable,
    excelContext,
    instanceDefinition,
    previousTableDimensions,
    startCell,
  ) => {
    const { mstrTable } = instanceDefinition;

    let tableColumnsChanged = await this.checkColumnsChange(
      prevOfficeTable,
      excelContext,
      instanceDefinition,
      previousTableDimensions
    );

    ({ tableColumnsChanged, startCell } = await this.clearIfCrosstabHeadersChanged(
      prevOfficeTable,
      excelContext,
      tableColumnsChanged,
      startCell,
      mstrTable
    ));

    return { tableColumnsChanged, startCell };
  };

  clearEmptyCrosstabRow = async (mstrTable, prevOfficeTable, excelContext) => {
    const { isCrosstab, toCrosstabChange, prevCrosstabDimensions } = mstrTable;

    if (isCrosstab && !toCrosstabChange) {
      const crosstabEmptyRowExist = await officeApiCrosstabHelper.getValidOffset(
        prevOfficeTable,
        prevCrosstabDimensions.columnsY,
        'getRowsAbove',
        excelContext
      );

      if (crosstabEmptyRowExist) {
        officeApiCrosstabHelper.clearEmptyCrosstabRow(prevOfficeTable);
      }
    }
  };

  /**
   * Compares if the number of columns in table has changed.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Object} instanceDefinition
   *
   */
  checkColumnsChange = async (prevOfficeTable, excelContext, instanceDefinition, previousTableDimensions) => {
    const { columns } = instanceDefinition;
    const tableColumns = prevOfficeTable.columns;
    const prevTableColumns = previousTableDimensions.columns;

    tableColumns.load('count');
    await excelContext.sync();

    const tableColumnsCount = tableColumns.count;

    return columns !== tableColumnsCount || columns !== prevTableColumns;
  };

   /**
   * Get top left cell from the excel table.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} excelContext
   *
   */
   getStartCellOnRefresh = async (prevOfficeTable, excelContext) => {
     const headerCell = prevOfficeTable.getHeaderRowRange().getCell(0, 0);
     headerCell.load('address');
     await excelContext.sync();
     return officeApiHelper.getStartCellOfRange(headerCell.address);
   }

   /**
   * Get top left cell from the excel table. For crosstabs return the first cell of Excel table not crosstab headers.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} excelContext excel context
   * @param {Boolean} tableColumnsChanged Specify if table columns has been changed.
   * @param {string} startCell  Starting cell of Table
   * @param {Object} mstrTable  contains information about mstr object
   *
   */
   clearIfCrosstabHeadersChanged = async (prevOfficeTable, excelContext, tableColumnsChanged, startCell, mstrTable) => {
     const { prevCrosstabDimensions, crosstabHeaderDimensions, isCrosstab } = mstrTable;
     const { validColumnsY, validRowsX } = await officeApiCrosstabHelper.getCrosstabHeadersSafely(
       prevCrosstabDimensions,
       prevOfficeTable,
       excelContext,
     );

     if (isCrosstab && crosstabHeaderDimensions && prevCrosstabDimensions) {
       if (validRowsX !== crosstabHeaderDimensions.rowsX
      || validColumnsY !== crosstabHeaderDimensions.columnsY) {
         tableColumnsChanged = true;
         prevCrosstabDimensions.rowsX = validRowsX;
         prevCrosstabDimensions.columnsY = validColumnsY;
       }
       if (tableColumnsChanged) {
         startCell = officeApiHelper.offsetCellBy(
           startCell,
           -prevCrosstabDimensions.columnsY,
           -prevCrosstabDimensions.rowsX
         );
       }
     }

     if (prevCrosstabDimensions) {
       officeApiCrosstabHelper.clearCrosstabRange(prevOfficeTable, mstrTable, excelContext);
     }

     await excelContext.sync();
     return { tableColumnsChanged, startCell };
   }
}
const officeTableRefresh = new OfficeTableRefresh();
export default officeTableRefresh;
