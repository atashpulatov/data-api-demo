import { CONTEXT_LIMIT } from '../mstr-object/mstr-object-rest-service';
import { errorService } from '../error/error-handler';

class OfficeFormattingHelper {
  /**
   * Applies Excel number formatting to imported object based on MSTR data type.
   *
   * @param {Office} officeTable
   * @param {Object} instanceDefinition
   * @param {Boolean} isCrosstab
   * @param {Office} excelContext
   * @memberof OfficeFormattingHelper
   */
  applyFormatting = async (officeTable, instanceDefinition, isCrosstab, excelContext) => {
    try {
      console.time('Apply formatting');
      const { columnInformation } = instanceDefinition.mstrTable;
      const filteredColumnInformation = this.filterColumnInformation(columnInformation, isCrosstab);
      const offset = columnInformation.length - filteredColumnInformation.length;
      for (const object of filteredColumnInformation) {
        const columnRange = officeTable.columns.getItemAt(object.index - offset).getDataBodyRange();
        if (!object.isAttribute) {
          columnRange.numberFormat = this.getFormat(object);
        } else {
          columnRange.numberFormat = '';
        }
      }
      await excelContext.sync();
    } catch (error) {
      console.log('Cannot apply formatting, skipping');
      throw errorService.handleError(error);
    } finally {
      console.timeEnd('Apply formatting');
    }
  };

  /**
   * Return filtered column information
   *
   * @param columnInformation
   * @param isCrosstab
   * @memberof OfficeFormattingHelper
   * @return {Array} filteredColumnInformation
   */
  filterColumnInformation = (columnInformation, isCrosstab) => {
    if (isCrosstab) {
      return columnInformation.filter((e) => (e.isAttribute === false) && (Object.keys(e).length !== 0));
    }
    return columnInformation.filter((column) => Object.keys(column).length !== 0);
  };

  /**
   * Return parsed format string
   *
   * @param {String} format given by MicroStrategy
   * @memberof OfficeFormattingHelper
   * @return {String} parsed format
   */
  getFormat = ({ formatString, category }) => {
    if (category === 9) return 'General';
    // For fractions set General format
    if (formatString.match(/# \?+?\/\?+?/)) return 'General';
    if (formatString.indexOf('$') !== -1) {
      return formatString.replace(/\[\$-/g, '[$$$$-')
        .replace(/\$/g, '\\$')
        .replace(/\\\$\\\$/g, '$')
        .replace(/"/g, '');
    }
    return formatString;
  };

  /**
   * Applies Excel number formatting to imported object based on MSTR data type.
   *
   * @param {Boolean} isCrosstab
   * @param {Array} subtotalsAddresses Array containing object with cell coordinates
   * @param {Office} officeTable
   * @param {Office} excelContext ExcelContext
   * @param {Object} mstrTable contains informations about mstr object
   * @param {Boolean} [shouldbold=true] Specify whether the values in cells should be bold
   * @memberof OfficeFormattingHelper
   */
  applySubtotalFormatting = async (isCrosstab, subtotalsAddresses, officeTable, excelContext, mstrTable, shouldbold = true) => {
    console.time('Subtotal Formatting');
    if (isCrosstab) {
      subtotalsAddresses = new Set(subtotalsAddresses);
    }
    const reportStartCell = officeTable.getRange().getCell(0, 0);
    excelContext.trackedObjects.add(reportStartCell);
    await this.formatSubtotals(reportStartCell, subtotalsAddresses, mstrTable, excelContext, shouldbold);
    excelContext.trackedObjects.remove(reportStartCell);
    console.timeEnd('Subtotal Formatting');
  };

  /**
   * Gets range of subtotal row or cell based on subtotal cell
   *
   * @param {Office} startCell Starting table body cell
   * @param {Office} cell Starting subtotal row cell
   * @param {Object} mstrTable contains informations about mstr object
   * @memberof OfficeFormattingHelper
   * @return {Office} Range of subtotal row
   */
  getSubtotalRange = (startCell, cell, mstrTable) => {
    const { headers, isCrosstab } = mstrTable;
    const { axis } = cell;
    let offsets = {};

    if (!isCrosstab) {
      offsets = {
        verticalFirstCell: cell.rowIndex + 1,
        horizontalFirstCell: cell.attributeIndex,
        verticalLastCell: cell.rowIndex + 1,
        horizontalLastCell: mstrTable.tableSize.columns - 1,
      };
    } else if (axis === 'rows') {
      offsets = {
        verticalFirstCell: cell.colIndex,
        horizontalFirstCell: -(headers.rows[0].length - cell.attributeIndex),
        verticalLastCell: cell.colIndex,
        horizontalLastCell: headers.columns[0].length - 1,
      };
    } else if (axis === 'columns') {
      offsets = {
        verticalFirstCell: -((headers.columns.length - cell.attributeIndex) + 1),
        horizontalFirstCell: cell.colIndex,
        verticalLastCell: mstrTable.tableSize.rows,
        horizontalLastCell: cell.colIndex,
      };
    }
    const firstSubtotalCell = startCell.getOffsetRange(offsets.verticalFirstCell, offsets.horizontalFirstCell);
    const lastSubtotalCell = startCell.getOffsetRange(offsets.verticalLastCell, offsets.horizontalLastCell);
    return firstSubtotalCell.getBoundingRect(lastSubtotalCell);
  };

  /**
   * Sets bold format for all subtotal rows
   *
   * @param {Office} startCell Starting table body cell
   * @param {Array} subtotalCells 2d array of all starting subtotal row cells
   * (each element contains row and column number of subtotal cell in headers columns)
   * @param {Object} mstrTable instance definition
   * @param {Office} context Excel context
   * @param {Boolean} shouldBold
   * @memberof OfficeApiHelper
   */
  formatSubtotals = async (startCell, subtotalCells, mstrTable, context, shouldBold) => {
    let contextPromises = [];
    for (const cell of subtotalCells) {
      const subtotalRowRange = this.getSubtotalRange(startCell, cell, mstrTable);
      if (subtotalRowRange) subtotalRowRange.format.font.bold = shouldBold;
      contextPromises.push(context.sync());
      if (contextPromises.length % CONTEXT_LIMIT === 0) {
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(contextPromises);
        contextPromises = [];
      }
    }
  };


  /**
   * Formatting table columns width
   *
   * @param {Office} table
   * @param {Boolean} isCrosstab
   * @param {Office} crosstabHeaderDimensions
   * @param {Office} context
   * @memberof officeFormattingHelper
   */
  formatTable = async (table, isCrosstab, crosstabHeaderDimensions, context) => {
    console.time('Column auto size');
    if (isCrosstab) {
      const { rowsX } = crosstabHeaderDimensions;
      table.getDataBodyRange().getColumnsBefore(rowsX).format.autofitColumns();
    }

    try {
      const { columns } = table;
      columns.load('count');
      await context.sync();
      for (let index = 0; index < columns.count; index++) {
        columns.getItemAt(index).getRange().format.autofitColumns();
        // eslint-disable-next-line no-await-in-loop
        await context.sync();
      }
      if (isCrosstab) table.showHeaders = false;
      await context.sync();
    } catch (error) {
      console.log('Error when formatting - no columns autofit applied', error);
    }
    console.timeEnd('Column auto size');
  };
}
export const officeFormattingHelper = new OfficeFormattingHelper();
export default officeFormattingHelper;