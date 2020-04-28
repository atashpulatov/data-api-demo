import officeReducerHelper from '../office/store/office-reducer-helper';
import { officeRemoveHelper } from '../office/remove/office-remove-helper';
import { toggleIsClearDataFailedFlag } from '../redux-reducer/office-reducer/office-actions';
import { cancelOperation } from '../redux-reducer/operation-reducer/operation-actions';
import { removeObject, restoreObjectBackup } from '../redux-reducer/object-reducer/object-actions';
import { errorService } from '../error/error-handler';
import { deleteObjectNotification } from '../redux-reducer/notification-reducer/notification-action-creators';
import {
  IMPORT_OPERATION, DUPLICATE_OPERATION, REFRESH_OPERATION, EDIT_OPERATION, CLEAR_DATA_OPERATION,
} from './operation-type-names';

class OperationErrorHandler {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
   * Main function responsible for error handling in operations.
   * Based on operation type further function will called to handle error that could occur during operation.
   *
   * @param {Object} objectData Unique Id of the object allowing to reference specific object
   * @param {Object} operationData Contains informatons about current operation
   * @param {Error} error Error thrown during the operation execution
   */
  handleOperationError = async (objectData, operationData, error) => {
    const callback = this.getCallback(objectData, operationData);
    errorService.handleObjectBasedError(objectData.objectWorkingId, error, callback, operationData);
  }

  /**
   * Function handling erros that occured during Import and Duplicate operation.
   * Error will be displayed and the operation will be canceled
   * If the Excel table was already created it will be removed.
   *
   * @param {Object} objectData Unique Id of the object allowing to reference specific object
   * @param {Object} operationData Contains informatons about current operation
   */
  handleImportOperationError = async (objectData, operationData) => {
    const { objectWorkingId, isCrosstab, crosstabHeaderDimensions } = objectData;
    const { officeTable, excelContext } = operationData;

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

    this.reduxStore.dispatch(cancelOperation(objectWorkingId));

    this.reduxStore.dispatch(deleteObjectNotification(objectWorkingId));
  }

  /**
   * Function handling erros that occured during Refresh and Edit operation.
   * Error will be displayed and the operation will be canceled
   * In case of error in operation previous object data will be restored to objects list.
   *
   * @param {Object} objectData Unique Id of the object allowing to reference specific object
   * @param {Object} operationData Contains informatons about current operation
   */
  handleRefreshOperationError = async (objectData, operationData) => {
    const { objectWorkingId, isCrosstab } = objectData;
    const { officeTable, backupObjectData } = operationData;
    if (officeTable) {
      if (isCrosstab) {
        officeTable.showHeaders = false; // hides table headers for crosstab if we fail on refresh
      }
    }
    if (backupObjectData) { this.reduxStore.dispatch(restoreObjectBackup(backupObjectData)); }

    this.reduxStore.dispatch(cancelOperation(objectWorkingId));

    this.reduxStore.dispatch(deleteObjectNotification(objectWorkingId));
  }

  /**
   * Function handling erros that occured during Clear Data operation.
   * Error will be displayed and the operation will be canceled
   * Additionaly all other Clear Data operation will also be canceled and
   * the isClearDataFailed flag will be changed to false.
   */
  handleClearDataOperationError = async () => {
    const operationsList = officeReducerHelper.getOperationsListFromOperationReducer();
    const clearDataOperations = operationsList.filter((operation) => operation.operationType === CLEAR_DATA_OPERATION);

    for (let index = clearDataOperations.length - 1; index >= 0; index--) {
      const operation = clearDataOperations[index];
      this.reduxStore.dispatch(cancelOperation(operation.objectWorkingId));
      this.reduxStore.dispatch(deleteObjectNotification(operation.objectWorkingId));
    }

    toggleIsClearDataFailedFlag(true)(this.reduxStore.dispatch);
  }

  /**
   * Function handling erros that occurs in other types of operations.
   * Error will be displayed and the operation will be canceled.
   *
   * @param {Object} objectData Unique Id of the object allowing to reference specific object
   */
  handleGenericOperationError = async (objectData) => {
    const { objectWorkingId } = objectData;

    this.reduxStore.dispatch(cancelOperation(objectWorkingId));

    this.reduxStore.dispatch(deleteObjectNotification(objectWorkingId));
  }

  /**
   * Function geting callback that occurs in all types of operations.
   * Error will be displayed and the operation will be canceled.
   *
   * @param {Object} objectData Unique Id of the object allowing to reference specific object
   * @param {Object} operationData Contains informatons about current operation
   */
  getCallback(objectData, operationData) {
    const { operationType } = operationData;

    let callback;
    switch (operationType) {
      case IMPORT_OPERATION:
      case DUPLICATE_OPERATION:
        callback = () => this.handleImportOperationError(objectData, operationData);
        break;
      case REFRESH_OPERATION:
      case EDIT_OPERATION:
        callback = () => this.handleRefreshOperationError(objectData, operationData);
        break;
      case CLEAR_DATA_OPERATION:
        callback = () => this.handleClearDataOperationError();
        break;
      default:
        callback = () => this.handleGenericOperationError(objectData);
        break;
    }
    return callback;
  }
}

const operationErrorHandler = new OperationErrorHandler();
export default operationErrorHandler;
