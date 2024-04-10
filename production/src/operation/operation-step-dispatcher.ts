import { updateObject } from '../redux-reducer/object-reducer/object-actions';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import {
  markStepCompleted,
  updateOperation,
} from '../redux-reducer/operation-reducer/operation-actions';
import { OperationSteps } from './operation-steps';
import { OperationTypes } from './operation-type-names';

class OperationStepDispatcher {
  private reduxStore: any;

  init = (reduxStore: any): void => {
    this.reduxStore = reduxStore;
  };

  completeBindOfficeTable(objectWorkingId: number): void {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.BIND_OFFICE_TABLE));
  }

  completeFormatData(objectWorkingId: number): void {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.FORMAT_DATA));
  }

  completeBackupObjectData(objectWorkingId: number): void {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.BACKUP_OBJECT_DATA));
  }

  completeGetInstanceDefinition(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.GET_INSTANCE_DEFINITION)
    );
  }

  completeGetObjectDetails(objectWorkingId: number): void {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.GET_OBJECT_DETAILS));
  }

  completeGetObjectSettings(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.GET_OBJECT_SETTINGS)
    );
  }

  completeFormatOfficeTable(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.FORMAT_OFFICE_TABLE)
    );
  }

  completeFetchInsertData(objectWorkingId: number): void {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.FETCH_INSERT_DATA));
  }

  completeGetOfficeTableEditRefresh(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH)
    );
  }

  completeGetOfficeTableImport(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.GET_OFFICE_TABLE_IMPORT)
    );
  }

  completeFormatSubtotals(objectWorkingId: number): void {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.FORMAT_SUBTOTALS));
  }

  completeSaveObjectInExcel(objectWorkingId: number): void {
    // for success
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.SAVE_OBJECT_IN_EXCEL)
    );
  }

  completeModifyObject(objectWorkingId: number): void {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.MODIFY_OBJECT));
  }

  completeGetDuplicateName(objectWorkingId: number): void {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.GET_DUPLICATE_NAME));
  }

  completeRemoveObjectBinding(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.REMOVE_OBJECT_BINDING)
    );
  }

  completeRemoveObjectTable(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.REMOVE_OBJECT_TABLE)
    );
  }

  completeCheckObjectStatus(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.CHECK_OBJECT_STATUS)
    );
  }

  completeClearCrosstabHeaders(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.CLEAR_CROSSTAB_HEADERS)
    );
  }

  completeClearTableData(objectWorkingId: number): void {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.CLEAR_TABLE_DATA));
  }

  completeClearData(objectWorkingId: number, nextOperation: any, objectList: any[]): void {
    if (
      nextOperation?.operationType !== OperationTypes.CLEAR_DATA_OPERATION &&
      objectList.length !== 0
    ) {
      const { dispatch } = this.reduxStore;
      officeActions.toggleSecuredFlag(true)(dispatch);
    }
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.COMPLETE_CLEAR_DATA)
    );
  }

  completeHighlightObject(objectWorkingId: number): void {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.HIGHLIGHT_OBJECT));
  }

  updateOperation(updatedOperationProps: any): void {
    this.reduxStore.dispatch(updateOperation(updatedOperationProps));
  }

  updateObject(updatedObject: any): void {
    this.reduxStore.dispatch(updateObject(updatedObject));
  }

  moveNotificationToInProgress(objectWorkingId: number): void {
    this.reduxStore.dispatch({
      type: OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
      payload: { objectWorkingId },
    });
  }

  completeMoveNotificationToInProgress(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS)
    );
  }

  displaySuccessNotification(objectWorkingId: number): void {
    this.reduxStore.dispatch({
      type: OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
      payload: { objectWorkingId },
    });
  }

  completeDisplaySuccessNotification(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.DISPLAY_NOTIFICATION_COMPLETED)
    );
  }

  completeRenameExcelWorksheet(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.RENAME_EXCEL_WORKSHEET)
    );
  }

  completeManipulateVisualizationImage(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.MANIPULATE_VISUALIZATION_IMAGE)
    );
  }

  completeRemoveVisualizationImage(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.REMOVE_VISUALIZATION_IMAGE)
    );
  }

  completeAddVisualizationPlaceholder(objectWorkingId: number): void {
    this.reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.ADD_VISUALIZATION_PLACEHOLDER)
    );
  }

  completeSaveImageDetails(objectWorkingId: number): void {
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.SAVE_IMAGE_DETAILS));
  }
}

const operationStepDispatcher = new OperationStepDispatcher();
export default operationStepDispatcher;
