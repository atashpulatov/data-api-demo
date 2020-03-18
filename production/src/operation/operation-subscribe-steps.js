import stepGetInstanceDefinition from '../mstr-object/step-get-instance-definition';
import stepApplyFormatting from '../office/format/step-apply-formatting';
import stepFormatTable from '../office/format/step-format-table';
import stepFetchInsertDataIntoExcel from '../office/import/step-fetch-insert-data-into-excel';
import stepBindOfficeTable from '../office/table/step-bind-office-table';
import stepGetOfficeTableEditRefresh from '../office/table/step-get-office-table-edit-refresh';
import stepGetOfficeTableImport from '../office/table/step-get-office-table-import';
import stepModifyObject from '../popup/step-modify-object';
import stepApplySubtotalFormatting from '../office/format/step-apply-subtotal-formatting';
import stepSaveObject from '../office/store/step-save-object';

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
  SAVE_OBJECT_IN_EXCEL
} from './operation-steps';

class SubscribeSteps {
  init = (reduxStore, operationBus) => {
    this.reduxStore = reduxStore;

    operationBus.subscribe(MODIFY_OBJECT, stepModifyObject.ModifyObject);

    operationBus.subscribe(GET_INSTANCE_DEFINITION, stepGetInstanceDefinition.getInstanceDefinition);

    operationBus.subscribe(GET_OFFICE_TABLE_IMPORT, stepGetOfficeTableImport.getOfficeTableImport);
    operationBus.subscribe(GET_OFFICE_TABLE_EDIT_REFRESH, stepGetOfficeTableEditRefresh.getOfficeTableEditRefresh);

    operationBus.subscribe(FORMAT_DATA, stepApplyFormatting.applyFormatting);

    operationBus.subscribe(FORMAT_OFFICE_TABLE, stepFormatTable.formatTable);

    operationBus.subscribe(FETCH_INSERT_DATA, stepFetchInsertDataIntoExcel.fetchInsertDataIntoExcel);

    operationBus.subscribe(FORMAT_SUBTOTALS, stepApplySubtotalFormatting.applySubtotalFormattingRedux);

    operationBus.subscribe(BIND_OFFICE_TABLE, stepBindOfficeTable.bindOfficeTable);
    // operationBus.subscribe(SAVE_OBJECT_IN_EXCEL, officeStoreService.saveObjectsInExcelStore);
    // TODO: remove below after refactor
    operationBus.subscribe(SAVE_OBJECT_IN_EXCEL, stepSaveObject.SaveObject);
  };
}

const subscribeSteps = new SubscribeSteps();
export default subscribeSteps;
