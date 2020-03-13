import officeTableCreate from './office-table-create';
import officeTableRefresh from './office-table-refresh';
import { officeApiHelper } from '../api/office-api-helper';

import { GET_OFFICE_TABLE, BIND_OFFICE_TABLE } from '../../operation/operation-steps';
import { markStepCompleted } from '../../operation/operation-actions';
import { updateObject } from '../../operation/object-actions';

class OfficeTableService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  /**
   * Creates an office table if it's a new import or if the number of columns of an existing table changes.
   * If we are refreshing a table and the new definiton range is not empty we keep the original table.
   *
   * @param {boolean} isRefresh
   * @param {Object} excelContext
   * @param {string} bindingId
   * @param {Object} instanceDefinition
   * @param {string} startCell  Top left corner cell
   *
   */
  getOfficeTable = async (objectData) => {
    try {
      console.time('Create or get table');
      const {
        isRefresh,
        excelContext,
        bindingId,
        instanceDefinition,
        tableName,
        previousTableDimensions,
        visualizationInfo,
        objectWorkingId,
      } = objectData;
      let { startCell } = objectData;

      let newBindingId;
      const { mstrTable } = instanceDefinition;

      const newOfficeTableName = this.createTableName(mstrTable, tableName);

      this.checkReportTypeChange(instanceDefinition);

      let officeTable;
      let shouldFormat = true;
      let tableColumnsChanged = false;

      if (isRefresh) {
        ({
          tableColumnsChanged,
          startCell,
          officeTable,
          shouldFormat,
          newBindingId
        } = await officeTableRefresh.changeOfficeTableOnRefresh(
          {
            excelContext,
            bindingId,
            instanceDefinition,
            startCell,
            newOfficeTableName,
            shouldFormat,
            previousTableDimensions,
            visualizationInfo
          }
        ));
      } else {
        ({ officeTable, newBindingId } = await officeTableCreate.createOfficeTable(
          {
            instanceDefinition,
            excelContext,
            startCell,
            newOfficeTableName
          }
        ));
      }
      console.timeEnd('Create or get table');

      const updatedObject = {
        objectWorkingId,
        officeTable,
        newOfficeTableName,
        shouldFormat,
        tableColumnsChanged,
        newBindingId,
        instanceDefinition,
      };

      this.reduxStore.dispatch(updateObject(updatedObject));
      this.reduxStore.dispatch(markStepCompleted(objectWorkingId, GET_OFFICE_TABLE));
    } catch (error) {
      console.log('error:', error);
    }
  }

  /**
   * Checks if the report changes to or from crosstab
   *
   * @param {Object} instanceDefinition
   *
   */
  checkReportTypeChange=(instanceDefinition) => {
    const { mstrTable, mstrTable: { prevCrosstabDimensions, isCrosstab } } = instanceDefinition;
    mstrTable.toCrosstabChange = !prevCrosstabDimensions && isCrosstab;
    mstrTable.fromCrosstabChange = prevCrosstabDimensions && !isCrosstab;
  }

  /**
   * TODO Do JSDOC in all refatored files
   *
   * @param {Object} instanceDefinition
   *
   */
  createTableName = (mstrTable, tableName) => {
    if (tableName) {
      return tableName;
    }
    const excelCompatibleTableName = mstrTable.name.replace(/(\.|•|‼| |!|#|\$|%|&|'|\(|\)|\*|\+|,|-|\/|:|;|<|=|>|@|\^|`|\{|\||\}|~|¢|£|¥|¬|«|»)/g, '_');
    return `_${excelCompatibleTableName.slice(0, 239)}_${Date.now().toString()}`;
  }

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
  }
}
const officeTableService = new OfficeTableService();
export default officeTableService;
