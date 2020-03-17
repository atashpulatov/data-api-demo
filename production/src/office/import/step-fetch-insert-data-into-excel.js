
import { mstrObjectRestService, DATA_LIMIT, IMPORT_ROW_LIMIT, } from '../../mstr-object/mstr-object-rest-service';
import officeInsertService from './office-insert-service';

import { FETCH_INSERT_DATA } from '../../operation/operation-steps';
import { markStepCompleted } from '../../operation/operation-actions';
import { updateObject } from '../../operation/object-actions';

const { getObjectContentGenerator } = mstrObjectRestService;

class StepFetchInsertDataIntoExcel {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  /**
  * Fetch Data from Microstrategy and insert it into the Excel table. For crosstab also creates row headers
  *
  * @param {Object} parameter.connectionData Contains objectId, projectId, dossierData, mstrObjectType used in request
  * @param {Object} parameter.officeData Contains Excel context and Excel table reference.
  * @param {Boolean} parameter.isRefresh
  * @param {Boolean} parameter.tableColumnsChanged
  * @param {Object} parameter.instanceDefinition
  * @param {Object} [parameter.visualizationInfo]
  * @returns {Object} Object containing officeTable and subtotalAddresses
  */
   fetchInsertDataIntoExcel = async (objectData, { operationType }) => {
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
         instanceDefinition,
         tableColumnsChanged,
         visualizationInfo,
         displayAttrFormNames,
         officeTable,
         excelContext,
         objectWorkingId,
       } = objectData;


       const { columns, rows, mstrTable } = instanceDefinition;
       const { subtotalsInfo: { importSubtotal = true } } = mstrTable;
       const limit = Math.min(Math.floor(DATA_LIMIT / columns), IMPORT_ROW_LIMIT);
       const configGenerator = {
         objectId,
         projectId,
         dossierData,
         mstrObjectType,
         body,
         preparedInstanceId,
         manipulationsXML,
         promptsAnswers,
         instanceDefinition,
         limit,
         visualizationInfo,
         displayAttrFormNames
       };

       const rowGenerator = getObjectContentGenerator(configGenerator);
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
         if (importSubtotal) { this.getSubtotalCoordinates(subtotalAddress, subtotalsAddresses); }
         rowIndex += row.length;

         await officeInsertService.syncChangesToExcel(contextPromises, false);
         console.groupEnd();
       }
       console.timeEnd('Fetch and insert into excel');

       mstrTable.subtotalsInfo.subtotalsAddresses = subtotalsAddresses;
       mstrTable.subtotalsInfo.importSubtotal = importSubtotal;

       await officeInsertService.syncChangesToExcel(contextPromises, true);

       const updatedObject = {
         objectWorkingId,
         instanceDefinition,
       };

       this.reduxStore.dispatch(updateObject(updatedObject));
       this.reduxStore.dispatch(markStepCompleted(objectWorkingId, FETCH_INSERT_DATA));
     } catch (error) {
       console.log(error);
       throw error;
     }
   }


  /**
   * Appends rows with data to Excel table only.
   *
   * @param {Array} subtotalAddress Array containig object with coordinates of subtotals in rows currently processed.
   * @param {Array} subtotalsAddresses Array containig object with coordinates of subtotals of object.
   */
  getSubtotalCoordinates = (subtotalAddress, subtotalsAddresses) => {
    console.time('Get subtotals coordinates');
    for (let i = 0; i < subtotalAddress.length; i += 1) {
      // eslint removed Boolean(subtotalAddress[i])
      if (subtotalAddress[i]) { subtotalsAddresses.push(subtotalAddress[i]); }
    }
    console.timeEnd('Get subtotals coordinates');
  }
}

const stepFetchInsertDataIntoExcel = new StepFetchInsertDataIntoExcel();
export default stepFetchInsertDataIntoExcel;
