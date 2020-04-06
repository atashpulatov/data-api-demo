import { officeRemoveHelper } from '../office/remove/office-remove-helper';
import { toggleIsClearingFlag } from '../redux-reducer/office-reducer/office-actions';
import { cancelOperation } from '../redux-reducer/operation-reducer/operation-actions';
import { removeObject, restoreObjectBackup } from '../redux-reducer/object-reducer/object-actions';
import officeReducerHelper from '../office/store/office-reducer-helper';
import {
  IMPORT_OPERATION, DUPLICATE_OPERATION, REFRESH_OPERATION, EDIT_OPERATION, CLEAR_DATA_OPERATION, REMOVE_OPERATION
} from './operation-type-names';

class OperationErrorHandler {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  handleOperationError = async (ObjectData, OperationData) => {
    const { operationType } = OperationData;

    switch (operationType) {
      case IMPORT_OPERATION:
      case DUPLICATE_OPERATION:
        this.handleImportOperationError(ObjectData, OperationData);
        break;

      case REFRESH_OPERATION:
      case EDIT_OPERATION:
        this.handleRefreshOperationError(ObjectData, OperationData);
        break;

      case CLEAR_DATA_OPERATION:
        this.handleClearDataOperationError();
        break;

      default:
        this.handleGenericOperationError(ObjectData, OperationData);
        break;
    }
  }

  handleImportOperationError = async (ObjectData, OperationData) => {
    const { objectWorkingId, isCrosstab, crosstabHeaderDimensions } = ObjectData;
    const { officeTable, excelContext, operationType } = OperationData;

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
    }
    this.reduxStore.dispatch(cancelOperation(objectWorkingId));
  }

  handleRefreshOperationError = async (ObjectData, OperationData) => {
    const { objectWorkingId, isCrosstab } = ObjectData;
    const { officeTable, backupObjectData } = OperationData;

    if (officeTable) {
      if (isCrosstab) {
        officeTable.showHeaders = false; // hides table headers for crosstab if we fail on refresh
      }
    }
    if (backupObjectData) { this.reduxStore.dispatch(restoreObjectBackup(backupObjectData)); }

    this.reduxStore.dispatch(cancelOperation(objectWorkingId));
  }

  handleClearDataOperationError = async () => {
    const operationsList = officeReducerHelper.getOperationsListFromOperationReducer();
    const clearDataOperations = operationsList.filter((operation) => operation.operationType === CLEAR_DATA_OPERATION);

    for (let index = clearDataOperations.length - 1; index >= 0; index--) {
      const operation = clearDataOperations[index];
      this.reduxStore.dispatch(cancelOperation(operation.objectWorkingId));
    }

    toggleIsClearingFlag(false)(this.reduxStore.dispatch);
  }

  handleGenericOperationError = async (ObjectData, OperationData) => {
    const { objectWorkingId } = ObjectData;

    this.reduxStore.dispatch(cancelOperation(objectWorkingId));
  }
}

const operationErrorHandler = new OperationErrorHandler();
export default operationErrorHandler;
