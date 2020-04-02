import { officeRemoveHelper } from '../office/remove/office-remove-helper';
import { IMPORT_OPERATION, DUPLICATE_OPERATION } from './operation-type-names';
import { cancelOperation } from './operation-actions';
import { removeObject, restoreObjectBackup } from './object-actions';

class OperationErrorHandler {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  handleOperationError = async (ObjectData, OperationData) => {
    const { objectWorkingId, isCrosstab, crosstabHeaderDimensions } = ObjectData;
    const {
      officeTable, excelContext, operationType, backupObjectData
    } = OperationData;

    if (operationType === IMPORT_OPERATION || operationType === DUPLICATE_OPERATION) {
      if (officeTable) {
        officeTable.showHeaders = true;
        await officeRemoveHelper.removeExcelTable(
          officeTable,
          excelContext,
          isCrosstab,
          crosstabHeaderDimensions,
          false
        );
      }
      this.reduxStore.dispatch(removeObject(objectWorkingId));
    } else {
      if (officeTable) {
        if (isCrosstab) {
          officeTable.showHeaders = false; // hides table headers for crosstab if we fail on refresh
        }
      }
      if (backupObjectData) { this.reduxStore.dispatch(restoreObjectBackup(backupObjectData)); }
    }
    this.reduxStore.dispatch(cancelOperation(objectWorkingId));
  }
}

const operationErrorHandler = new OperationErrorHandler();
export default operationErrorHandler;
