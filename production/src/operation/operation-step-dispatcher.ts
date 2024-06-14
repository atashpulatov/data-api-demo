import officeStoreHelper from '../office/store/office-store-helper';

import { reduxStore } from '../store';

import { NotificationActionTypes } from '../redux-reducer/notification-reducer/notification-reducer-types';

import { updateObject } from '../redux-reducer/object-reducer/object-actions';
import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import {
  markStepCompleted,
  updateOperation,
} from '../redux-reducer/operation-reducer/operation-actions';
import { OperationSteps } from './operation-steps';
import { OperationTypes } from './operation-type-names';
import { OfficeSettingsEnum } from '../constants/office-constants';

class OperationStepDispatcher {
  completeBindOfficeTable(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.BIND_OFFICE_TABLE));
  }

  completeFormatData(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.FORMAT_DATA));
  }

  completeFormatHyperlinks(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.FORMAT_HYPERLINKS));
  }

  completeBackupObjectData(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.BACKUP_OBJECT_DATA));
  }

  completeGetInstanceDefinition(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.GET_INSTANCE_DEFINITION));
  }

  completeGetObjectDetails(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.GET_OBJECT_DETAILS));
  }

  completeGetObjectSettings(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.GET_OBJECT_SETTINGS));
  }

  completeFormatOfficeTable(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.FORMAT_OFFICE_TABLE));
  }

  completeFetchInsertData(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.FETCH_INSERT_DATA));
  }

  completeGetOfficeTableEditRefresh(objectWorkingId: number): void {
    reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH)
    );
  }

  completeGetOfficeTableImport(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.GET_OFFICE_TABLE_IMPORT));
  }

  completeGetFormattedDataTableImport(objectWorkingId: number): void {
    reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.GET_FORMATTED_DATA_TABLE_IMPORT)
    );
  }

  completeGetDefaultOfficeTableTemplateEditRefresh(objectWorkingId: number): void {
    reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.GET_FORMATTED_DATA_TABLE_EDIT_REFRESH)
    );
  }

  completeFormatSubtotals(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.FORMAT_SUBTOTALS));
  }

  completeSaveObjectInExcel(objectWorkingId: number): void {
    // for success
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.SAVE_OBJECT_IN_EXCEL));
  }

  completeModifyObject(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.MODIFY_OBJECT));
  }

  completeGetDuplicateName(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.GET_DUPLICATE_NAME));
  }

  completeRemoveObjectBinding(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.REMOVE_OBJECT_BINDING));
  }

  completeRemoveObjectTable(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.REMOVE_OBJECT_TABLE));
  }

  completeRemoveObjectDetails(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.REMOVE_OBJECT_DETAILS));
  }

  completeRemoveWorksheet(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.REMOVE_WORKSHEET));
  }

  completeCheckObjectStatus(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.CHECK_OBJECT_STATUS));
  }

  completeClearCrosstabHeaders(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.CLEAR_CROSSTAB_HEADERS));
  }

  completeClearTableData(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.CLEAR_TABLE_DATA));
  }

  completeClearData(objectWorkingId: number, nextOperation: any, objectList: any[]): void {
    if (
      nextOperation?.operationType !== OperationTypes.CLEAR_DATA_OPERATION &&
      objectList.length !== 0
    ) {
      const { dispatch } = reduxStore;
      officeActions.toggleSecuredFlag(true)(dispatch);
      officeStoreHelper.setPropertyValue(OfficeSettingsEnum.isSecured, true);
    }
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.COMPLETE_CLEAR_DATA));
  }

  completeHighlightObject(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.HIGHLIGHT_OBJECT));
  }

  updateOperation(updatedOperationProps: any): void {
    reduxStore.dispatch(updateOperation(updatedOperationProps));
  }

  updateObject(updatedObject: any): void {
    reduxStore.dispatch(updateObject(updatedObject));
  }

  moveNotificationToInProgress(objectWorkingId: number, operationId: string): void {
    reduxStore.dispatch({
      type: NotificationActionTypes.MOVE_NOTIFICATION_TO_IN_PROGRESS,
      payload: { objectWorkingId, operationId },
    });
  }

  completeMoveNotificationToInProgress(objectWorkingId: number): void {
    reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS)
    );
  }

  completeDisplaySuccessNotification(objectWorkingId: number): void {
    reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.DISPLAY_NOTIFICATION_COMPLETED)
    );
  }

  completeRenameExcelWorksheet(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.RENAME_EXCEL_WORKSHEET));
  }

  completeManipulateVisualizationImage(objectWorkingId: number): void {
    reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.MANIPULATE_VISUALIZATION_IMAGE)
    );
  }

  completeRemoveVisualizationImage(objectWorkingId: number): void {
    reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.REMOVE_VISUALIZATION_IMAGE)
    );
  }

  completeAddVisualizationPlaceholder(objectWorkingId: number): void {
    reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.ADD_VISUALIZATION_PLACEHOLDER)
    );
  }

  completeSaveImageDetails(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.SAVE_IMAGE_DETAILS));
  }

  completeCreatePivotTable(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.CREATE_PIVOT_TABLE));
  }

  completeExportExcelToCurrentWorkbook(objectWorkingId: number): void {
    reduxStore.dispatch(
      markStepCompleted(objectWorkingId, OperationSteps.EXPORT_EXCEL_TO_CURRENT_WORKBOOK)
    );
  }

  completeMoveFormattedDataFromExportedToTargetWorkSheet(objectWorkingId: number): void {
    reduxStore.dispatch(
      markStepCompleted(
        objectWorkingId,
        OperationSteps.MOVE_FORMATTED_DATA_FROM_EXPORTED_TO_TARGET_WORKSHEET
      )
    );
  }

  completeRemovePivotTable(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.REMOVE_PIVOT_TABLE));
  }

  completeRefreshPivotTable(objectWorkingId: number): void {
    reduxStore.dispatch(markStepCompleted(objectWorkingId, OperationSteps.REFRESH_PIVOT_TABLE));
  }
}

const operationStepDispatcher = new OperationStepDispatcher();
export default operationStepDispatcher;
