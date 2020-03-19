import { FORMAT_SUBTOTALS } from '../../operation/operation-steps';
import { markStepCompleted } from '../../operation/operation-actions';
import officeFormatSubtotals from './office-format-subtotals';

class StepApplySubtotalFormatting {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
   * Applies Excel number formatting to imported object based on MSTR data type.
   *
   * @param {Boolean} isCrosstab
   * @param {Array} subtotalsAddresses Array containing object with cell coordinates
   * @param {Office} officeTable
   * @param {Office} excelContext ExcelContext
   * @param {Object} mstrTable contains information about mstr object
   * @param {Boolean} [shouldBold=true] Specify whether the values in cells should be bold
   */
  applySubtotalFormattingRedux = async (objectData, operationData) => {
    const { objectWorkingId, } = objectData;
    const { excelContext, instanceDefinition, officeTable, } = operationData;
    const { mstrTable } = instanceDefinition;


    if (mstrTable.subtotalsInfo.subtotalsAddresses.length) {
      // Removing duplicated subtotal addresses from headers
      await officeFormatSubtotals.applySubtotalFormatting({
        excelContext,
        officeTable
      }, mstrTable);
    }
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, FORMAT_SUBTOTALS));
  };
}

const stepApplySubtotalFormatting = new StepApplySubtotalFormatting();
export default stepApplySubtotalFormatting;
