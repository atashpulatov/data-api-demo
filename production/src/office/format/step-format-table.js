import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepFormatTable {
  /**
   * Function responsible auto resizing the columns of the Office table passed in parameters.
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
    const { objectWorkingId, } = objectData;
    const { excelContext, instanceDefinition, officeTable, } = operationData;
    const { crosstabHeaderDimensions, isCrosstab } = instanceDefinition.mstrTable;

    console.time('Column auto size');
    if (isCrosstab) {
      const { rowsX } = crosstabHeaderDimensions;
      officeTable.getDataBodyRange().getColumnsBefore(rowsX).format.autofitColumns();
    }

    try {
      const { columns } = officeTable;
      columns.load('count');
      await excelContext.sync();
      for (let index = 0; index < columns.count; index++) {
        columns.getItemAt(index).getRange().format.autofitColumns();
        await excelContext.sync();
      }
      if (isCrosstab) { officeTable.showHeaders = false; }
      await excelContext.sync();
    } catch (error) {
      console.log('Error when formatting - no columns autofit applied', error);
    }

    operationStepDispatcher.completeFormatOfficeTable(objectWorkingId);

    console.timeEnd('Column auto size');
  };
}

const stepFormatTable = new StepFormatTable();
export default stepFormatTable;
