import officeFormatSubtotals from './office-format-subtotals';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepApplySubtotalFormatting {
  /**
   * Communicates with object reducer and calls officeFormatSubtotals.applySubtotalFormatting.
   *
   * This function is subscribed as one of the operation steps with the key FORMAT_SUBTOTALS,
   * therefore should be called only via operation bus.
   *
   * @param {Number} operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Office} operationData.officeTable Reference to Table created by Excel
   * @param {Object} operationData.instanceDefinition Object containing information about MSTR object
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   */
  applySubtotalFormattingRedux = async (objectData, operationData) => {
    const {
      objectWorkingId, excelContext, instanceDefinition, officeTable,
    } = operationData;
    const { mstrTable } = instanceDefinition;

    if (mstrTable.subtotalsInfo.subtotalsAddresses.length) {
      // Removing duplicated subtotal addresses from headers
      await officeFormatSubtotals.applySubtotalFormatting({
        excelContext,
        officeTable
      }, mstrTable);
    }

    operationStepDispatcher.completeFormatSubtotals(objectWorkingId);
  };
}

const stepApplySubtotalFormatting = new StepApplySubtotalFormatting();
export default stepApplySubtotalFormatting;
