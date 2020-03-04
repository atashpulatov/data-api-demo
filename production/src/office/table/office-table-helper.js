import { TABLE_OVERLAP } from '../../error/constants';
import { OverlappingTablesError } from '../../error/overlapping-tables-error';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';


class OfficeTableHelper {
  /**
   * Checks if the range is empty
   *
   * @param {Object} excelContext excelContext
   * @param {Object} excelRange range in which table will be inserted
   *
   */
  checkRangeValidity = async (excelContext, excelRange) => {
    // Pass true so only cells with values count as used
    const usedDataRange = excelRange.getUsedRangeOrNullObject(true);
    await excelContext.sync();
    if (!usedDataRange.isNullObject) {
      throw new OverlappingTablesError(TABLE_OVERLAP);
    }
  };

  /**
   * Create column and title headers for crosstab
   *
   * @param {string} tableStartCell  Top left corner cell of the table
   * @param {Object} mstrTable  contains informations about mstr object
   * @param {Object} sheet  excel worksheet
   * @param {Object} range range of the table
   * @param {Object} crosstabHeaderDimensions contains dimension of crosstab headers (columnsY, cloumnsX, RowsY, RowsX)
   *
   */
   createCrosstabHeaders = (tableStartCell, mstrTable, sheet, crosstabHeaderDimensions) => {
     const { attributesNames, headers:{ columns } } = mstrTable;
     officeApiCrosstabHelper.createColumnsHeaders(tableStartCell, columns, sheet);
     officeApiCrosstabHelper.createRowsTitleHeaders(tableStartCell, attributesNames, sheet, crosstabHeaderDimensions);
   }

   /**
   * Checks if the range for the table after refresh is cleared.
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} context excelContext
   * @param {Object} range range of the resized table
   * @param {Object} instanceDefinition
   *
   */
   async checkObjectRangeValidity(prevOfficeTable, context, range, instanceDefinition) {
     if (prevOfficeTable) {
       await this.checkObjectRangeValidityOnRefresh(prevOfficeTable, context, instanceDefinition);
     } else {
       await this.checkRangeValidity(context, range);
     }
   }

   /**
   * checks if range is valid on refresh
   *
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} excelContext excelContext
   * @param {Object} instanceDefinition
   */
   async checkObjectRangeValidityOnRefresh(prevOfficeTable, excelContext, instanceDefinition) {
     const { rows, columns, mstrTable } = instanceDefinition;

     prevOfficeTable.rows.load('count');
     await excelContext.sync();

     let addedColumns = Math.max(0, columns - prevOfficeTable.columns.count);
     let addedRows = Math.max(0, rows - prevOfficeTable.rows.count);

     ({ addedRows, addedColumns } = this.checkCrosstabAddedRowsAndColumns(mstrTable, addedRows, addedColumns));

     await this.checkExtendedRange(addedColumns, prevOfficeTable, mstrTable, excelContext, addedRows);
     excelContext.runtime.enableEvents = false;
     await excelContext.sync();
     prevOfficeTable.delete();
     excelContext.runtime.enableEvents = true;
     await excelContext.sync();
   }

  /**
   * checks the added rows and columns for crosstab.
   *
   * @param {Object} mstrTable contains informations about mstr object
   * @param {number} addedColumns excelContext
   * @param {number} addedRows shows the number of added rows to the table
   *
   */
  checkCrosstabAddedRowsAndColumns = (mstrTable, addedRows, addedColumns) => {
    const { isCrosstab, crosstabHeaderDimensions, prevCrosstabDimensions } = mstrTable;
    const { columnsY: prevColumnsY, rowsX: prevRowsX } = prevCrosstabDimensions;
    const { columnsY: crosstabColumnsY, rowsX: crosstabRowsX } = crosstabHeaderDimensions;

    if (isCrosstab) {
      if (!prevCrosstabDimensions) {
        addedRows += crosstabColumnsY;
        addedColumns += crosstabRowsX;
      } else if (prevColumnsY === crosstabColumnsY && prevRowsX === crosstabRowsX) {
        addedRows += (crosstabColumnsY - prevColumnsY);
        addedColumns += (crosstabRowsX - prevRowsX);
      }
    }
    return { addedRows, addedColumns };
  }

  /**
   * checks if range is valid on refresh for added columns and rows
   *
   * @param {Number} addedColumns shows the number of added columns to the table
   * @param {Object} prevOfficeTable previous office table
   * @param {Object} mstrTable contains informations about mstr object
   * @param {Object} context excelContext
   * @param {number} addedRows shows the number of added rows to the table
   *
   */
  async checkExtendedRange(addedColumns, prevOfficeTable, mstrTable, context, addedRows) {
    const { isCrosstab, prevCrosstabDimensions } = mstrTable;

    if (addedColumns) {
      let rightRange = prevOfficeTable
        .getRange()
        .getColumnsAfter(addedColumns);

      if (isCrosstab) {
        rightRange = rightRange
          .getOffsetRange(-prevCrosstabDimensions.columnsY, 0)
          .getResizedRange(prevCrosstabDimensions.columnsY, 0);
      }

      await this.checkRangeValidity(context, rightRange);
    }
    if (addedRows) {
      let bottomRange = prevOfficeTable
        .getRange()
        .getRowsBelow(addedRows)
        .getResizedRange(0, addedColumns);

      if (isCrosstab) {
        bottomRange = bottomRange
          .getOffsetRange(0, -prevCrosstabDimensions.rowsX)
          .getResizedRange(0, prevCrosstabDimensions.rowsX);
      }

      await this.checkRangeValidity(context, bottomRange);
    }
  }

  /**
   * Gets dimensions od the headers of crosstab report
   *
   * @param {Object} instanceDefinition
   *
   */
  getCrosstabHeaderDimensions = (instanceDefinition) => {
    const { mstrTable } = instanceDefinition;
    const { isCrosstab, headers } = mstrTable;
    return {
      columnsY: isCrosstab ? headers.columns.length : 0,
      columnsX: isCrosstab ? headers.columns[0].length : 0,
      // if there is no attributes in rows we need to setup 1 for offset for column attributes names
      rowsX: isCrosstab ? (headers.rows[0].length || 1) : 0,
      rowsY: isCrosstab ? instanceDefinition.rows : 0,
    };
  }
}
const officeTableHelper = new OfficeTableHelper();
export default officeTableHelper;
