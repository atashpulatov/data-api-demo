
import {
  mstrObjectRestService,
  DATA_LIMIT,
  IMPORT_ROW_LIMIT,
} from '../../mstr-object/mstr-object-rest-service';
import officeInsertService from './office-insert-service';

const { getObjectContentGenerator } = mstrObjectRestService;

class OfficeImportService {
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
  async fetchInsertDataIntoExcel({
    connectionData,
    officeData,
    instanceDefinition,
    isRefresh,
    tableColumnsChanged,
    visualizationInfo,
    importSubtotal,
    displayAttrFormNames
  }) {
    try {
      const { excelContext } = officeData;
      const { columns, rows, mstrTable } = instanceDefinition;
      const limit = Math.min(Math.floor(DATA_LIMIT / columns), IMPORT_ROW_LIMIT);
      const configGenerator = {
        ...connectionData,
        instanceDefinition,
        limit,
        visualizationInfo,
        displayAttrFormNames
      };

      const rowGenerator = getObjectContentGenerator(configGenerator);
      let rowIndex = 0;
      const contextPromises = [];
      const subtotalsAddresses = [];

      console.time('Fetch data');
      for await (const { row, header, subtotalAddress } of rowGenerator) {
        console.groupCollapsed(`Importing rows: ${rowIndex} to ${Math.min(rowIndex + limit, rows)}`);
        console.timeEnd('Fetch data');

        excelContext.workbook.application.suspendApiCalculationUntilNextSync();

        await officeInsertService.appendRows(
          officeData,
          row,
          rowIndex,
          isRefresh,
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

const officeImportService = new OfficeImportService();
export default officeImportService;
