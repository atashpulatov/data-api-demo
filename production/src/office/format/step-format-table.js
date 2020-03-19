import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepFormatTable {
  /**
   * Formatting table columns width
   *
   * @param {Office} table
   * @param {Boolean} isCrosstab
   * @param {Office} crosstabHeaderDimensions
   * @param {Office} excelContext
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
