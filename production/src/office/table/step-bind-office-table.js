import { officeApiHelper } from '../api/office-api-helper';

import { BIND_OFFICE_TABLE } from '../../operation/operation-steps';
import { markStepCompleted } from '../../operation/operation-actions';

class StepBindOfficeTable {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  bindOfficeTable = async (ObjectData) => {
    const {
      newBindingId,
      excelContext,
      officeTable,
      objectWorkingId
    } = ObjectData;

    officeTable.load('name');
    await excelContext.sync();
    const tablename = officeTable.name;
    await officeApiHelper.bindNamedItem(tablename, newBindingId);

    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, BIND_OFFICE_TABLE));
  };
}

const stepBindOfficeTable = new StepBindOfficeTable();
export default stepBindOfficeTable;
