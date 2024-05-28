import formattingHelper from './formatting-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';

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
  applyFormatting = async (objectData: ObjectData, operationData: OperationData): Promise<void> => {
    console.group('Apply formatting');
    console.time('Total');

    const { objectWorkingId, officeTable, instanceDefinition, excelContext } = operationData;

    const { columns, rows } = instanceDefinition;
    const { columnInformation, isCrosstab, metricsInRows } = instanceDefinition.mstrTable;

    try {
      const offset = objectData?.crosstabHeaderDimensions?.rowsX || 0;

      await excelContext.sync();
      await this.setupFormatting(
        columnInformation,
        isCrosstab,
        offset,
        officeTable,
        excelContext,
        objectData,
        rows,
        columns,
        metricsInRows
      );

      await excelContext.sync();
    } catch (error) {
      console.error(error);
      console.warn('Cannot apply formatting, skipping');
    } finally {
      operationStepDispatcher.completeFormatData(objectWorkingId);

      console.timeEnd('Total');
      console.groupEnd();
    }
  };

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
    objectData: ObjectData,
    rows: number,
    columns?: number,
    metricsInRows?: boolean
  ): Promise<void> {
    for (let index = 0; index < filteredColumnInformation.length; index++) {
      const object = filteredColumnInformation[index];
      if (object) {
        const { importAttributesAsText } = objectData.objectSettings || {};
        const columnRange = formattingHelper.getColumnRangeForFormatting(
          index,
          isCrosstab,
          offset,
          officeTable,
          rows,
          columns,
          metricsInRows
        );
        if (object.isAttribute) {
          columnRange.numberFormat = (importAttributesAsText ? '@' : '') as any;
        } else {
          columnRange.numberFormat = this.getFormat(object) as any;
        }

        if (index % 5000 === 0) {
          await excelContext.sync();
        }
      }
    }
  }

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
