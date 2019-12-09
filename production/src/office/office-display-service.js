import { officeApiHelper } from './office-api-helper';
import { officeTableHelper } from './office-table-helper';
import { officeFormattingHelper } from './office-formatting-helper';
import {
  mstrObjectRestService,
  DATA_LIMIT,
  PROMISE_LIMIT,
  IMPORT_ROW_LIMIT,
} from '../mstr-object/mstr-object-rest-service';
import { CLEAR_PROMPTS_ANSWERS } from '../navigation/navigation-tree-actions';
import { officeProperties } from './office-properties';
import { officeStoreService } from './store/office-store-service';
import { PopupTypeEnum } from '../home/popup-type-enum';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import {
  NOT_SUPPORTED_NO_ATTRIBUTES,
  ALL_DATA_FILTERED_OUT,
  ERROR_POPUP_CLOSED,
} from '../error/constants';

const {
  getObjectInfo,
  getObjectDefinition,
  createInstance,
  getObjectContentGenerator,
  answerPrompts,
  modifyInstance,
  createDossierInstance,
  fetchVisualizationDefinition,
  getDossierDefinition,
} = mstrObjectRestService;

export class OfficeDisplayService {

  init = (reduxStore, popupController) => {
    this.reduxStore = reduxStore;
    this.popupController = popupController;
  }
  /**
   * Main function in office Display Service responsible for import/refresh and display workflow. Whole workflow can splitted into steps.
   * 1.Get object definition
   * 2.Get active cell in Excel(only for import)
   * 3.Create Instance and InstaceDefinition object Containing information needed for import
   * 4.Create Excel Table
   * 5.Apply number formatting to Excel cells
   * 6.Fetch and insert data into Excel
   * 7.Table formatting
   * 8.Apply subtotal formatting
   * 9.Get visualisation breadcrumbs
   * 10.Store information about object to Redux and Excel
   *
   * @param {String} parameter.objectId
   * @param {String} parameter.projectId
   * @param {Object} [parameter.mstrObjectType = mstrObjectEnum.mstrObjectType.report ]
   * @param {Object|Boolean} parameter.selectedCell Address of current active cell or true in case of true for refresh
   * @param {String} parameter.bindingId  Binding to Excel Table
   * @param {Boolean} parameter.isRefresh
   * @param {Object} [parameter.dossierData]
   * @param {Object} [parameter.body]
   * @param {Boolean} parameter.isCrosstab
   * @param {Boolean} parameter.isPrompted
   * @param {Object} [parameter.promptsAnswers]
   * @param {Object} [parameter.crosstabHeaderDimensions=false] Contains crosstab header dimensions
   * @param {Object} [parameter.subtotalInfo=false] Contains previous subtotal addresses and boolean determining if we want to import with subtotal
   * @param {Object} [parameter.visualizationInfo=false]
   * @param {Object} [parameter.preparedInstanceId] Instance created before import workflow.
   * @param {Object} [parameter.manipulationsXML=false] Dossier Manipulation for imported visualisation
   * @param {Object} [parameter.isRefreshAll]
   * @returns {Object} Specify status of the import.
   * @memberof officeDisplayService
   */
  printObject = async ({
    objectId,
    projectId,
    mstrObjectType = mstrObjectEnum.mstrObjectType.report,
    selectedCell,
    bindingId,
    isRefresh,
    dossierData,
    body,
    isCrosstab,
    isPrompted,
    promptsAnswers,
    crosstabHeaderDimensions = false,
    subtotalInfo: {
      importSubtotal = true,
      subtotalsAddresses = false,
    } = false,
    visualizationInfo = false,
    preparedInstanceId,
    manipulationsXML = false,
    isRefreshAll
  }) => {
    let newOfficeTableId;
    let shouldFormat;
    let excelContext;
    let startCell;
    let tableColumnsChanged;
    let instanceDefinition;
    let officeTable;

    try {
      excelContext = await officeApiHelper.getExcelContext();
      if (!isRefreshAll) {
        // /Reports/getDefinition (GET /reports/{reportId}) endpoint does not work for Reports with Object Prompt(?)
        // so we're using /Object_Management/getObject (GET /objects/{id}) instead
        // should probably open an DE
        await this.getObjectInformation(mstrObjectType, isPrompted, objectId, projectId);
      }
      const objectType = mstrObjectType;
      const { envUrl } = officeApiHelper.getCurrentMstrContext();

      // Get excel context and initial cell
      console.group('Importing data performance');
      console.time('Total');
      console.time('Init excel');
      startCell = selectedCell || (await officeApiHelper.getSelectedCell(excelContext));
      console.timeEnd('Init excel');

      // Get mstr instance definition
      console.time('Instance definition');
      ({ body, instanceDefinition, isCrosstab } = await this.getInstaceDefinition(
        body, mstrObjectType, manipulationsXML, preparedInstanceId, projectId, objectId, dossierData,
        visualizationInfo, promptsAnswers, crosstabHeaderDimensions, subtotalsAddresses
      ));
      const { mstrTable } = instanceDefinition;
      ({ crosstabHeaderDimensions } = mstrTable);
      console.timeEnd('Instance definition');

      // Check if instance returned data
      if (!instanceDefinition || mstrTable.rows.length === 0) {
        return {
          type: 'warning',
          message: isPrompted ? ALL_DATA_FILTERED_OUT : NOT_SUPPORTED_NO_ATTRIBUTES,
        };
      }

      // Create or update table
      ({ officeTable, newOfficeTableId, shouldFormat, tableColumnsChanged } = await officeTableHelper.getOfficeTable(
        isRefresh, excelContext, bindingId, instanceDefinition, startCell
      ));

      // Apply formatting when table was created
      if (shouldFormat) {
        await officeFormattingHelper.applyFormatting(officeTable, instanceDefinition, isCrosstab, excelContext);
      }

      // Fetch, convert and insert with promise generator
      console.time('Fetch and insert into excel');
      const connectionData = { objectId, projectId, dossierData, mstrObjectType, body };
      const officeData = { officeTable, excelContext, startCell, newOfficeTableId };
      ({ officeTable, subtotalsAddresses } = await this.fetchInsertDataIntoExcel({
        connectionData,
        officeData,
        instanceDefinition,
        isRefresh,
        startCell,
        tableColumnsChanged,
        visualizationInfo,
      }));

      console.time('Column auto size');
      await officeFormattingHelper.formatTable(officeTable, isCrosstab, crosstabHeaderDimensions, excelContext);
      console.timeEnd('Column auto size');


      if (subtotalsAddresses.length) {
        // Removing duplicated subtotal addresses from headers
        await officeFormattingHelper.applySubtotalFormatting(isCrosstab, subtotalsAddresses, officeTable, excelContext, instanceDefinition.mstrTable);
      }

      // Get visualization path from dossier definition.
      // Used to show in sidebar placeholder
      if (objectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
        mstrTable.id = objectId;
        console.time('Get dossier structure');
        visualizationInfo = await this.getVisualizationInfo(projectId, objectId, visualizationInfo.visualizationKey, preparedInstanceId) || visualizationInfo;
        console.timeEnd('Get dossier structure');
      }

      // Save to store
      bindingId = bindingId || newOfficeTableId;
      await officeApiHelper.bindNamedItem(newOfficeTableId, bindingId);
      officeStoreService.saveAndPreserveReportInStore({
        name: mstrTable.name,
        manipulationsXML,
        bindId: bindingId,
        projectId,
        envUrl,
        body,
        objectType,
        isCrosstab,
        isPrompted,
        promptsAnswers,
        subtotalInfo: {
          importSubtotal,
          subtotalsAddresses,
        },
        visualizationInfo,
        id: objectId,
        isLoading:false,
        crosstabHeaderDimensions,
      }, isRefresh);

      console.timeEnd('Total');
      this.reduxStore.dispatch({ type: CLEAR_PROMPTS_ANSWERS });
      this.reduxStore.dispatch({
        type: officeProperties.actions.finishLoadingReport,
        reportBindId: bindingId,
      });
      return { type: 'success', message: 'Data loaded successfully' };
    } catch (error) {
      if (officeTable) {
        if (!isRefresh) {
          officeTable.showHeaders = true;
          await officeApiHelper.deleteExcelTable(officeTable, excelContext, isCrosstab, instanceDefinition.mstrTable.crosstabHeaderDimensions);
        } else if (isCrosstab)officeTable.showHeaders = false; // hides table headers for crosstab if we fail on refresh
      }
      throw error;
    } finally {
      if (!isRefreshAll) {
        this.dispatchPrintFinish();
      }
      await excelContext.sync();
      console.groupEnd();
    }
  };

