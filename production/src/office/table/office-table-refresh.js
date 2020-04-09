import { officeApiHelper } from '../api/office-api-helper';
import officeTableCreate from './office-table-create';
import officeTableUpdate from './office-table-update';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';


class OfficeTableRefresh {
  /**
   * Creates an office table if the number of columns of an existing table changes.
   * If the new definiton range is not empty we keep the original table.
   *
   * @param {Object} excelContext
   * @param {String} bindingId
   * @param {Object} instanceDefinition
   * @param {Object} startCell  Top left corner cell
   * @param {Object} OfficeTable
   * @param {String} newOfficeTableName new name for office table
   * @param {Boolean} shouldFormat
   *
   */
  async changeOfficeTableOnRefresh(
    {
      excelContext,
      bindingId,
      instanceDefinition,
      startCell,
      officeTable,
      newOfficeTableName,
      shouldFormat,
      previousTableDimensions,
      visualizationInfo
    }
  ) {
    const { mstrTable, mstrTable:{ isCrosstab, prevCrosstabDimensions } } = instanceDefinition;
    const prevOfficeTable = await officeApiHelper.getTable(excelContext, bindingId);

    if (isCrosstab && !mstrTable.toCrosstabChange) {
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
    prevOfficeTable.showHeaders = true;
    prevOfficeTable.load('name');
    await excelContext.sync();

    let tableColumnsChanged = await this.checkColumnsChange(
      prevOfficeTable,
      excelContext,
      instanceDefinition,
      previousTableDimensions
    );
    startCell = await this.getStartCellOnRefresh(prevOfficeTable, excelContext);

    ({ tableColumnsChanged, startCell } = await this.clearIfCrosstabHeadersChanged(
      prevOfficeTable,
      excelContext,
      tableColumnsChanged,
      startCell,
      mstrTable
    ));

    let newBindingId = bindingId;
    if (tableColumnsChanged) {
      console.log('Instance definition changed, creating new table');

      newOfficeTableName = prevOfficeTable.name;
      ({ officeTable, newBindingId } = await officeTableCreate.createOfficeTable(
        {
          instanceDefinition,
          excelContext,
          startCell,
          newOfficeTableName,
          prevOfficeTable,
          tableColumnsChanged,
        }
      ));
    } else {
      shouldFormat = visualizationInfo.formatShouldUpdate || false;
      console.time('Validate existing table');
      officeTable = await officeTableUpdate.updateOfficeTable(
        instanceDefinition,
        excelContext,
        startCell,
        prevOfficeTable,
        tableColumnsChanged
      );
      console.timeEnd('Validate existing table');
    }
    return {
      tableColumnsChanged, startCell, officeTable, shouldFormat, newBindingId
    };
  }

  /**
   * Compares if the number of columns in table has changed.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} excelContext excelContext
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
   * @param {Boolean} tableColumnsChanged Specify if table columns has been changed
   * @param {string} startCell  Starting cell of Table
   * @param {Object} mstrTable  contains informations about mstr object
   *
   */
   clearIfCrosstabHeadersChanged = async (prevOfficeTable, excelContext, tableColumnsChanged, startCell, mstrTable) => {
     const { prevCrosstabDimensions, crosstabHeaderDimensions, isCrosstab } = mstrTable;
     const { validColumnsY, validRowsX } = await officeApiCrosstabHelper.getCrosstabHeadersSafely(
       prevOfficeTable,
       prevCrosstabDimensions.columnsY,
       excelContext,
       prevCrosstabDimensions.rowsX
     );

     if (isCrosstab && crosstabHeaderDimensions && prevCrosstabDimensions) {
       if (validRowsX !== crosstabHeaderDimensions.rowsX
      || validColumnsY !== crosstabHeaderDimensions.columnsY) {
         tableColumnsChanged = true;
         prevCrosstabDimensions.rowsX = validRowsX;
         prevCrosstabDimensions.columnsY = validColumnsY;
       } if (tableColumnsChanged) {
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
