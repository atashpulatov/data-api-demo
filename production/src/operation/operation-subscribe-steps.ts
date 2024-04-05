import stepSaveObjectInExcel from '../office/store/step-save-object-in-excel';

import stepGetInstanceDefinition from '../mstr-object/instance/step-get-instance-definition';
import stepGetObjectDetails from '../mstr-object/step-get-object-details';
import stepDisplayNotificationCompleted from '../notification/step-display-notification-completed';
import stepNotificationInProgress from '../notification/step-notification-in-progress';
import stepBackupObjectData from '../office/backup-object-data/step-backup-object-data';
import stepCheckObjectStatus from '../office/clear-data/step-check-object-status';
import stepClearCrosstabHeaders from '../office/clear-data/step-clear-crosstab-headers';
import stepClearTableData from '../office/clear-data/step-clear-table-data';
import stepCompleteClearData from '../office/clear-data/step-complete-clear-data';
import stepApplyFormatting from '../office/format/step-apply-formatting';
import stepApplySubtotalFormatting from '../office/format/step-apply-subtotal-formatting';
import stepFormatTable from '../office/format/step-format-table';
import stepHighlightObject from '../office/highlight/step-highlight-object';
import stepFetchInsertDataIntoExcel from '../office/import/step-fetch-insert-data-into-excel';
import stepRemoveObjectBinding from '../office/remove/step-remove-object-binding';
import stepRemoveObjectTable from '../office/remove/step-remove-object-table';
import stepAddVisualizationPlaceholder from '../office/shapes/step-add-visualization-placeholder';
import stepManipulateVisualizationImage from '../office/shapes/step-manipulate-visualization-image';
import stepRemoveVisualizationImage from '../office/shapes/step-remove-visualization-image';
import stepSaveImageDetails from '../office/shapes/step-save-image-details';
import stepGetDuplicateName from '../office/step-get-duplicate-name';
import stepRenameExcelWorksheet from '../office/step-rename-excel-worksheet';
import stepBindOfficeTable from '../office/table/step-bind-office-table';
import stepGetOfficeTableEditRefresh from '../office/table/step-get-office-table-edit-refresh';
import stepGetOfficeTableImport from '../office/table/step-get-office-table-import';
import stepModifyObject from '../popup/step-modify-object';
import { OperationSteps } from './operation-steps';

class SubscribeSteps {
  init = (operationBus: any): void => {
    operationBus.subscribe(OperationSteps.MODIFY_OBJECT, stepModifyObject.modifyObject);

    operationBus.subscribe(
      OperationSteps.BACKUP_OBJECT_DATA,
      stepBackupObjectData.backupObjectData
    );

    operationBus.subscribe(
      OperationSteps.GET_INSTANCE_DEFINITION,
      stepGetInstanceDefinition.getInstanceDefinition
    );
    operationBus.subscribe(
      OperationSteps.GET_OBJECT_DETAILS,
      stepGetObjectDetails.getObjectDetails
    );

    operationBus.subscribe(
      OperationSteps.GET_OFFICE_TABLE_IMPORT,
      stepGetOfficeTableImport.getOfficeTableImport
    );
    operationBus.subscribe(
      OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH,
      stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh
    );

    operationBus.subscribe(OperationSteps.FORMAT_DATA, stepApplyFormatting.applyFormatting);

    operationBus.subscribe(OperationSteps.FORMAT_OFFICE_TABLE, stepFormatTable.formatTable);

    operationBus.subscribe(
      OperationSteps.FETCH_INSERT_DATA,
      stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel
    );

    operationBus.subscribe(
      OperationSteps.FORMAT_SUBTOTALS,
      stepApplySubtotalFormatting.applySubtotalFormattingRedux
    );

    operationBus.subscribe(OperationSteps.BIND_OFFICE_TABLE, stepBindOfficeTable.bindOfficeTable);

    operationBus.subscribe(OperationSteps.SAVE_OBJECT_IN_EXCEL, stepSaveObjectInExcel.saveObject);

    operationBus.subscribe(
      OperationSteps.GET_DUPLICATE_NAME,
      stepGetDuplicateName.getDuplicateName
    );

    operationBus.subscribe(
      OperationSteps.REMOVE_OBJECT_BINDING,
      stepRemoveObjectBinding.removeObjectBinding
    );
    operationBus.subscribe(
      OperationSteps.REMOVE_OBJECT_TABLE,
      stepRemoveObjectTable.removeObjectTable
    );

    operationBus.subscribe(OperationSteps.HIGHLIGHT_OBJECT, stepHighlightObject.highlightObject);

    operationBus.subscribe(
      OperationSteps.CHECK_OBJECT_STATUS,
      stepCheckObjectStatus.checkObjectStatus
    );
    operationBus.subscribe(
      OperationSteps.CLEAR_CROSSTAB_HEADERS,
      stepClearCrosstabHeaders.clearCrosstabHeaders
    );
    operationBus.subscribe(OperationSteps.CLEAR_TABLE_DATA, stepClearTableData.clearTableData);
    operationBus.subscribe(
      OperationSteps.COMPLETE_CLEAR_DATA,
      stepCompleteClearData.completeClearData
    );

    operationBus.subscribe(
      OperationSteps.MOVE_NOTIFICATION_TO_IN_PROGRESS,
      stepNotificationInProgress.moveNotificationToInProgress
    );
    operationBus.subscribe(
      OperationSteps.DISPLAY_NOTIFICATION_COMPLETED,
      stepDisplayNotificationCompleted.displayNotificationCompleted
    );

    operationBus.subscribe(
      OperationSteps.RENAME_EXCEL_WORKSHEET,
      stepRenameExcelWorksheet.renameExcelWorksheet
    );

    // shape steps
    operationBus.subscribe(
      OperationSteps.MANIPULATE_VISUALIZATION_IMAGE,
      stepManipulateVisualizationImage.manipulateVisualizationImage
    );
    operationBus.subscribe(
      OperationSteps.REMOVE_VISUALIZATION_IMAGE,
      stepRemoveVisualizationImage.removeVisualizationImage
    );

    operationBus.subscribe(
      OperationSteps.ADD_VISUALIZATION_PLACEHOLDER,
      stepAddVisualizationPlaceholder.addVisualizationPlaceholder
    );

    operationBus.subscribe(
      OperationSteps.SAVE_IMAGE_DETAILS,
      stepSaveImageDetails.saveImageDetails
    );
  };
}

const subscribeSteps = new SubscribeSteps();
export default subscribeSteps;