class OfficeFormatData {
  /**
   * Applies Excel number formatting to imported object based on MSTR data type.
   *
   * @param {Office} officeTable
   * @param {Object} instanceDefinition
   * @param {Boolean} isCrosstab
   * @param {Office} excelContext
   */
  applyFormatting = async ({ officeTable, excelContext, instanceDefinition }) => {
    try {
      console.time('Apply formatting');
      const { columnInformation, isCrosstab } = instanceDefinition.mstrTable;
      const filteredColumnInformation = this.filterColumnInformation(columnInformation, isCrosstab);
      let attributeColumnNumber = 0; // this is number of all atrribute/consolidations columns in Excel
      let offset = 0;

      columnInformation.forEach(element => {
        if (element.isAttribute) {
          attributeColumnNumber += (element.forms && element.forms.length) ? element.forms.length : 1;
        } else {
          attributeColumnNumber++;
        }
      });

      if (isCrosstab) {
        offset = columnInformation.length - filteredColumnInformation.length;
      } else {
        offset = attributeColumnNumber - columnInformation.length;
      }

      for (let i = filteredColumnInformation.length - 1; i >= 0; i--) {
        const object = filteredColumnInformation[i];
        const objectIndex = isCrosstab ? object.index - offset : object.index + offset;
        const columnRange = officeTable.columns.getItemAt(objectIndex).getDataBodyRange();

        if (!object.isAttribute) {
          columnRange.numberFormat = this.getFormat(object);
        } else {
          columnRange.numberFormat = '';
        }
      }

      await excelContext.sync();
    } catch (error) {
      console.error(error);
      console.log('Cannot apply formatting, skipping');
    } finally {
      console.timeEnd('Apply formatting');
    }
  };

  /**
   * Return filtered column information
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
   * Return parsed format string
   *
   * @param {String} format given by MicroStrategy
   * @return {String} parsed format
   */
  getFormat = ({ formatString, category }) => {
    if (category === 9) { return 'General'; }
    // For fractions set General format
    if (formatString.match(/# \?+?\/\?+?/)) { return 'General'; }
    if (formatString.indexOf('$') !== -1) {
      return formatString.replace(/\[\$-/g, '[$$$$-')
        .replace(/\$/g, '\\$')
        .replace(/\\\$\\\$/g, '$')
        .replace(/"/g, '');
    }
    return formatString;
  };
}
const officeFormatData = new OfficeFormatData();
export default officeFormatData;
