import stepGetInstanceDefinition from '../mstr-object/step-get-instance-definition';
import stepApplyFormatting from '../office/format/step-apply-formatting';
import stepFormatTable from '../office/format/step-format-table';
import stepFetchInsertDataIntoExcel from '../office/import/step-fetch-insert-data-into-excel';
import stepBindOfficeTable from '../office/table/step-bind-office-table';
import stepGetOfficeTableEditRefresh from '../office/table/step-get-office-table-edit-refresh';
import stepGetOfficeTableImport from '../office/table/step-get-office-table-import';
import stepModifyObject from '../popup/step-modify-object';
import stepApplySubtotalFormatting from '../office/format/step-apply-subtotal-formatting';
import stepSaveObjectInExcel from '../office/store/step-save-object-in-excel';

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
  REMOVE_OBJECT_BINDING,
  REMOVE_OBJECT_TABLE,
  REMOVE_OBJECT_STORE
} from './operation-steps';
import stepRemoveObjectBinding from '../office/remove/step-remove-object-binding';
import stepRemoveObjectTable from '../office/remove/step-remove-object-table';
import stepRemoveObjectStore from '../office/remove/step-remove-object-store';

class SubscribeSteps {
  init = (reduxStore, operationBus) => {
    this.reduxStore = reduxStore;

    operationBus.subscribe(MODIFY_OBJECT, stepModifyObject.modifyObject);

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
    operationBus.subscribe(SAVE_OBJECT_IN_EXCEL, stepSaveObjectInExcel.saveObject);

    operationBus.subscribe(REMOVE_OBJECT_BINDING, stepRemoveObjectBinding.removeObjectBinding);
    operationBus.subscribe(REMOVE_OBJECT_TABLE, stepRemoveObjectTable.removeObjectTable);
    operationBus.subscribe(REMOVE_OBJECT_STORE, stepRemoveObjectStore.removeObjectStore);
  };
}

const subscribeSteps = new SubscribeSteps();
export default subscribeSteps;
