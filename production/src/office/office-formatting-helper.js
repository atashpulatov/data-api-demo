import { CONTEXT_LIMIT } from '../mstr-object/mstr-object-rest-service';
import { errorService } from '../error/error-handler';

class OfficeFormattingHelper {
  /**
   * Applies Excel number formatting to imported object based on MSTR data type.
   *
   * @param {Office} OfficeTable
   * @param {Object} instanceDefinition
   * @param {Boolean} isCrosstab
   * @param {Office} excelContext
   * @memberof OfficeFormattingHelper
   */
  applyFormatting = async (officeTable, instanceDefinition, isCrosstab, excelContext) => {
    try {
      console.time('Apply formatting');
      const { columnInformation } = instanceDefinition.mstrTable;
      let filteredColumnInformation;
      const { columns } = officeTable;
      if (isCrosstab) {
        // we store attribute informations in column information in crosstab attributes are in headers not excel table so we dont need them here.
        filteredColumnInformation = columnInformation.filter((e) => e.isAttribute === false);
      } else {
        filteredColumnInformation = columnInformation;
      }
      const offset = columnInformation.length - filteredColumnInformation.length;
      for (const object of filteredColumnInformation) {
        if (Object.keys(object).length) { // Skips iteration if object is empty
          const columnRange = columns.getItemAt(object.index - offset).getDataBodyRange();
          let format = '';
          if (!object.isAttribute) {
            if (object.category === 9) {
              format = this.getNumberFormattingCategoryName(object);
            } else {
              format = object.formatString;
              if (format.indexOf('$') !== -1) {
                // Normalizing formatString from MicroStrategy when locale codes are used [$-\d+]
                format = format.replace(/\[\$-/g, '[$$$$-').replace(/\$/g, '\\$').replace(/\\\$\\\$/g, '$').replace(/"/g, '');
              }
              // for fractions set General format
              if (object.formatString.match(/# \?+?\/\?+?/)) format = 'General';
            }
          }
          columnRange.numberFormat = format;
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
   * Applies Excel number formatting to imported Falsy Crosstab object based on MSTR data type.
   *
   * @param {Office} officeTable
   * @param {Object} instanceDefinition
   * @param {Office} excelContext
   * @param {Object} responseBody
   * @memberof OfficeFormattingHelper
   */
  applyFalsyCrosstabFormatting = async (officeTable, instanceDefinition, excelContex, responseBody) => {
    try {
      console.time('Apply formatting');
      const { columnInformation } = instanceDefinition.mstrTable;
      let filteredColumnInformation;
      const { columns } = officeTable;

      console.log('Response Body', responseBody);
    } catch (error) {
      console.log('Cannot apply formatting, skipping');
      throw errorService.handleError(error);
    } finally {
      console.timeEnd('Apply formatting');
    }
  };

  /**
   * Return Excel number formatting based on MSTR data type
   *
   * @param {Object} metric Object containing information about data type of metric
   * @memberof OfficeFormattingHelper
   */
  getNumberFormattingCategoryName = (metric) => {
    switch (metric.category) {
    case -2:
      return 'Default';
    case 9:
      return 'General';
    case 0:
      return 'Fixed';
    case 1:
      return 'Currency';
    case 2:
      return 'Date';
    case 3:
      return 'Time';
    case 4:
      return 'Percentage';
    case 5:
      return 'Fraction';
    case 6:
      return 'Scientific';
    case 7: // 'Custom'
      return metric.formatString;
    case 8:
      return 'Special';
    default:
      return 'General';
    }
  }

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
    if (isCrosstab) { subtotalsAddresses = new Set(subtotalsAddresses); }
    const reportstartCell = officeTable.getRange().getCell(0, 0);
    excelContext.trackedObjects.add(reportstartCell);
    await this.formatSubtotals(reportstartCell, subtotalsAddresses, mstrTable, excelContext, shouldbold);
    excelContext.trackedObjects.remove(reportstartCell);
    console.timeEnd('Subtotal Formatting');
  }

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
    const { headers } = mstrTable;
    const { axis } = cell;
    let offsets = {};

    if (axis === 'rows') {
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
    } else { // if not a crosstab
      offsets = {
        verticalFirstCell: cell.rowIndex + 1,
        horizontalFirstCell: cell.attributeIndex,
        verticalLastCell: cell.rowIndex + 1,
        horizontalLastCell: mstrTable.tableSize.columns - 1,
      };
    }
    const firstSubtotalCell = startCell.getOffsetRange(offsets.verticalFirstCell, offsets.horizontalFirstCell);
    const lastSubtotalCell = startCell.getOffsetRange(offsets.verticalLastCell, offsets.horizontalLastCell);
    return firstSubtotalCell.getBoundingRect(lastSubtotalCell);
  }

  /**
   *Sets bold format for all subtotal rows
   *
   * @param {Office} startCell Starting table body cell
   * @param {Office} subtotalCells 2d array of all starting subtotal row cells (each element contains row and colum number of subtotal cell in headers columns)
   * @param {Object} mstrTable mstrTable object instance definition
   * @param {Office} context Excel context
   * @memberof OfficeApiHelper
   * @return {Promise} Context.sync
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
  }

  formatTable = async (table, isCrosstab, crosstabHeaderDimensions, context) => {
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
    } catch (error) {
      console.log('Error when formatting - no columns autofit applied', error);
    }
  }
}
export const officeFormattingHelper = new OfficeFormattingHelper();
export default officeFormattingHelper;
