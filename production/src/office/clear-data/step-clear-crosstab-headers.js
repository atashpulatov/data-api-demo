import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeApiHelper } from '../api/office-api-helper';
import { officeApiCrosstabHelper } from '../api/office-api-crosstab-helper';


class StepClearCrosstabHeaders {
  clearCrosstabHeaders = async (objectData, operationData) => {
    const { excelContext, objectExist, objectWorkingId } = operationData;

    if (objectExist) {
      const { isCrosstab, bindId } = objectData;
      if (isCrosstab) {
        const officeTable = await officeApiHelper.getTable(excelContext, bindId);
        officeApiCrosstabHelper.clearEmptyCrosstabRow(officeTable);
        officeTable.showHeaders = true;
        officeTable.showFilterButton = false;

        const headers = officeTable.getHeaderRowRange();
        headers.format.font.color = 'white';
        await excelContext.sync();
      }
    }

    operationStepDispatcher.completeClearCrosstabHeaders(objectWorkingId);
  };
}

const stepClearCrosstabHeaders = new StepClearCrosstabHeaders();
export default stepClearCrosstabHeaders;
