import { FORMAT_OFFICE_TABLE, } from '../../operation/operation-steps';
import { markStepCompleted } from '../../operation/operation-actions';

class StepFormatTable {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  /**
   * Formatting table columns width
   *
   * @param {Office} table
   * @param {Boolean} isCrosstab
   * @param {Office} crosstabHeaderDimensions
   * @param {Office} excelContext
   */
  formatTable = async (objectData) => {
    const {
      excelContext,
      instanceDefinition,
      officeTable,
      objectWorkingId,
    } = objectData;

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

    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, FORMAT_OFFICE_TABLE));
    console.timeEnd('Column auto size');
  };
}
const stepFormatTable = new StepFormatTable();
export default stepFormatTable;
