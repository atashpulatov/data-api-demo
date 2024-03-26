import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeFormatSubtotals from './office-format-subtotals';

class StepApplySubtotalFormatting {
  /**
   * Communicates with object reducer and calls officeFormatSubtotals.applySubtotalFormatting.
   *
   * This function is subscribed as one of the operation steps with the key FORMAT_SUBTOTALS,
   * therefore should be called only via operation bus.
   *
   * @param operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param operationData.officeTable Reference to Table created by Excel
   * @param operationData.instanceDefinition Object containing information about MSTR object
   * @param operationData.excelContext Reference to Excel Context used by Excel API functions
   */
  async applySubtotalFormattingRedux(
    _objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> {
    const { objectWorkingId, excelContext, instanceDefinition, officeTable } = operationData;
    const { mstrTable } = instanceDefinition;

    if (mstrTable.subtotalsInfo.subtotalsAddresses.length) {
      // Removing duplicated subtotal addresses from headers
      await officeFormatSubtotals.applySubtotalFormatting(officeTable, excelContext, mstrTable);
    }

    operationStepDispatcher.completeFormatSubtotals(objectWorkingId);
  }
}

const stepApplySubtotalFormatting = new StepApplySubtotalFormatting();
export default stepApplySubtotalFormatting;
