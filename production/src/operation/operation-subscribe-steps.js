import stepBackupObjectData from '../office/backup-object-data/step-backup-object-data';
import stepGetObjectDetails from '../mstr-object/step-get-object-details';
import stepApplyFormatting from '../office/format/step-apply-formatting';
import stepFormatTable from '../office/format/step-format-table';
import stepFetchInsertDataIntoExcel from '../office/import/step-fetch-insert-data-into-excel';
import stepBindOfficeTable from '../office/table/step-bind-office-table';
import stepGetOfficeTableEditRefresh from '../office/table/step-get-office-table-edit-refresh';
import stepGetOfficeTableImport from '../office/table/step-get-office-table-import';
import stepModifyObject from '../popup/step-modify-object';
import stepApplySubtotalFormatting from '../office/format/step-apply-subtotal-formatting';
import stepSaveObjectInExcel from '../office/store/step-save-object-in-excel';
import stepGetDuplicateName from '../office/step-get-duplicate-name';
import stepRemoveObjectBinding from '../office/remove/step-remove-object-binding';
import stepRemoveObjectTable from '../office/remove/step-remove-object-table';
import stepCheckObjectStatus from '../office/clear-data/step-check-object-status';
import stepClearCrosstabHeaders from '../office/clear-data/step-clear-crosstab-headers';
import stepClearTableData from '../office/clear-data/step-clear-table-data';
import stepNotificationInProgress from '../notification-v2/step-notification-in-progress';
import stepDisplayNotificationCompleted from '../notification-v2/step-display-notification-completed';
import stepCompleteClearData from '../office/clear-data/step-complete-clear-data';
import stepRenameExcelWorksheet from '../office/step-rename-excel-worksheet';

import {
  BIND_OFFICE_TABLE,
  FETCH_INSERT_DATA,
  FORMAT_DATA,
  FORMAT_OFFICE_TABLE,
  FORMAT_SUBTOTALS,
  GET_INSTANCE_DEFINITION,
  GET_OBJECT_DETAILS,
  GET_OFFICE_TABLE_EDIT_REFRESH,
  GET_OFFICE_TABLE_IMPORT,
  MODIFY_OBJECT,
  SAVE_OBJECT_IN_EXCEL,
  GET_DUPLICATE_NAME,
  REMOVE_OBJECT_BINDING,
  REMOVE_OBJECT_TABLE,
  CHECK_OBJECT_STATUS,
  CLEAR_CROSSTAB_HEADERS,
  CLEAR_TABLE_DATA,
  MOVE_NOTIFICATION_TO_IN_PROGRESS,
  DISPLAY_NOTIFICATION_COMPLETED,
  BACKUP_OBJECT_DATA,
  COMPLETE_CLEAR_DATA,
  HIGHLIGHT_OBJECT,
  RENAME_EXCEL_WORKSHEET,
  REFRESH_VISUALIZATION_IMAGE,
  REMOVE_VISUALIZATION_IMAGE,
  SAVE_IMAGE_DETAILS
} from './operation-steps';
import stepHighlightObject from '../office/highlight/step-highlight-object';
import stepGetInstanceDefinition from '../mstr-object/instance/step-get-instance-definition';
import stepRefreshVisualizationImage from '../office/shapes/step-refresh-visualization-image';
import stepRemoveVisualizationImage from '../office/shapes/step-remove-visualization-image';
import stepSaveImageDetails from '../office/shapes/step-save-image-details';

class SubscribeSteps {
  init = (reduxStore, operationBus) => {
    this.reduxStore = reduxStore;

    operationBus.subscribe(MODIFY_OBJECT, stepModifyObject.modifyObject);

    operationBus.subscribe(BACKUP_OBJECT_DATA, stepBackupObjectData.backupObjectData);

    operationBus.subscribe(GET_INSTANCE_DEFINITION, stepGetInstanceDefinition.getInstanceDefinition);
    operationBus.subscribe(GET_OBJECT_DETAILS, stepGetObjectDetails.getObjectDetails);

    operationBus.subscribe(GET_OFFICE_TABLE_IMPORT, stepGetOfficeTableImport.getOfficeTableImport);
    operationBus.subscribe(GET_OFFICE_TABLE_EDIT_REFRESH, stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh);

    operationBus.subscribe(FORMAT_DATA, stepApplyFormatting.applyFormatting);

    operationBus.subscribe(FORMAT_OFFICE_TABLE, stepFormatTable.formatTable);

    operationBus.subscribe(FETCH_INSERT_DATA, stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel);

    operationBus.subscribe(FORMAT_SUBTOTALS, stepApplySubtotalFormatting.applySubtotalFormattingRedux);

    operationBus.subscribe(BIND_OFFICE_TABLE, stepBindOfficeTable.bindOfficeTable);

    operationBus.subscribe(SAVE_OBJECT_IN_EXCEL, stepSaveObjectInExcel.saveObject);

    operationBus.subscribe(GET_DUPLICATE_NAME, stepGetDuplicateName.getDuplicateName);

    operationBus.subscribe(REMOVE_OBJECT_BINDING, stepRemoveObjectBinding.removeObjectBinding);
    operationBus.subscribe(REMOVE_OBJECT_TABLE, stepRemoveObjectTable.removeObjectTable);

    operationBus.subscribe(HIGHLIGHT_OBJECT, stepHighlightObject.highlightObject);

    operationBus.subscribe(CHECK_OBJECT_STATUS, stepCheckObjectStatus.checkObjectStatus);
    operationBus.subscribe(CLEAR_CROSSTAB_HEADERS, stepClearCrosstabHeaders.clearCrosstabHeaders);
    operationBus.subscribe(CLEAR_TABLE_DATA, stepClearTableData.clearTableData);
    operationBus.subscribe(COMPLETE_CLEAR_DATA, stepCompleteClearData.completeClearData);

    operationBus.subscribe(MOVE_NOTIFICATION_TO_IN_PROGRESS, stepNotificationInProgress.moveNotificationToInProgress);
    operationBus.subscribe(
      DISPLAY_NOTIFICATION_COMPLETED,
      stepDisplayNotificationCompleted.displayNotificationCompleted
    );

    operationBus.subscribe(RENAME_EXCEL_WORKSHEET, stepRenameExcelWorksheet.renameExcelWorksheet);

    // shape steps
    operationBus.subscribe(REFRESH_VISUALIZATION_IMAGE, stepRefreshVisualizationImage.refreshVisualizationImage);
    operationBus.subscribe(REMOVE_VISUALIZATION_IMAGE, stepRemoveVisualizationImage.removeVisualizationImage);
    operationBus.subscribe(SAVE_IMAGE_DETAILS, stepSaveImageDetails.saveImageDetails);
  };
}

const subscribeSteps = new SubscribeSteps();
export default subscribeSteps;
