import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';
import { officeApiHelper } from '../api/office-api-helper';

import {
  MstrTable,
  OperationData,
} from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepClearCrosstabHeaders {
  /**
   * Removes the data inserted into range taken by crosstab headers
   *
   * If the Excel Table no longer exist the step will be skipped
   *
   * This function is subscribed as one of the operation steps with the key CLEAR_CROSSTAB_HEADERS,
   * therefore should be called only via operation bus.
   *
   * @param objectData Contaisn data about object on which operation was called
   * @param operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param operationData.objectExist Specify if the object existed when operation was started
   */
  async clearCrosstabHeaders(objectData: ObjectData, operationData: OperationData): Promise<void> {
    const { objectWorkingId, excelContext, objectExist } = operationData;

    try {
      if (objectExist) {
        const { isCrosstab, bindId, crosstabHeaderDimensions } = objectData;
        if (isCrosstab) {
          const officeTable = officeApiHelper.getTable(excelContext, bindId);

          await officeApiCrosstabHelper.clearCrosstabRange(
            officeTable,
            {
              crosstabHeaderDimensions: {},
              isCrosstab,
              prevCrosstabDimensions: crosstabHeaderDimensions,
            } as MstrTable,
            excelContext,
            true
          );

          officeApiCrosstabHelper.clearCrosstabRowForTableHeader(officeTable);
          officeTable.showHeaders = true;
          officeTable.showFilterButton = false;

          const headers = officeTable.getHeaderRowRange();
          headers.format.font.color = 'white';
          await excelContext.sync();
        }
      }

      operationStepDispatcher.completeClearCrosstabHeaders(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  }
}

const stepClearCrosstabHeaders = new StepClearCrosstabHeaders();
export default stepClearCrosstabHeaders;
