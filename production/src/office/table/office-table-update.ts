import { CONTEXT_LIMIT } from '../../mstr-object/mstr-object-rest-service';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeRemoveHelper } from '../remove/office-remove-helper';
import officeTableHelperRange from './office-table-helper-range';

import { InstanceDefinition } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import officeApiDataLoader from '../api/office-api-data-loader';
import officeFormatSubtotals from '../format/office-format-subtotals';
import { FORMATTED_TABLE_CROSSTAB_EXTRA_ROWS } from './office-table-create';
import { ObjectImportType } from '../../mstr-object/constants';

class OfficeTableUpdate {
  /**
   * Updates office table if the number of columns or rows of an existing table changes.
   *
   * @param instanceDefinition
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param prevOfficeTable Previous office table to refresh
   *
   */
  async updateOfficeTable(
    instanceDefinition: any,
    excelContext: Excel.RequestContext,
    prevOfficeTable: Excel.Table,
    objectData: ObjectData
  ): Promise<any> {
    console.time('Validate existing table');

    const {
      rows,
      mstrTable,
      mstrTable: {
        isCrosstab,
        subtotalsInfo: { subtotalsAddresses },
      },
    } = instanceDefinition;

    try {
      await this.handleSubtotalsFormatting(
        excelContext,
        prevOfficeTable,
        mstrTable,
        subtotalsAddresses
      );

      await this.validateAddedRowsRange(excelContext, rows, prevOfficeTable);

      if (isCrosstab) {
        this.createHeadersForCrosstab(prevOfficeTable, instanceDefinition, objectData);
      } else {
        this.setHeaderValuesNoCrosstab(excelContext, prevOfficeTable, mstrTable.headers.columns);
      }

      await excelContext.sync();


      // Add extra rows to crosstab table to be able to track users manipulations, otherwise formatted data(table) range 
      // will entirely overlap and ultmately remove the underneath crosstab table
      let rowsToPreserveCount: number = rows;
      if (objectData.importType === ObjectImportType.FORMATTED_DATA && isCrosstab) {
        rowsToPreserveCount += FORMATTED_TABLE_CROSSTAB_EXTRA_ROWS;
      }

      await officeRemoveHelper.deleteRowsInChunks(
        excelContext,
        prevOfficeTable,
        CONTEXT_LIMIT,
        rowsToPreserveCount
      );

      return prevOfficeTable;
    } catch (error) {
      await excelContext.sync();
      throw error;
    } finally {
      console.timeEnd('Validate existing table');
    }
  }

  async handleSubtotalsFormatting(
    excelContext: Excel.RequestContext,
    prevOfficeTable: Excel.Table,
    mstrTable: any,
    subtotalsAddresses: string[]
  ): Promise<void> {
    if (subtotalsAddresses && subtotalsAddresses.length) {
      await officeFormatSubtotals.applySubtotalFormatting(
        prevOfficeTable,
        excelContext,
        mstrTable,
        false
      );
    }
  }

  async validateAddedRowsRange(
    excelContext: Excel.RequestContext,
    newRowsCount: number,
    prevOfficeTable: Excel.Table
  ): Promise<void> {
    const addedRowsCount = await this.getAddedRowsCount(
      excelContext,
      newRowsCount,
      prevOfficeTable.rows
    );

    // If the new table has more rows during update check validity
    if (addedRowsCount) {
      const bottomRange = prevOfficeTable.getRange().getRowsBelow(addedRowsCount);
      await officeTableHelperRange.checkRangeValidity(excelContext, bottomRange);
    }
  }

  async getAddedRowsCount(
    excelContext: Excel.RequestContext,
    newRowsCount: number,
    prevOfficeTableRows: Excel.TableRowCollection
  ): Promise<number> {
    const prevRowsCount = await officeApiDataLoader.loadSingleExcelData(
      excelContext,
      prevOfficeTableRows,
      'count'
    );

    return Math.max(0, newRowsCount - prevRowsCount);
  }

  createHeadersForCrosstab(
    prevOfficeTable: Excel.Table,
    instanceDefinition: InstanceDefinition,
    objectData: ObjectData
  ): void {
    const crosstabHeaderDimensions =
      officeApiCrosstabHelper.getCrosstabHeaderDimensions(instanceDefinition);

    const { mstrTable } = instanceDefinition;
    officeApiCrosstabHelper.createCrosstabHeaders(
      prevOfficeTable,
      mstrTable,
      crosstabHeaderDimensions,
      objectData
    );
  }

  setHeaderValuesNoCrosstab(
    excelContext: Excel.RequestContext,
    prevOfficeTable: Excel.Table,
    headerColumns: string[][]
  ): void {
    excelContext.workbook.application.suspendApiCalculationUntilNextSync();

    prevOfficeTable.getHeaderRowRange().values = [headerColumns[headerColumns.length - 1]];
  }
}

const officeTableUpdate = new OfficeTableUpdate();
export default officeTableUpdate;
