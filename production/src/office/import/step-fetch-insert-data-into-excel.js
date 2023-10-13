import { mstrObjectRestService, DATA_LIMIT, IMPORT_ROW_LIMIT, } from '../../mstr-object/mstr-object-rest-service';
import officeInsertService from './office-insert-service';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../operation/operation-error-handler';

class StepFetchInsertDataIntoExcel {
  /**
   * Fetches Data from Microstrategy and inserts it into the Excel table.
   *
   * If needed extends the table by adding new rows, for crosstab also creates row headers.
   *
   * Fetches the data about subtotals and stores them in subtotalsAddresses array.
   *
   * This function is subscribed as one of the operation steps with the key FETCH_INSERT_DATA,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Object} objectData.subtotalsInfo Determines if subtotals will be displayed and stores subtotal addresses
   * @param {Number} objectData.objectId Id of the MSTR object being currently processed
   * @param {Number} objectData.projectId Id of the MSTR project from which we fetch data
   * @param {Object} objectData.dossierData Data of dossier used for answering prompts
   * @param {Object} objectData.mstrObjectType Information about MSTR object type
   * @param {Object} [objectData.visualizationInfo] Information about location of visualization in dossier
   * @param {Object} objectData.displayAttrFormNames The style in which attribute form will be displayed
   * @param {Office} operationData.operationType The type of the operation that called this function
   * @param {Boolean} operationData.tableChanged Determines if columns number in Excel table has been changed
   * @param {Office} operationData.officeTable Reference to Table created by Excel
   * @param {String} operationData.instanceDefinition Object containing information about MSTR object
   */
  fetchInsertDataIntoExcel = async (objectData, operationData) => {
    try {
      const {
        objectWorkingId, subtotalsInfo, subtotalsInfo: { importSubtotal = true }, definition
      } = objectData;
      const {
        operationType,
        tableChanged,
        excelContext,
        officeTable,
        instanceDefinition,
      } = operationData;

      const { columns, rows, mstrTable } = instanceDefinition;
      const limit = Math.min(Math.floor(DATA_LIMIT / columns), IMPORT_ROW_LIMIT);

      const rowGenerator = mstrObjectRestService.fetchContentGenerator({ ...objectData, limit, instanceDefinition });

      let rowIndex = 0;
      const contextPromises = [];
      const subtotalsAddresses = [];
      let newDefinition = null;
      let newInstance = null;

      console.time('Fetch and insert into excel');
      console.time('Fetch data');
      for await (const {
        row, header, subtotalAddress, metricsInRows, rowsInformation
      } of rowGenerator) {
        console.groupCollapsed(`Importing rows: ${rowIndex} to ${Math.min(rowIndex + limit, rows)}`);
        console.timeEnd('Fetch data');

        excelContext.workbook.application.suspendApiCalculationUntilNextSync();

        await officeInsertService.appendRows(
          officeTable,
          excelContext,
          row,
          rowIndex,
          operationType,
          tableChanged,
          contextPromises,
          header,
          mstrTable
        );

        if (importSubtotal) {
          this.getSubtotalCoordinates(subtotalAddress, subtotalsAddresses);
        }

        if (metricsInRows.length) {
          const columnInformation = newInstance?.mstrTable?.columnInformation || [];
          newDefinition = {
            ...definition,
            metrics: metricsInRows
          };
          newInstance = {
            ...instanceDefinition, mstrTable: {
              ...mstrTable,
              metricsInRows,
              columnInformation: [...columnInformation, ...rowsInformation]
            }
          };
        }

        rowIndex += row.length;

        await officeInsertService.syncChangesToExcel(contextPromises, false);

        operationStepDispatcher.updateOperation({ objectWorkingId, loadedRows: rowIndex, });
        console.groupEnd();
      }
      console.timeEnd('Fetch and insert into excel');

      await officeInsertService.syncChangesToExcel(contextPromises, true);

      mstrTable.subtotalsInfo.subtotalsAddresses = subtotalsAddresses;
      mstrTable.subtotalsInfo.importSubtotal = importSubtotal;
      const updatedOperation = {
        objectWorkingId,
        instanceDefinition: newInstance || instanceDefinition,
      };

      const updatedObject = {
        objectWorkingId,
        subtotalsInfo: { ...subtotalsInfo, subtotalsAddresses, },
        ...(!!newDefinition && { definition: newDefinition })
      };

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeFetchInsertData(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };

  /**
   * Appends rows with data to Excel table only.
   *
   * @param {Array} subtotalAddress Array containing object with coordinates of subtotals in rows currently processed
   * @param {Array} subtotalsAddresses Array containing object with coordinates of subtotals of object.
   */
  getSubtotalCoordinates = (subtotalAddress, subtotalsAddresses) => {
    console.time('Get subtotals coordinates');
    for (let i = 0; i < subtotalAddress.length; i += 1) {
      // eslint removed Boolean(subtotalAddress[i])
      if (subtotalAddress[i]) {
        subtotalsAddresses.push(subtotalAddress[i]);
      }
    }
    console.timeEnd('Get subtotals coordinates');
  };
}

const stepFetchInsertDataIntoExcel = new StepFetchInsertDataIntoExcel();
export default stepFetchInsertDataIntoExcel;
