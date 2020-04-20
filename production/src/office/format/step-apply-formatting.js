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
   * @param {Number} operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Office} operationData.officeTable Reference to Table created by Excel
   * @param {Object} operationData.instanceDefinition Object containing information about MSTR object
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   */
  applyFormatting = async (objectData, operationData) => {
    console.time('Apply formatting');

    const {
      objectWorkingId, excelContext, instanceDefinition, officeTable,
    } = operationData;
    const { columnInformation, isCrosstab } = instanceDefinition.mstrTable;

    try {
      const filteredColumnInformation = this.filterColumnInformation(columnInformation);

      const attributeColumnNumber = this.calculateAttributeColumnNumber(columnInformation, isCrosstab);

      const offset = this.calculateOffset(
        isCrosstab,
        columnInformation.length,
        attributeColumnNumber
      );
      await excelContext.sync();

      await this.setupFormatting(filteredColumnInformation, isCrosstab, offset, officeTable, excelContext);

      await excelContext.sync();
    } catch (error) {
      console.error(error);
      console.log('Cannot apply formatting, skipping');
    }

    operationStepDispatcher.completeFormatData(objectWorkingId);

    console.timeEnd('Apply formatting');
  };

  /**
   * Calculates the number of all attribute/consolidations columns in Excel.
   *
   * Number of columns is - for all elements of columnInformation - a sum of:
   *
   * 1 (when element is not an attribute)
   * number of forms (when element is an attribute)
   *
   * @param {Array} columnInformation Columns data
   * @returns {Number} Number of columns in Excel
   */
  calculateAttributeColumnNumber = (columnInformation, isCrosstab) => {
    let attributeColumnNumber = 0;

    columnInformation.forEach(element => {
      if (element.isAttribute) {
        if (!isCrosstab) {
          attributeColumnNumber += (element.forms && element.forms.length) ? element.forms.length : 1;
        }
      } else {
        attributeColumnNumber++;
      }
    });

    return attributeColumnNumber;
  };

  /**
   * Calculates number of columns to be offsetted when formatting.
   *
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   * @param {Number} columnInformationLength Number of elements in columnInformation
   * @param {Number} filteredColumnInformationLength Number of elements in filteredColumnInformation
   * @param {Number} attributeColumnNumber Number of all attribute/consolidations columns in Excel
   * @returns {number} Number of columns to be offsetted when formatting
   */
  calculateOffset = (isCrosstab, columnInformationLength, attributeColumnNumber) => {
    let offset = 0;

    if (isCrosstab) {
      offset = columnInformationLength - attributeColumnNumber;
    } else {
      offset = attributeColumnNumber - columnInformationLength;
    }

    return offset;
  };

  /**
   * Setups formatting.
   *
   * @param {Array} filteredColumnInformation
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   * @param {Number} offset Number of columns to be offsetted when formatting
   * @param {Office} officeTable Reference to Excel table
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   */
  setupFormatting = async (filteredColumnInformation, isCrosstab, offset, officeTable, excelContext) => {
    for (let i = filteredColumnInformation.length - 1; i >= 0; i--) {
      const object = filteredColumnInformation[i];
      const columnRange = this.getColumnRangeForFormatting(object.index, isCrosstab, offset, officeTable);
      if (object.isAttribute) {
        columnRange.numberFormat = '';

        await officeFormatHyperlinks.formatColumnAsHyperlinks(object, columnRange, excelContext);
      } else {
        columnRange.numberFormat = this.getFormat(object);
      }
    }
  };

  /**
   * Gets columns range to apply formatting to.
   *
   * Offset is added to index for tables, for crosstabs index is subtracted by offset.
   *
   * @param {Number} index Index of a column.
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   * @param {Number} offset Number of columns to be offsetted when formatting
   * @param {Office} officeTable Reference to Excel table
   * @returns {Office} Columns range to apply formatting to
   */
  getColumnRangeForFormatting = (index, isCrosstab, offset, officeTable) => {
    const objectIndex = isCrosstab ? index - offset : index + offset;
    // Crosstab
    if (isCrosstab && index < offset) {
      return officeTable.columns.getItemAt().getDataBodyRange().getOffsetRange(0, objectIndex);
    }
    // Tabular
    return officeTable.columns.getItemAt(objectIndex).getDataBodyRange();
  }
;

  /**
   * Returns filtered column information.
   *
   * For tables returns array of elements containing own properties.
   * For crosstabs returns array of elements that are not attributes and contains own properties.
   *
   * @param {Array} columnInformation Columns data
   * @return {Array} filteredColumnInformation Filtered columnInformation
   */
  filterColumnInformation = (columnInformation) => columnInformation.filter((col) => Object.keys(col).length !== 0);

  /**
   * Returns Excel format string based on MicroStrategy format string.
   *
   * @param {String} Format given by MicroStrategy
   * @return {String} Excel format
   */
  getFormat = ({ formatString, category }) => {
    if (category === 9) {
      return 'General';
    }

    // For fractions set General format
    if (formatString.match(/# \?+?\/\?+?/)) {
      return 'General';
    }

    // Normalizing formatString from MicroStrategy when locale codes are used [$-\d+]
    if (formatString.indexOf('$') !== -1) {
      return formatString.replace(/\[\$-/g, '[$$$$-')
        .replace(/\$/g, '\\$')
        .replace(/\\\$\\\$/g, '$')
        .replace(/"/g, '');
    }

    return formatString;
  };
}

const stepApplyFormatting = new StepApplyFormatting();
export default stepApplyFormatting;