  /**
   * Function closes popup; used when  importing report
   * it swallows error from office if dialog has been closed by user
   *
   * @memberOf OfficeDisplayService
   */
  dispatchPrintFinish = () => {
    const reduxStoreState = this.reduxStore.getState();
    this.reduxStore.dispatch({ type: officeProperties.actions.popupHidden });
    this.reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
    try {
      if (reduxStoreState.sessionReducer.dialog.close) {
        reduxStoreState.sessionReducer.dialog.close();
      }
    } catch (err) {
      if (!err.includes(ERROR_POPUP_CLOSED)) {
        throw err;
      }
    }
  }

  /**
   * Create Instance definition object which stores data neede to continue import.
   * If instance of object does not exist new one will be created
   *
   * @param {Object} [body] Contains requested objects and filters
   * @param {Object} mstrObjectType Contains objectId, projectId, dossierData, mstrObjectType used in request
   * @param {Object} [preparedInstanceId] Instance Id of the object
   * @param {String} projectId
   * @param {String} objectId
   * @param {Object} [dossierData]
   * @param {Object} [visualizationInfo]
   * @param {Object} [promptsAnswers]
   * @param {Object} [crosstabHeaderDimensions] Contains previous dimensions of crosstab headers.
   * @param {Array} [subtotalsAddresses] Contains previous subtotal addresses
   * @returns {Object} Object containing officeTable and subtotalAddresses
   * @memberof officeDisplayService
   */
  async getInstaceDefinition(body, mstrObjectType, manipulationsXML, preparedInstanceId, projectId, objectId, dossierData, visualizationInfo, promptsAnswers, crosstabHeaderDimensions, subtotalsAddresses) {
    let instanceDefinition;
    if (body && body.requestedObjects) {
      if (body.requestedObjects.attributes.length === 0 && body.requestedObjects.metrics.length === 0) {
        body.requestedObjects = undefined;
      }
      body.template = body.requestedObjects;
    }
    if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
      if (manipulationsXML) {
        if (!body) { body = {}; }
        body.manipulations = manipulationsXML.manipulations;
        body.promptAnswers = manipulationsXML.promptAnswers;
      }
      const instanceId = preparedInstanceId || (await createDossierInstance(projectId, objectId, body));
      const config = { projectId, objectId, instanceId, mstrObjectType, dossierData, body, visualizationInfo };
      const temp = await fetchVisualizationDefinition(config);
      instanceDefinition = { ...temp, instanceId };
    } else {
      const config = { objectId, projectId, mstrObjectType, dossierData, body };
      instanceDefinition = await createInstance(config);
    }
    // Status 2 = report has open prompts to be answered before data can be returned
    if (instanceDefinition.status === 2) {
      instanceDefinition = await this.answerPrompts(instanceDefinition, objectId, projectId, promptsAnswers, dossierData, body);
    }

