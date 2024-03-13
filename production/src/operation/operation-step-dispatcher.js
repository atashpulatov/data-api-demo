import { updateObject } from '../redux-reducer/object-reducer/object-actions';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import {
  markStepCompleted,
  updateOperation,
} from '../redux-reducer/operation-reducer/operation-actions';
import {
  ADD_VISUALIZATION_PLACEHOLDER,
  BACKUP_OBJECT_DATA,
  BIND_OFFICE_TABLE,
  CHECK_OBJECT_STATUS,
  CLEAR_CROSSTAB_HEADERS,
  CLEAR_TABLE_DATA,
  COMPLETE_CLEAR_DATA,
  DISPLAY_NOTIFICATION_COMPLETED,
  FETCH_INSERT_DATA,
  FORMAT_DATA,
  FORMAT_OFFICE_TABLE,
  FORMAT_SUBTOTALS,
  GET_DUPLICATE_NAME,
  GET_INSTANCE_DEFINITION,
  GET_OBJECT_DETAILS,
  GET_OFFICE_TABLE_EDIT_REFRESH,
  GET_OFFICE_TABLE_IMPORT,
  HIGHLIGHT_OBJECT,
  MANIPULATE_VISUALIZATION_IMAGE,
  MODIFY_OBJECT,
  MOVE_NOTIFICATION_TO_IN_PROGRESS,
  REMOVE_OBJECT_BINDING,
  REMOVE_OBJECT_TABLE,
  REMOVE_VISUALIZATION_IMAGE,
  RENAME_EXCEL_WORKSHEET,
  SAVE_IMAGE_DETAILS,
  SAVE_OBJECT_IN_EXCEL,
} from './operation-steps';
import { CLEAR_DATA_OPERATION } from './operation-type-names';

class OperationStepDispatcher {
  init = reduxStore => {
    this.reduxStore = reduxStore;
  };

  completeBindOfficeTable = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, BIND_OFFICE_TABLE));
  };

  completeFormatData = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, FORMAT_DATA));
  };

  completeBackupObjectData = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, BACKUP_OBJECT_DATA));
  };

  completeGetInstanceDefinition = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, GET_INSTANCE_DEFINITION));
  };

  completeGetObjectDetails = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, GET_OBJECT_DETAILS));
  };

  completeFormatOfficeTable = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, FORMAT_OFFICE_TABLE));
  };

  completeFetchInsertData = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, FETCH_INSERT_DATA));
  };

  completeGetOfficeTableEditRefresh = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, GET_OFFICE_TABLE_EDIT_REFRESH));
  };

  completeGetOfficeTableImport = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, GET_OFFICE_TABLE_IMPORT));
  };

  completeFormatSubtotals = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, FORMAT_SUBTOTALS));
  };

  completeSaveObjectInExcel = objectWorkingId => {
    // for success
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, SAVE_OBJECT_IN_EXCEL));
  };

  completeModifyObject = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, MODIFY_OBJECT));
  };

  completeGetDuplicateName = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, GET_DUPLICATE_NAME));
  };

  completeRemoveObjectBinding = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, REMOVE_OBJECT_BINDING));
  };

  completeRemoveObjectTable = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, REMOVE_OBJECT_TABLE));
  };

  completeCheckObjectStatus = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, CHECK_OBJECT_STATUS));
  };

  completeClearCrosstabHeaders = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, CLEAR_CROSSTAB_HEADERS));
  };

  completeClearTableData = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, CLEAR_TABLE_DATA));
  };

  completeClearData = (objectWorkingId, nextOperation, objectList) => {
    if (
      !(nextOperation && nextOperation.operationType === CLEAR_DATA_OPERATION) &&
      objectList.length !== 0
    ) {
      const { dispatch } = this.reduxStore;
      officeActions.toggleSecuredFlag(true)(dispatch);
    }
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, COMPLETE_CLEAR_DATA));
  };

  completeHighlightObject = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, HIGHLIGHT_OBJECT));
  };

  updateOperation = updatedOperationProps => {
    this.reduxStore.dispatch(updateOperation(updatedOperationProps));
  };

  updateObject = updatedObject => {
    this.reduxStore.dispatch(updateObject(updatedObject));
  };

  moveNotificationToInProgress = objectWorkingId => {
    this.reduxStore.dispatch({
      type: MOVE_NOTIFICATION_TO_IN_PROGRESS,
      payload: { objectWorkingId },
    });
  };

  completeMoveNotificationToInProgress = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, MOVE_NOTIFICATION_TO_IN_PROGRESS));
  };

  displaySuccessNotification = objectWorkingId => {
    this.reduxStore.dispatch({
      type: DISPLAY_NOTIFICATION_COMPLETED,
      payload: { objectWorkingId },
    });
  };

  completeDisplaySuccessNotification = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, DISPLAY_NOTIFICATION_COMPLETED));
  };

  completeRenameExcelWorksheet = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, RENAME_EXCEL_WORKSHEET));
  };

  completeManipulateVisualizationImage = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, MANIPULATE_VISUALIZATION_IMAGE));
  };

  completeRemoveVisualizationImage = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, REMOVE_VISUALIZATION_IMAGE));
  };

  completeAddVisualizationPlaceholder = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, ADD_VISUALIZATION_PLACEHOLDER));
  };

  completeSaveImageDetails = objectWorkingId => {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, SAVE_IMAGE_DETAILS));
  };
}

const operationStepDispatcher = new OperationStepDispatcher();
export default operationStepDispatcher;
