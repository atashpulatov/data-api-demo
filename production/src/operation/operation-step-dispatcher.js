import { toggleSecuredFlag } from '../redux-reducer/office-reducer/office-actions';
import { markStepCompleted, updateOperation } from '../redux-reducer/operation-reducer/operation-actions';
import { CLEAR_DATA_OPERATION } from './operation-type-names';
import {
  BIND_OFFICE_TABLE,
  FETCH_INSERT_DATA,
  FORMAT_DATA,
  FORMAT_OFFICE_TABLE,
  FORMAT_SUBTOTALS,
  GET_INSTANCE_DEFINITION,
  GET_OFFICE_TABLE_EDIT_REFRESH,
  GET_OFFICE_TABLE_IMPORT,
  MODIFY_OBJECT,
  SAVE_OBJECT_IN_EXCEL,
  REMOVE_OBJECT_STORE,
  REMOVE_OBJECT_TABLE,
  REMOVE_OBJECT_BINDING,
  CHECK_OBJECT_STATUS,
  CLEAR_CROSSTAB_HEADERS,
  CLEAR_TABLE_DATA,
  MOVE_NOTIFICATION_TO_IN_PROGRESS,
  DISPLAY_NOTIFICATION_COMPLETED,
  BACKUP_OBJECT_DATA,
} from './operation-steps';
import { updateObject } from '../redux-reducer/object-reducer/object-actions';

class OperationStepDispatcher {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  completeBindOfficeTable = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, BIND_OFFICE_TABLE));
  };

  completeFormatData = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, FORMAT_DATA));
  };

  completeBackupObjectData = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, BACKUP_OBJECT_DATA));
  };

  completeGetInstanceDefinition = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, GET_INSTANCE_DEFINITION));
  };

  completeFormatOfficeTable = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, FORMAT_OFFICE_TABLE));
  };

  completeFetchInsertData = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, FETCH_INSERT_DATA));
  };

  completeGetOfficeTableEditRefresh = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, GET_OFFICE_TABLE_EDIT_REFRESH));
  };

  completeGetOfficeTableImport = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, GET_OFFICE_TABLE_IMPORT));
  };

  completeFormatSubtotals = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, FORMAT_SUBTOTALS));
  };

  completeSaveObjectInExcel = (objectWorkingId) => { // for success
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, SAVE_OBJECT_IN_EXCEL));
  };

  completeModifyObject = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, MODIFY_OBJECT));
  };

  completeRemoveObjectBinding = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, REMOVE_OBJECT_BINDING));
  };

  completeRemoveObjectTable = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, REMOVE_OBJECT_TABLE));
  };

  completeRemoveObjectStore = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, REMOVE_OBJECT_STORE));
  };

  completeCheckObjectStatus = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, CHECK_OBJECT_STATUS));
  };

  completeClearCrosstabHeaders = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, CLEAR_CROSSTAB_HEADERS));
  };

  completeClearTableData = (objectWorkingId, nextOperation, objectList) => {
    if (!(nextOperation && nextOperation.operationType === CLEAR_DATA_OPERATION) && objectList.length !== 0) {
      const { dispatch } = this.reduxStore;
      toggleSecuredFlag(true)(dispatch);
    }
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, CLEAR_TABLE_DATA));
  };

  updateOperation = (updatedOperationProps) => {
    this.reduxStore.dispatch(updateOperation(updatedOperationProps));
  };

  updateObject = (updatedObject) => {
    this.reduxStore.dispatch(updateObject(updatedObject));
  };

  moveNotificationToInProgress = (objectWorkingId) => {
    this.reduxStore.dispatch({ type: MOVE_NOTIFICATION_TO_IN_PROGRESS, payload: { objectWorkingId } });
  }

  completeMoveNotificationToInProgress = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, MOVE_NOTIFICATION_TO_IN_PROGRESS));
  }

  displaySuccessNotification = (objectWorkingId) => {
    this.reduxStore.dispatch({ type: DISPLAY_NOTIFICATION_COMPLETED, payload: { objectWorkingId } });
  }

  completeDisplaySuccessNotification = (objectWorkingId) => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, DISPLAY_NOTIFICATION_COMPLETED));
  }
}

const operationStepDispatcher = new OperationStepDispatcher();
export default operationStepDispatcher;
