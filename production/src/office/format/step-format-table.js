import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeApiDataLoader from '../api/office-api-data-loader';

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
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Office} operationData.officeTable Reference to Table created by Excel
   * @param {Object} operationData.instanceDefinition Object containing information about MSTR object
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   */
  formatTable = async (objectData, operationData) => {
    console.time('Column auto size');

    const { objectWorkingId, } = objectData;
    const { excelContext, instanceDefinition, officeTable, } = operationData;
    const { crosstabHeaderDimensions, isCrosstab } = instanceDefinition.mstrTable;

    try {
      this.formatCrosstab(officeTable, isCrosstab, crosstabHeaderDimensions.rowsX);

      await this.formatColumns(excelContext, officeTable.columns);

      await excelContext.sync();
    } catch (error) {
      console.log('Error when formatting - no columns autofit applied', error);
    }

    operationStepDispatcher.completeFormatOfficeTable(objectWorkingId);

    console.timeEnd('Column auto size');
  };

  formatCrosstab = (officeTable, isCrosstab, rowsX) => {
    if (isCrosstab) {
      officeTable.getDataBodyRange()
        .getColumnsBefore(rowsX)
        .format
        .autofitColumns();

      officeTable.showHeaders = false;
    }
  };

  formatColumns = async (excelContext, columns) => {
    const columnsCount = await officeApiDataLoader.loadExcelDataSingle(excelContext, columns, 'count');

    for (let i = 0; i < columnsCount; i++) {
      await this.formatSingleColumn(excelContext, columns.getItemAt(i));
    }
  };

  formatSingleColumn = async (excelContext, column) => {
    column.getRange()
      .format
      .autofitColumns();

    await excelContext.sync();
  };
}

const stepFormatTable = new StepFormatTable();
export default stepFormatTable;
