import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeContext } from '../office-context';

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
      const filteredColumnInformation = this.filterColumnInformation(columnInformation, isCrosstab);

      const attributeColumnNumber = this.calculateAttributeColumnNumber(columnInformation);

      const offset = this.calculateOffset(
        isCrosstab,
        columnInformation.length,
        filteredColumnInformation.length,
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
  calculateAttributeColumnNumber = (columnInformation) => {
    let attributeColumnNumber = 0;

    columnInformation.forEach(element => {
      if (element.isAttribute) {
        attributeColumnNumber += (element.forms && element.forms.length) ? element.forms.length : 1;
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
  calculateOffset = (isCrosstab, columnInformationLength, filteredColumnInformationLength, attributeColumnNumber) => {
    let offset = 0;

    if (isCrosstab) {
      offset = columnInformationLength - filteredColumnInformationLength;
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
        // https://docs.microsoft.com/en-us/javascript/api/excel/excel.rangehyperlink
        if (officeContext.isSetSupported(1.7)) {
          try {
            excelContext.trackedObjects.add(columnRange);
            // TODO: Investigate other types that contain hyperlinks
            const isHTMLTag = object.forms.findIndex(e => e.baseFormType === 'HTMLTag');
            if (isHTMLTag !== -1) {
              console.time('Creating hyperlinks');
              await this.convertToHyperlink(columnRange, excelContext);
              console.timeEnd('Creating hyperlinks');
            }
            excelContext.trackedObjects.remove(columnRange);
          } catch (error) {
            console.warn('Error while creating hyperlinks, skipping...');
          }
        }
      } else {
        columnRange.numberFormat = this.getFormat(object);
      }
    }
  };

  /**
   * Checks if a string is a valid url including ip addresses.
   *
   * @param {String} str a url string
   * @returns {Boolean} is valid url
   */
  isValidUrl = (str) => {
    const urlRegExp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return urlRegExp.test(str);
  }

  /**
   * Extracts href and data from HTMLTag attribute forms
   * <a data="textToDisplay" href="address">textToDisplay</a>
   *
   * @param {String} string HTMLTag attribute form
   * @returns {(Object|Boolean)} Object { address, textToDisplay } or false if not a valid HTMLTag
   */
  parseHTMLTag = (string) => {
    const hrefRegExp = /'?<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["']/;
    const textRegExp = /'?<a\s+(?:[^>]*?\s+)?data=["']([^"']*)["']/;
    const hrefMatch = string.match(hrefRegExp);
    let textMatch = string.match(textRegExp);

    // If there is no href or is not valid we cannot make a hyperlink
    if (!hrefMatch || hrefMatch[0] === '' || !this.isValidUrl(hrefMatch[1])) {
      return false;
    }

    // If there is no text use hyperlink
    if (!textMatch || textMatch[0] === '' || textMatch[1] === '') {
      textMatch = hrefMatch;
    }

    return { address: hrefMatch[1], textToDisplay: textMatch[1] };
  }

  /**
   * Iterates through a range of cells with hyperlinks and
   * replaces the content with a valid ExcelAPI hyperlink object
   *
   * @param {Office} range Reference to Excel range
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @returns {Promise} contextSync
   */
  convertToHyperlink = async (range, excelContext) => {
    try {
      range.load('values');
      await excelContext.sync();
    } catch (error) {
      console.log('Excel API cannot load hyperlink values, skipping column');
      throw error;
    }

    for (let i = 0; i < range.values.length; i++) {
      const cellRange = range.getCell(i, 0);
      const cellText = range.values[i][0];
      const hyperlink = this.parseHTMLTag(cellText);
      if (hyperlink) {
        cellRange.hyperlink = hyperlink;
        cellRange.untrack();
      }
      // Sync after a batch of 5000 to avoid errors and performance issues
      if (i % 5000 === 0) {
        try {
          await excelContext.sync();
        } catch (error) {
          console.log(error);
        }
      }
    }

    return excelContext.sync();
  }

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

    return officeTable.columns.getItemAt(objectIndex).getDataBodyRange();
  };

  /**
   * Returns filtered column information.
   *
   * For tables returns array of elements containing own properties.
   * For crosstabs returns array of elements that are not attributes and contains own properties.
   *
   * @param {Array} columnInformation Columns data
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   * @return {Array} filteredColumnInformation Filtered columnInformation
   */
  filterColumnInformation = (columnInformation, isCrosstab) => {
    if (isCrosstab) {
      return columnInformation.filter((e) => (!e.isAttribute) && (Object.keys(e).length !== 0));
    }
    return columnInformation.filter((column) => Object.keys(column).length !== 0);
  };

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
