import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeApiDataLoader from '../api/office-api-data-loader';

const AUTOFIT_COLUMN_LIMIT = 50;

class StepFormatTable {
  /**
   * Auto resizes the columns of the Office table passed in parameters.
   *
   * Columns are resized and synchronized with Excel for each column separately.
   * In case of error this step is skipped and import/refresh workflow continues.
   *
   * This function is subscribed as one of the operation steps with key the FORMAT_OFFICE_TABLE,
   * therefore should be called only via operation bus.
   *
   * @param {Number} operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Office} operationData.officeTable Reference to Table created by Excel
   * @param {Object} operationData.instanceDefinition Object containing information about MSTR object
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   */
  formatTable = async (objectData, operationData) => {
    console.time('Column auto size');
    const {
      objectWorkingId, excelContext, instanceDefinition, officeTable,
    } = operationData;
    const { crosstabHeaderDimensions, isCrosstab } = instanceDefinition.mstrTable;
    const { columns } = instanceDefinition;

    try {
      if (columns < AUTOFIT_COLUMN_LIMIT) {
        this.formatCrosstabHeaders(officeTable, isCrosstab, crosstabHeaderDimensions.rowsX);

        await this.formatColumns(excelContext, officeTable.columns);

        await excelContext.sync();
      } else {
        console.log('The column count is more than columns autofit limit - no columns autofit applied.');
      }
    } catch (error) {
      console.error(error);
      console.log('Error when formatting - no columns autofit applied', error);
    }

    operationStepDispatcher.completeFormatOfficeTable(objectWorkingId);

    console.timeEnd('Column auto size');
  };

  /**
   * Calls autofit function from Excel API for range containing all column that are part of row crosstab headers
   * and hides Excel table headers.
   *
   * @param {Office} officeTable Reference to Table created by Excel
   * @param {Boolean} isCrosstab Indicates if it's a crosstab
   * @param {number} rowsX Number of columns in crosstab row headers
   */
  formatCrosstabHeaders = (officeTable, isCrosstab, rowsX) => {
    if (isCrosstab) {
      officeTable.getDataBodyRange()
        .getColumnsBefore(rowsX)
        .format
        .autofitColumns();

      officeTable.showHeaders = false;
    }
  };

  /**
   * Calls formatSingleColumn function for each column in passed column collection.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Office} columns Reference to Excel columns collection
   */
  formatColumns = async (excelContext, columns) => {
    const columnsCount = await officeApiDataLoader.loadSingleExcelData(excelContext, columns, 'count');

    for (let i = 0; i < columnsCount; i++) {
      await this.formatSingleColumn(excelContext, columns.getItemAt(i));
    }
  };

  /**
   * Calls autofit function from Excel API for passed column.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {Office} column Reference to Excel column
   */
  formatSingleColumn = async (excelContext, column) => {
    column.getRange()
      .format
      .autofitColumns();

    await excelContext.sync();
  };
}

const stepFormatTable = new StepFormatTable();
export default stepFormatTable;
