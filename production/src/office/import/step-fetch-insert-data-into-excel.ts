import {
  DATA_LIMIT,
  IMPORT_ROW_LIMIT,
  mstrObjectRestService,
} from '../../mstr-object/mstr-object-rest-service';
import officeInsertService from './office-insert-service';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
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
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.subtotalsInfo Determines if subtotals will be displayed and stores subtotal addresses
   * @param objectData.objectId Id of the MSTR object being currently processed
   * @param objectData.projectId Id of the MSTR project from which we fetch data
   * @param objectData.dossierData Data of dossier used for answering prompts
   * @param objectData.mstrObjectType Information about MSTR object type
   * @param objectData.visualizationInfo Information about location of visualization in dossier
   * @param objectData.displayAttrFormNames The style in which attribute form will be displayed
   * @param operationData.operationType The type of the operation that called this function
   * @param operationData.tableChanged Determines if columns number in Excel table has been changed
   * @param operationData.officeTable Reference to Table created by Excel
   * @param operationData.instanceDefinition Object containing information about MSTR object
   */
  async fetchInsertDataIntoExcel(
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> {
    console.group('Fetch and insert data into Excel');
    console.time('Total');
    try {
      const {
        objectWorkingId,
        subtotalsInfo,
        subtotalsInfo: { importSubtotal = true },
        definition,
      } = objectData;
      const { excelContext, officeTable, instanceDefinition } = operationData;

      const { columns, rows, mstrTable } = instanceDefinition;
      const limit = Math.min(Math.floor(DATA_LIMIT / columns), IMPORT_ROW_LIMIT);

      // @ts-expect-error
      const rowGenerator = mstrObjectRestService.fetchContentGenerator({
        ...objectData,
        limit,
        instanceDefinition,
      });

      let rowIndex = 0;
      const contextPromises = [] as any[];
      const subtotalsAddresses = [] as any[];
      let newDefinition = null;
      let newInstance = null;

      console.time('Fetch and insert into excel');
      for await (const {
        row,
        header,
        subtotalAddress,
        metricsInRows,
        rowsInformation,
      } of rowGenerator) {
        console.groupCollapsed(
          `Importing rows: ${rowIndex} to ${Math.min(rowIndex + limit, rows)}`
        );

        excelContext.workbook.application.suspendApiCalculationUntilNextSync();

        await officeInsertService.appendRows({
          officeTable,
          excelContext,
          excelRows: row,
          rowIndex,
          contextPromises,
          header,
          mstrTable,
        });

        if (importSubtotal) {
          this.getSubtotalCoordinates(subtotalAddress, subtotalsAddresses);
        }

        if (metricsInRows.length) {
          // @ts-expect-error
          const columnInformation = newInstance?.mstrTable?.columnInformation || [];
          newDefinition = {
            ...definition,
            metrics: metricsInRows,
          };
          newInstance = {
            ...instanceDefinition,
            mstrTable: {
              ...mstrTable,
              metricsInRows,
              columnInformation: [...columnInformation, ...rowsInformation],
            },
          };
        }

        rowIndex += row.length;

        await officeInsertService.syncChangesToExcel(contextPromises, false);

        operationStepDispatcher.updateOperation({
          objectWorkingId,
          loadedRows: rowIndex,
        });
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
        subtotalsInfo: { ...subtotalsInfo, subtotalsAddresses },
        ...(!!newDefinition && { definition: newDefinition }),
      };

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeFetchInsertData(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Total');
      console.groupEnd();
    }
  }

  /**
   * Appends rows with data to Excel table only.
   *
   * @param subtotalAddress Array containing object with coordinates of subtotals in rows currently processed
   * @param subtotalsAddresses Array containing object with coordinates of subtotals of object.
   */
  getSubtotalCoordinates(subtotalAddress: any[], subtotalsAddresses: any[]): void {
    console.time('Get subtotals coordinates');
    for (const address of subtotalAddress) {
      // eslint removed Boolean(address)
      if (address) {
        subtotalsAddresses.push(address);
      }
    }
    console.timeEnd('Get subtotals coordinates');
  }
}

const stepFetchInsertDataIntoExcel = new StepFetchInsertDataIntoExcel();
export default stepFetchInsertDataIntoExcel;
