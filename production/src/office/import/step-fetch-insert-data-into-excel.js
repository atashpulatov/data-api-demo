import { mstrObjectRestService, DATA_LIMIT, IMPORT_ROW_LIMIT, } from '../../mstr-object/mstr-object-rest-service';
import officeInsertService from './office-insert-service';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

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
   * @param {Number} objectData.objectId Id of the MSTR object being currently processed
   * @param {Number} objectData.projectId Id of the MSTR project from which we fetch data
   * @param {Object} objectData.dossierData Data of dossier used for answering prompts
   * @param {Object} objectData.mstrObjectType Information about MSTR object type
   * @param {Number} objectData.body Information about location of visualization in dossier
   * @param {String} [objectData.preparedInstanceId] Id of the processed object instance
   * @param {Object} [objectData.manipulationsXML] Information about manipulations in dossier
   * @param {Array} [objectData.promptsAnswers] Prompts answers used for creating instance of processed object
   * @param {Object} [objectData.visualizationInfo] Information about location of visualization in dossier
   * @param {Object} objectData.displayAttrFormNames The style in which attribute form will be displayed
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Office} operationData.operationType The type of the operation that called this function
   * @param {Boolean} [operationData.tableColumnsChanged] Determines if columns number in Excel table has been changed
   * @param {Office} operationData.officeTable Reference to Table created by Excel
   * @param {Office} operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param {String} operationData.instanceDefinition Object containing information about MSTR object
   */
  fetchInsertDataIntoExcel = async (objectData, operationData) => {
    try {
      const {
        objectId,
        projectId,
        dossierData,
        mstrObjectType,
        body,
        preparedInstanceId,
        manipulationsXML,
        promptsAnswers,
        visualizationInfo,
        displayAttrFormNames,
        objectWorkingId,
      } = objectData;

      const {
        operationType,
        tableColumnsChanged,
        officeTable,
        excelContext,
        instanceDefinition,
      } = operationData;

      const { columns, rows, mstrTable } = instanceDefinition;
      const { subtotalsInfo: { importSubtotal = true } } = mstrTable;

      const limit = Math.min(Math.floor(DATA_LIMIT / columns), IMPORT_ROW_LIMIT);

      const generatorConfig = {
        instanceDefinition,
        objectId,
        projectId,
        mstrObjectType,
        dossierData,
        body,
        limit,
        visualizationInfo,
        displayAttrFormNames,
        preparedInstanceId,
        manipulationsXML,
        promptsAnswers,
      };

      const rowGenerator = mstrObjectRestService.fetchContentGenerator(generatorConfig);

      let rowIndex = 0;
      const contextPromises = [];
      const subtotalsAddresses = [];

      console.time('Fetch and insert into excel');
      console.time('Fetch data');
      for await (const { row, header, subtotalAddress } of rowGenerator) {
        console.groupCollapsed(`Importing rows: ${rowIndex} to ${Math.min(rowIndex + limit, rows)}`);
        console.timeEnd('Fetch data');

        excelContext.workbook.application.suspendApiCalculationUntilNextSync();

        await officeInsertService.appendRows(
          officeTable,
          excelContext,
          row,
          rowIndex,
          operationType,
          tableColumnsChanged,
          contextPromises,
          header,
          mstrTable
        );

        if (importSubtotal) {
          this.getSubtotalCoordinates(subtotalAddress, subtotalsAddresses);
        }

        rowIndex += row.length;

        await officeInsertService.syncChangesToExcel(contextPromises, false);

        console.groupEnd();
      }
      console.timeEnd('Fetch and insert into excel');

      mstrTable.subtotalsInfo.subtotalsAddresses = subtotalsAddresses;
      mstrTable.subtotalsInfo.importSubtotal = importSubtotal;

      await officeInsertService.syncChangesToExcel(contextPromises, true);

      const updatedOperation = {
        objectWorkingId,
        instanceDefinition,
      };

      const updatedObject = {
        objectWorkingId,
        subtotalsInfo: {
          subtotalsAddresses,
          importSubtotal
        },
      };

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeFetchInsertData(objectWorkingId);
    } catch (error) {
      console.log(error);
      throw error;
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
