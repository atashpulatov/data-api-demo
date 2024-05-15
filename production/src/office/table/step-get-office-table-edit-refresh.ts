import {
  getObjectDetailsRange,
  insertAndFormatObjectDetails,
} from '../../mstr-object/object-info-helper';
import getOfficeTableHelper from './get-office-table-helper';

import { reduxStore } from '../../store';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import {
  calculateOffsetForObjectInfoSettings,
  getTableOperationAndStartCell,
} from '../../mstr-object/get-object-details-methods';
import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeTableCreate from './office-table-create';
import officeTableRefresh from './office-table-refresh';
import officeTableUpdate from './office-table-update';
import { ObjectImportType } from '../../mstr-object/constants';

class StepGetOfficeTableEditRefresh {
  /**
   * Creates an office table if the number of columns of an existing table changes.
   *
   * On refreshing a table, when the new definition range is not empty, original table is kept.
   *
   * If the number of columns stays the same, number of rows in table might be modified to contain all of the data.
   *
   * This function is subscribed as one of the operation steps with the key GET_OFFICE_TABLE_EDIT_REFRESH,
   * therefore should be called only via operation bus.
   *
   * @param objectData.tableName Name of Excel table created on import
   * @param objectData.previousTableDimensions Contains dimensions of Excel table created on import
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param operationData.instanceDefinition Object containing information about MSTR object
   * @param operationData.oldBindId Id of the Office table created on import
   * @param operationData.objectEditedData Contains information modifications to object data
   * @param operationData.insertNewWorksheet Specify if new worksheet has to be created
   */
  async getOfficeTableEditRefresh(
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> {
    try {
      console.time('Create or get table - edit or refresh');
      const {
        tableName,
        previousTableDimensions,
        objectWorkingId,
        pageByData,
        importType,
        mstrObjectType,
      } = objectData;
      const { excelContext, instanceDefinition, oldBindId, objectEditedData, insertNewWorksheet } =
        operationData;
      let { tableChanged, startCell } = operationData;

      const { mstrTable } = instanceDefinition;
      const isRepeatStep = !!startCell; // If we have startCell on refresh it means that we are repeating step

      let shouldFormat = true;
      let bindId = oldBindId;
      let officeTable;

      getOfficeTableHelper.checkReportTypeChange(mstrTable);
      const prevOfficeTable = await officeTableRefresh.getPreviousOfficeTable(
        excelContext,
        oldBindId
      );

      if (!isRepeatStep) {
        ({ tableChanged, startCell } = await officeTableRefresh.getExistingOfficeTableData(
          excelContext,
          instanceDefinition,
          prevOfficeTable,
          previousTableDimensions
        ));
      }

      const { worksheetObjectInfoSettings } = reduxStore.getState().settingsReducer;
      const newObjectDetailsSize = calculateOffsetForObjectInfoSettings(
        worksheetObjectInfoSettings,
        mstrObjectType
      );

      // wheter the table has cross tab headers or not, this value stores the start cell of the headers (outer header if cross tab)
      const currentTableStartCell = officeTableRefresh.getCrosstabStartCell(
        startCell, // if the table has crosstab headers, this is the start cell of the inner headers.
        instanceDefinition,
        tableChanged
      );
      const tableMoved = objectData.startCell !== currentTableStartCell;
      const tableStatus = getTableOperationAndStartCell({
        tableMoved,
        tableChanged,
        previousObjectDetailsSize: objectData.objectDetailsSize,
        newObjectDetailsSize,
        startCell,
        tableStartCell: currentTableStartCell,
      });

      tableChanged = tableStatus.operation === 'createNewTable';

      if (tableChanged) {
        console.warn('Instance definition changed, creating new table');

        ({ officeTable, bindId, startCell } = await officeTableCreate.createOfficeTable({
          instanceDefinition,
          excelContext,
          startCell: tableStatus.startCell,
          tableName,
          prevOfficeTable,
          tableChanged,
          isRepeatStep,
          insertNewWorksheet:
            ObjectImportType.PIVOT_TABLE === importType ? false : insertNewWorksheet,
          pageByData,
          objectData,
        }));
      } else {
        shouldFormat =
          (objectEditedData &&
            objectEditedData.visualizationInfo &&
            objectEditedData.visualizationInfo.nameAndFormatShouldUpdate) ||
          false;

        officeTable = await officeTableUpdate.updateOfficeTable(
          instanceDefinition,
          excelContext,
          prevOfficeTable,
          objectData
        );

        // insert object details
        const objectDetailsRange = await getObjectDetailsRange({
          worksheet: officeTable.worksheet,
          objectDetailsStartCell: tableStatus.objectDetailsStartCell,
          objectDetailsSize: newObjectDetailsSize,
        });

        await insertAndFormatObjectDetails({
          objectData,
          excelContext,
          objectDetailsRange,
        });
      }

      const updatedOperation = {
        objectWorkingId,
        officeTable,
        shouldFormat,
        tableChanged,
        instanceDefinition,
        startCell,
        isTotalsRowVisible: prevOfficeTable.showTotals,
      };

      if (!tableChanged)
        startCell = officeTableRefresh.getCrosstabStartCell(
          startCell,
          instanceDefinition,
          tableChanged
        );

      officeTable.worksheet.load(['id', 'name', 'position']);
      await excelContext.sync();

      const { id, name, position } = officeTable.worksheet;

      let updatedObject: Partial<ObjectData> = {
        objectWorkingId,
        bindId,
        startCell,
      };

      if (importType !== ObjectImportType.PIVOT_TABLE) {
        updatedObject = {
          ...updatedObject,
          worksheet: { id, name, index: position },
          groupData: { key: position, title: name },
          objectDetailsSize: newObjectDetailsSize,
        };
      }

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetOfficeTableEditRefresh(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Create or get table - edit or refresh');
    }
  }
}

const stepGetOfficeTableEditRefresh = new StepGetOfficeTableEditRefresh();
export default stepGetOfficeTableEditRefresh;
