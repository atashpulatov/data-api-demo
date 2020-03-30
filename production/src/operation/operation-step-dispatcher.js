import { markStepCompleted, updateOperation } from './operation-actions';
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
} from './operation-steps';
import { updateObject } from './object-actions';

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

  completeSaveObjectInExcel = (objectWorkingId) => {
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

  updateOperation = (updatedOperation) => {
    this.reduxStore.dispatch(updateOperation(updatedOperation));
  };

  updateObject = (updatedObject) => {
    this.reduxStore.dispatch(updateObject(updatedObject));
  };
}

const operationStepDispatcher = new OperationStepDispatcher();
export default operationStepDispatcher;
