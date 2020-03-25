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
   * @param {Number} operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Office} operationData.officeTable Reference to Table created by Excel
   * @param {Object} operationData.instanceDefinition Object containing information about MSTR object
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   */
  applyFormatting = async (objectData, operationData) => {
    console.time('Apply formatting');

    try {
      const {
        objectWorkingId, excelContext, instanceDefinition, officeTable,
      } = operationData;
      const { columnInformation, isCrosstab } = instanceDefinition.mstrTable;

      const filteredColumnInformation = this.filterColumnInformation(columnInformation, isCrosstab);

      const attributeColumnNumber = this.calculateAttributeColumnNumber(columnInformation);

      const offset = this.calculateOffset(
        isCrosstab,
        columnInformation.length,
        filteredColumnInformation.length,
        attributeColumnNumber
      );

      this.setupFormatting(filteredColumnInformation, isCrosstab, offset, officeTable);

      await excelContext.sync();

      operationStepDispatcher.completeFormatData(objectWorkingId);
    } catch (error) {
      console.error(error);
      console.log('Cannot apply formatting, skipping');
    }

    console.timeEnd('Apply formatting');
  };

  calculateAttributeColumnNumber = (columnInformation) => {
    let attributeColumnNumber = 0; // this is number of all atrribute/consolidations columns in Excel

    columnInformation.forEach(element => {
      if (element.isAttribute) {
        attributeColumnNumber += (element.forms && element.forms.length) ? element.forms.length : 1;
      } else {
        attributeColumnNumber++;
      }
    });

    return attributeColumnNumber;
  };

  calculateOffset = (isCrosstab, columnInformationLength, filteredColumnInformationLength, attributeColumnNumber) => {
    let offset = 0;

    if (isCrosstab) {
      offset = columnInformationLength - filteredColumnInformationLength;
    } else {
      offset = attributeColumnNumber - columnInformationLength;
    }

    return offset;
  };

  setupFormatting = (filteredColumnInformation, isCrosstab, offset, officeTable) => {
    for (let i = filteredColumnInformation.length - 1; i >= 0; i--) {
      const object = filteredColumnInformation[i];

      const columnRange = this.getColumnRangeForFormatting(object.index, isCrosstab, offset, officeTable);

      if (object.isAttribute) {
        columnRange.numberFormat = '';
      } else {
        columnRange.numberFormat = this.getFormat(object);
      }
    }
  };

  getColumnRangeForFormatting = (index, isCrosstab, offset, officeTable) => {
    const objectIndex = isCrosstab ? index - offset : index + offset;

    return officeTable.columns.getItemAt(objectIndex).getDataBodyRange();
  };

  /**
   * Returns filtered column information.
   *
   * @param columnInformation
   * @param isCrosstab
   * @return {Array} filteredColumnInformation
   */
  filterColumnInformation = (columnInformation, isCrosstab) => {
    if (isCrosstab) {
      return columnInformation.filter((e) => (!e.isAttribute) && (Object.keys(e).length !== 0));
    }
    return columnInformation.filter((column) => Object.keys(column).length !== 0);
  };

  /**
   * Returns parsed format string.
   *
   * @param {String} format given by MicroStrategy
   * @return {String} parsed format
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