    const { mstrTable } = instanceDefinition;
    const { isCrosstab } = mstrTable;
    mstrTable.prevCrosstabDimensions = crosstabHeaderDimensions;
    mstrTable.crosstabHeaderDimensions = isCrosstab
      ? officeTableHelper.getCrosstabHeaderDimensions(instanceDefinition)
      : false;
    mstrTable.subtotalsAddresses = subtotalsAddresses;

    return { body, instanceDefinition, isCrosstab };
  }

  /**
   * Gets object definition, dispatch data to Redux and display loading popup.
   *
   * @param {Object} mstrObjectType
   * @param {Object} isPrompted
   * @param {String} objectId
   * @param {String} projectId
   * @memberof officeDisplayService
   */
   getObjectInformation = async (mstrObjectType, isPrompted, objectId, projectId) => {
     if (mstrObjectType.name !== mstrObjectEnum.mstrObjectType.visualization.name) {
       const objectInfo = isPrompted
         ? await getObjectInfo(objectId, projectId, mstrObjectType)
         : await getObjectDefinition(objectId, projectId, mstrObjectType);
       this.reduxStore.dispatch({
         type: officeProperties.actions.preLoadReport,
         preLoadReport: objectInfo,
       });
     }
     await this.popupController.runPopup(PopupTypeEnum.loadingPage, 22, 28);
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
   * @memberof officeDisplayService
   */
   async fetchInsertDataIntoExcel({ connectionData, officeData, instanceDefinition, isRefresh, tableColumnsChanged, visualizationInfo }) {
     try {
       const { objectId, projectId, dossierData, mstrObjectType } = connectionData;
       const { excelContext, officeTable } = officeData;
       const { columns, rows, mstrTable } = instanceDefinition;
       const limit = Math.min(Math.floor(DATA_LIMIT / columns), IMPORT_ROW_LIMIT);
       const configGenerator = { instanceDefinition, objectId, projectId, mstrObjectType, dossierData, limit, visualizationInfo };
       const rowGenerator = getObjectContentGenerator(configGenerator);
       let rowIndex = 0;
       const contextPromises = [];
       const subtotalsAddresses = [];

       console.time('Fetch data');
       for await (const { row, header, subtotalAddress } of rowGenerator) {
         console.groupCollapsed(`Importing rows: ${rowIndex} to ${Math.min(rowIndex + limit, rows)}`);
         console.timeEnd('Fetch data');
         excelContext.workbook.application.suspendApiCalculationUntilNextSync();
         await this.appendRows(officeData, row, rowIndex, isRefresh, tableColumnsChanged, contextPromises, header, mstrTable);
         this.getSubtotalCoordinates(subtotalAddress, subtotalsAddresses);
         rowIndex += row.length;
         await this.syncChangesToExcel(contextPromises, false);
         console.groupEnd();
       }
       console.timeEnd('Fetch and insert into excel');
       await this.syncChangesToExcel(contextPromises, true);
       return { officeTable, subtotalsAddresses };
     } catch (error) {
       console.log(error);
       throw error;
     }
   }

   /**
   * Appends crosstab row headers to imported object.
   *
   * @param {Office} officeTable Reference to Ecxcel table.
   * @param {Array} header Contains data for crosstab row headers.
   * @param {Number} rowIndex Specify from row we should append rows
   * @memberof officeDisplayService
   */
  appendCrosstabRowsToRange = (officeTable, headerRows, rowIndex) => {
    console.time('Append crosstab rows');
    const startCell = officeTable
      .getDataBodyRange()
      .getRow(0)
      .getCell(0, 0)
      .getOffsetRange(rowIndex, 0);
    officeApiHelper.createRowsHeaders(startCell, headerRows);
    console.timeEnd('Append crosstab rows');
  }

  /**
   * Appends rows with data and attributes to object in Excel.
   *
   * @param {Office} officeData Contains Excel context and Excel table reference.
   * @param {Array} excelRows Array of table data
   * @param {Number} rowIndex Specify from row we should append rows
   * @param {Boolean} isRefresh
   * @param {Boolean} tableColumnsChanged
   * @param {Array} contextPromises Array excel context sync promises.
   * @param {Object} header Contains data for crosstab headers.
   * @param {Object} mstrTable Contains informations about mstr object
   * @memberof officeDisplayService
   */
  appendRows = async (officeData, excelRows, rowIndex, isRefresh = false, tableColumnsChanged, contextPromises, header, mstrTable) => {
    const { excelContext, officeTable } = officeData;
    await this.appendRowsToTable(excelRows, excelContext, officeTable, rowIndex, tableColumnsChanged, isRefresh);

    if (mstrTable.isCrosstab) { this.appendCrosstabRowsToRange(officeTable, header.rows, rowIndex); }
    contextPromises.push(excelContext.sync());
  }

  /**
   * Split Excel Rows into chunks that meets limit of 5MB
   *
   * @param {Array} excelRows Array of table data
   * @returns {Array} Array with sub-arrays with size not more than 5MB
   * @memberof officeDisplayService
   */
  splitExcelRows = (excelRows) => {
    let splitRows = [excelRows];
    let isFitSize = false;
    do {
      const tempSplit = [];
      let changed = false;
      for (let i = 0; i < splitRows.length; i += 1) {
        // 5 MB is a limit for excel
        if (this.sizeOfObject(splitRows[i]) > 5) {
          const { length } = splitRows[i];
          tempSplit.push(splitRows[i].slice(0, length / 2));
          tempSplit.push(splitRows[i].slice(length / 2, length));
          changed = true;
        } else {
          tempSplit.push(splitRows[i]);
        }
      }
      splitRows = [...tempSplit];
      if (!changed) isFitSize = true;
    } while (!isFitSize);
    return splitRows;
  }

  /**
   * Check size of passed object in MB
   *
   * @param {Object} object Item to check size of
   * @returns {number} Size of passed object in MB
   * @memberof officeDisplayService
   */
  sizeOfObject = (object) => {
    const objectList = [];
    const stack = [object];
    let bytes = 0;
    while (stack.length) {
      const value = stack.pop();
      if (typeof value === 'boolean') {
        bytes += 4;
      } else if (typeof value === 'string') {
        bytes += value.length * 2;
      } else if (typeof value === 'number') {
        bytes += 8;
      } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
        objectList.push(value);
        for (const i in value) {
          stack.push(value[i]);
        }
      }
    }
    // Formating bytes to MB in decimal
    return bytes / 1000000;
  }

  /**
   * Check size of passed object in MB
   *
   * @param {String} projectId
   * @param {String} objectId
   * @param {String} visualizationKey visualisation id.
   * @param {Object} preparedInstanceId
   * @returns {Object} Contains breadcrumbs fro visualisation.
   * @memberof officeDisplayService
   */
  getVisualizationInfo = async (projectId, objectId, visualizationKey, preparedInstanceId) => {
    const dossierDefinition = await getDossierDefinition(projectId, objectId, preparedInstanceId);
    for (const chapter of dossierDefinition.chapters) {
      for (const page of chapter.pages) {
        for (const visualization of page.visualizations) {
          if (visualization.key === visualizationKey) {
            return {
              chapterKey: chapter.key,
              visualizationKey,
              dossierStructure: {
                chapterName: chapter.name,
                dossierName: dossierDefinition.name,
                pageName: page.name
              }
            };
          }
        }
      }
    }
    return undefined;
  }

  /**
   * Answers prompts and modify instance of the object.
   *
   * @param {Object} instanceDefinition
   * @param {String} objectId
   * @param {String} projectId
   * @param {Object} promptsAnswers Stored prompt answers
   * @param {Object} dossierData
   * @param {Object} body Contains requested objects and filters.
   * @memberof officeDisplayService
   */
  answerPrompts = async (instanceDefinition, objectId, projectId, promptsAnswers, dossierData, body) => {
    try {
      let count = 0;
      while (instanceDefinition.status === 2 && count < promptsAnswers.length) {
        const config = { objectId, projectId, instanceId: instanceDefinition.instanceId, promptsAnswers: promptsAnswers[count] };
        await answerPrompts(config);
        const configInstance = { objectId, projectId, dossierData, body, instanceId: instanceDefinition.instanceId };
        if (count === promptsAnswers.length - 1) {
          instanceDefinition = await modifyInstance(configInstance);
        }
        count += 1;
      }
      return instanceDefinition;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Appends rows with data to Excel table only.
   *
   * @param {Array} subtotalAddress Array containig object with coordinates of subtotals in rows currently processed.
   * @param {Array} subtotalsAddresses Array containig object with coordinates of subtotals of object.
   * @memberof officeDisplayService
   */
  getSubtotalCoordinates = (subtotalAddress, subtotalsAddresses) => {
    console.time('Get subtotals coordinates');
    for (let i = 0; i < subtotalAddress.length; i += 1) {
      // eslint removed Boolean(subtotalAddress[i])
      if (subtotalAddress[i]) { subtotalsAddresses.push(subtotalAddress[i]); }
    }
    console.timeEnd('Get subtotals coordinates');
  }

  /**
   * Synchronise all changes to Excel up to this point. Clears stored promises after sync.
   *
   * @param {Array} contextPromises Array excel context sync promises.
   * @param {Boolean} finalsync Specify whether this will be last sync after inserting data into table.
   * @memberof officeDisplayService
   */
  syncChangesToExcel = async (contextPromises, finalsync) => {
    if (contextPromises.length % PROMISE_LIMIT === 0) {
      console.time('Waiting for pending context syncs');
      await Promise.all(contextPromises);
      console.timeEnd('Waiting for pending context syncs');
      contextPromises = [];
    } else if (finalsync) {
      console.time('Context sync');
      await Promise.all(contextPromises);
      console.timeEnd('Context sync');
    }
  }

  /**
   * Appends rows with data to Excel table only.
   *
   * @param {Array} excelRows Array of table data
   * @param {Office} excelContext
   * @param {Office} officeTable reference to Excel table
   * @param {Number} rowIndex Specify from row we should append rows
   * @param {Boolean} tableColumnsChanged
   * @param {Boolean} isRefresh
   * @memberof officeDisplayService
   */
  async appendRowsToTable(excelRows, excelContext, officeTable, rowIndex, tableColumnsChanged, isRefresh) {
    console.group('Append rows');
    const splitExcelRows = this.getExcelRows(excelRows);
    for (let i = 0; i < splitExcelRows.length; i += 1) {
      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
      // Get resize range: The number of rows/cols by which to expand the bottom-right corner,
      // relative to the current range.
      const rowRange = officeTable
        .getDataBodyRange()
        .getRow(rowIndex)
        .getResizedRange(splitExcelRows[i].length - 1, 0);
      rowIndex += splitExcelRows[i].length;
      if (!tableColumnsChanged && isRefresh) { rowRange.clear('Contents'); }
      rowRange.values = splitExcelRows[i];
      console.time(`Sync for ${splitExcelRows[i].length} rows`);
      // eslint-disable-next-line no-await-in-loop
      await excelContext.sync();
      console.timeEnd(`Sync for ${splitExcelRows[i].length} rows`);
    }
    console.groupEnd('Append rows');
  }

  /**
   * Return Excel Rows that will be added to table if needed rows will be splitted into chunks that meets limit of 5MB
   *
   * @param {Array} excelRows Array of table data
   * @returns {Array} Array with sub-arrays with size not more than 5MB
   * @memberof officeDisplayService
   */
  getExcelRows(excelRows) {
    console.time('Split Rows');
    let splitExcelRows = [excelRows];
    if (this.sizeOfObject(excelRows) > 5) { splitExcelRows = this.splitExcelRows(excelRows); }
    console.timeEnd('Split Rows');
    return splitExcelRows;
  }
}
export const officeDisplayService = new OfficeDisplayService();
export default officeDisplayService;
