import { officeApiCrosstabHelper } from '../office/api/office-api-crosstab-helper';
import { officeRemoveHelper } from '../office/remove/office-remove-helper';
import { officeShapeApiHelper } from '../office/shapes/office-shape-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';

import { ObjectData } from '../redux-reducer/object-reducer/object-reducer-types';
import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';

import { errorService } from '../error/error-handler';
import { deleteObjectNotification } from '../redux-reducer/notification-reducer/notification-action-creators';
import { removeObject, restoreObjectBackup } from '../redux-reducer/object-reducer/object-actions';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { cancelOperation } from '../redux-reducer/operation-reducer/operation-actions';
import { executeNextRepromptTask } from '../redux-reducer/reprompt-queue-reducer/reprompt-queue-actions';
import { OperationTypes } from './operation-type-names';
import { ObjectImportType } from '../mstr-object/constants';

class OperationErrorHandler {
  reduxStore: any;

  init(reduxStore: any): void {
    this.reduxStore = reduxStore;
  }

  /**
   * Main function responsible for error handling in operations.
   * Based on operation type further function will called to handle error that could occur during operation.
   *
   * @param objectData Unique Id of the object allowing to reference specific object
   * @param operationData Contains informatons about current operation
   * @param error Error thrown during the operation execution
   */
  async handleOperationError(
    objectData: ObjectData,
    operationData: OperationData,
    error: any
  ): Promise<void> {
    const callback = this.getCallback(objectData, operationData);
    if (callback) {
      await errorService.handleObjectBasedError(
        objectData.objectWorkingId,
        error,
        callback,
        operationData
      );
    }
  }

  /**
   * Function handling erros that occured during Import and Duplicate operation.
   * Error will be displayed and the operation will be canceled
   * If the Excel table was already created it will be removed.
   *
   * @param objectData Unique Id of the object allowing to reference specific object
   * @param operationData Contains informatons about current operation
   */
  async handleImportOperationError(
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> {
    const { objectWorkingId, isCrosstab, crosstabHeaderDimensions, bindId, importType } =
      objectData;
    const { officeTable, excelContext } = operationData;

    if (officeTable) {
      await officeApiCrosstabHelper.clearCrosstabRange(
        officeTable,
        {
          crosstabHeaderDimensions: {},
          isCrosstab,
          prevCrosstabDimensions: crosstabHeaderDimensions,
        },
        excelContext,
        false
      );

      officeTable.showHeaders = true; // check if needed

      await officeRemoveHelper.removeExcelTable(officeTable, excelContext, false);
    }

    // delete image if it was created
    if (importType === ObjectImportType.IMAGE && bindId) {
      await officeShapeApiHelper.deleteImage(excelContext, bindId);
    }

    this.clearFailedObjectFromRedux(objectWorkingId);
  }

  /**
   * Function removing object, operation and notification.
   * Called after encountering error that occured during Import and Duplicate operation.
   *
   * @param objectWorkingId Unique Id of the object allowing to reference specific object
   */
  clearFailedObjectFromRedux(objectWorkingId: number): void {
    // Make sure that object isn't removed from redux if it's still in reprompt queue
    const { total = 0 } = this.reduxStore.getState().repromptsQueueReducer;
    if (total === 0) {
      this.reduxStore.dispatch(removeObject(objectWorkingId));
    }
    this.reduxStore.dispatch(cancelOperation(objectWorkingId));
    this.reduxStore.dispatch(deleteObjectNotification(objectWorkingId));
    this.reduxStore.dispatch(executeNextRepromptTask());
  }

  /**
   * Function handling erros that occured during Refresh and Edit operation.
   * Error will be displayed and the operation will be canceled
   * In case of error in operation previous object data will be restored to objects list.
   *
   * @param objectData Unique Id of the object allowing to reference specific object
   * @param operationData Contains informatons about current operation
   */
  async handleRefreshOperationError(
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> {
    const { objectWorkingId, isCrosstab } = objectData;
    const { officeTable, backupObjectData, isTotalsRowVisible = false } = operationData;
    if (officeTable) {
      if (isCrosstab) {
        officeTable.showHeaders = false; // hides table headers for crosstab if we fail on refresh
      }
      officeTable.showTotals = isTotalsRowVisible; // display totals rows if we fail on refresh
    }
    if (backupObjectData) {
      this.reduxStore.dispatch(restoreObjectBackup(backupObjectData));
    }

    this.reduxStore.dispatch(cancelOperation(objectWorkingId));

    this.reduxStore.dispatch(deleteObjectNotification(objectWorkingId));
  }

  /**
   * Function handling erros that occured during Clear Data operation.
   * Error will be displayed and the operation will be canceled
   * Additionaly all other Clear Data operation will also be canceled and
   * the isClearDataFailed flag will be changed to false.
   */
  async handleClearDataOperationError(): Promise<void> {
    const operationsList = officeReducerHelper.getOperationsListFromOperationReducer();
    const clearDataOperations = operationsList.filter(
      operation => operation.operationType === OperationTypes.CLEAR_DATA_OPERATION
    );

    for (let index = clearDataOperations.length - 1; index >= 0; index--) {
      const operation = clearDataOperations[index];
      this.reduxStore.dispatch(cancelOperation(operation.objectWorkingId));
      this.reduxStore.dispatch(deleteObjectNotification(operation.objectWorkingId));
    }

    officeActions.toggleIsClearDataFailedFlag(true)(this.reduxStore.dispatch);
  }

  /**
   * Function handling erros that occurs in other types of operations.
   * Error will be displayed and the operation will be canceled.
   *
   * @param objectData Unique Id of the object allowing to reference specific object
   */
  async handleGenericOperationError(objectData: any): Promise<void> {
    const { objectWorkingId } = objectData;

    this.reduxStore.dispatch(cancelOperation(objectWorkingId));

    this.reduxStore.dispatch(deleteObjectNotification(objectWorkingId));
  }

  /**
   * Function geting callback that occurs in all types of operations.
   * Error will be displayed and the operation will be canceled.
   *
   * @param objectData Unique Id of the object allowing to reference specific object
   * @param operationData Contains informatons about current operation
   */
  getCallback(objectData: ObjectData, operationData: OperationData): Function {
    const { operationType } = operationData;

    let callback;
    switch (operationType) {
      case OperationTypes.IMPORT_OPERATION:
      case OperationTypes.DUPLICATE_OPERATION:
        callback = () => this.handleImportOperationError(objectData, operationData);
        break;
      case OperationTypes.REFRESH_OPERATION:
      case OperationTypes.EDIT_OPERATION:
        callback = () => this.handleRefreshOperationError(objectData, operationData);
        break;
      case OperationTypes.CLEAR_DATA_OPERATION:
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
