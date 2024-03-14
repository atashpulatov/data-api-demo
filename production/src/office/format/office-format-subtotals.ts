import { CONTEXT_LIMIT } from '../../mstr-object/mstr-object-rest-service';

class OfficeFormatSubtotals {
  /**
   * Applies Excel number formatting to imported object based on MSTR data type.
   *
   * @param officeTable
   * @param excelContext Reference to Excel Context used by Excel API functions ExcelContext
   * @param mstrTable contains information about mstr object
   * @param shouldBold Specify if the function should add or remove bold formatting
   */
  async applySubtotalFormatting(
    officeTable: Excel.Table,
    excelContext: Excel.RequestContext,
    mstrTable: any,
    shouldBold = true
  ): Promise<void> {
    console.time('Subtotal Formatting');
    try {
      const { isCrosstab } = mstrTable;
      let {
        subtotalsInfo: { subtotalsAddresses },
      } = mstrTable;
      let reportStartCell;
      if (isCrosstab) {
        subtotalsAddresses = new Set(subtotalsAddresses);
        reportStartCell = officeTable.getDataBodyRange().getCell(0, 0);
      } else {
        reportStartCell = officeTable.getRange().getCell(0, 0);
      }

      excelContext.trackedObjects.add(reportStartCell);
      await this.formatSubtotals(
        reportStartCell,
        subtotalsAddresses,
        mstrTable,
        excelContext,
        shouldBold
      );
      excelContext.trackedObjects.remove(reportStartCell);
    } catch (error) {
      console.error(error);
      console.log('Cannot apply subtotal formatting, skipping');
    }
    console.timeEnd('Subtotal Formatting');
  }

  /**
   * Gets range of subtotal row or cell based on subtotal cell
   *
   * @param startCell Starting table body cell
   * @param cell Starting subtotal row cell
   * @param mstrTable contains informations about mstr object
   * @return Range of subtotal row
   */
  getSubtotalRange(startCell: Excel.Range, cell: any, mstrTable: any): Excel.Range {
    const { headers, isCrosstab } = mstrTable;
    const { axis } = cell;
    let offsets: any = {};

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
        verticalFirstCell: -(headers.columns.length - cell.attributeIndex + 1),
        horizontalFirstCell: cell.colIndex,
        verticalLastCell: mstrTable.tableSize.rows,
        horizontalLastCell: cell.colIndex,
      };
    }
    const firstSubtotalCell = startCell.getOffsetRange(
      offsets.verticalFirstCell,
      offsets.horizontalFirstCell
    );
    const lastSubtotalCell = startCell.getOffsetRange(
      offsets.verticalLastCell,
      offsets.horizontalLastCell
    );
    return firstSubtotalCell.getBoundingRect(lastSubtotalCell);
  }

  /**
   * Sets bold format for all subtotal rows
   *
   * @param startCell Starting table body cell
   * @param subtotalCells 2d array of all starting subtotal row cells
   * (each element contains row and column number of subtotal cell in headers columns)
   * @param mstrTable instance definition
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param shouldBold Specify if the function should add or remove bold formatting
   */
  async formatSubtotals(
    startCell: Excel.Range,
    subtotalCells: any[][],
    mstrTable: any,
    excelContext: Excel.RequestContext,
    shouldBold: boolean
  ): Promise<void> {
    let contextPromises = [];
    for (const cell of subtotalCells) {
      const subtotalRowRange = this.getSubtotalRange(startCell, cell, mstrTable);
      if (subtotalRowRange) {
        subtotalRowRange.format.font.bold = shouldBold;
      }
      contextPromises.push(excelContext.sync());
      if (contextPromises.length % CONTEXT_LIMIT === 0) {
        await Promise.all(contextPromises);
        contextPromises = [];
      }
    }
  }
}
const officeFormatSubtotals = new OfficeFormatSubtotals();
export default officeFormatSubtotals;
