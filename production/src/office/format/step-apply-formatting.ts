import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeFormatHyperlinks from './office-format-hyperlinks';

class StepApplyFormatting {
  /**
   * Applies Excel number formatting to imported object based on MSTR data type.
   *
   * Formatting is applied only to office table columns containing metrics.
   * Columns are formatted one by one, but synchronized to Excel all at the same time.
   * In case of error this step is skipped and import/refresh workflow continues.
   *
   * This function is subscribed as one of the operation steps with the key FORMAT_DATA,
   * therefore should be called only via operation bus.
   *
   * @param operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param operationData.officeTable Reference to Table created by Excel
   * @param operationData.instanceDefinition Object containing information about MSTR object
   * @param operationData.excelContext Reference to Excel Context used by Excel API functions
   */
  applyFormatting = async (
    _objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> => {
    console.group('Apply formatting');
    console.time('Total');

    const { objectWorkingId, officeTable, instanceDefinition, excelContext } = operationData;

    const { columns } = instanceDefinition;
    const { columnInformation, isCrosstab, metricsInRows } = instanceDefinition.mstrTable;

    try {
      const filteredColumnInformation = this.filterColumnInformation(columnInformation);
      const offset = this.calculateMetricColumnOffset(filteredColumnInformation, isCrosstab);

      await excelContext.sync();
      await this.setupFormatting(
        filteredColumnInformation,
        isCrosstab,
        offset,
        officeTable,
        excelContext,
        columns,
        metricsInRows
      );

      await excelContext.sync();
    } catch (error) {
      console.error(error);
      console.log('Cannot apply formatting, skipping');
    } finally {
      operationStepDispatcher.completeFormatData(objectWorkingId);

      console.timeEnd('Total');
      console.groupEnd();
    }
  };

  /**
   * Returns the position of the table for crosstabs (equals to index of first metric)
   * For tabular reports there is no offset.
   *
   * @param columnInformation Columns data
   * @param isCrosstab Specify if object is a crosstab
   * @returns Offset required
   */
  calculateMetricColumnOffset(columnInformation: any[], isCrosstab: boolean): number {
    if (isCrosstab) {
      return Math.max(
        columnInformation.findIndex(col => !col.isAttribute),
        0
      );
    }
    return 0;
  }

  /**
   * Setups formatting.
   *
   * @param filteredColumnInformation
   * @param isCrosstab Specify if object is a crosstab
   * @param offset Number of columns to be offsetted when formatting
   * @param officeTable Reference to Excel table
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param columns Number of columns in the table
   * @param metricsInRows Specify if metrics are present in rows
   */
  async setupFormatting(
    filteredColumnInformation: any[],
    isCrosstab: boolean,
    offset: number,
    officeTable: Excel.Table,
    excelContext: Excel.RequestContext,
    columns?: number,
    metricsInRows?: boolean
  ): Promise<void> {
    for (let index = 0; index < filteredColumnInformation.length; index++) {
      const object = filteredColumnInformation[index];
      const columnRange = this.getColumnRangeForFormatting(
        index,
        isCrosstab,
        offset,
        officeTable,
        columns,
        metricsInRows
      );
      if (object.isAttribute) {
        await officeFormatHyperlinks.formatColumnAsHyperlinks(object, columnRange, excelContext);
      } else {
        columnRange.numberFormat = this.getFormat(object) as unknown as any[][];
      }

      if (index % 5000 === 0) {
        await excelContext.sync();
      }
    }
  }

  /**
   * Gets columns range to apply formatting to.
   *
   * Offset is added to index for tables, for crosstabs index is subtracted by offset.
   *
   * @param index Index of a column.
   * @param isCrosstab Specify if object is a crosstab
   * @param offset Number of columns to be offsetted when formatting
   * @param officeTable Reference to Excel table
   * @param columns Number of columns in the table
   * @param metricsInRows Specify if metrics are present in rows
   * @returns Columns range to apply formatting to
   */
  getColumnRangeForFormatting(
    index: number,
    isCrosstab: boolean,
    offset: number,
    officeTable: Excel.Table,
    columns?: number,
    metricsInRows?: boolean
  ): Excel.Range {
    const objectIndex = isCrosstab ? index - offset : index + offset;
    // Crosstab
    if (isCrosstab && index < offset) {
      // @ts-expect-error
      return officeTable.columns.getItemAt().getDataBodyRange().getOffsetRange(0, objectIndex);
    }

    // Metrics in rows
    if (metricsInRows) {
      if (isCrosstab) {
        return officeTable.rows.getItemAt(objectIndex).getRange();
      }

      return officeTable.rows
        .getItemAt(objectIndex)
        .getRange()
        .getOffsetRange(0, columns - 1);
    }

    // Tabular
    return officeTable.columns.getItemAt(objectIndex).getDataBodyRange();
  }

  /**
   * Returns filtered column information to ignore consolidations
   *
   * @param columnInformation Columns data
   * @return filteredColumnInformation Filtered columnInformation
   */
  filterColumnInformation = (columnInformation: any[]): any[] =>
    columnInformation.filter(col => Object.keys(col).length !== 0);

  /**
   * Returns Excel format string based on MicroStrategy format string.
   *
   * @param {String} Format given by MicroStrategy
   * @return {String} Excel format
   */
  getFormat({ formatString, category }: { formatString: string; category: number }): string {
    if (!formatString && !category) {
      return 'General';
    }

    if (category === 9) {
      return 'General';
    }

    // For fractions set General format
    if (formatString && formatString.match(/# \?+?\/\?+?/)) {
      return 'General';
    }

    // Normalizing formatString from MicroStrategy when locale codes are used [$-\d+]
    if (formatString && formatString.indexOf('$') !== -1) {
      return formatString
        .replace(/\[\$-/g, '[$$$$-')
        .replace(/\$/g, '\\$')
        .replace(/\\\$\\\$/g, '$')
        .replace(/"/g, '');
    }

    return formatString;
  }
}

const stepApplyFormatting = new StepApplyFormatting();
export default stepApplyFormatting;
