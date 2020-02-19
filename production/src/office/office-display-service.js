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
  NO_DATA_RETURNED,
  ALL_DATA_FILTERED_OUT,
  ERROR_POPUP_CLOSED,
  incomingErrorStrings,
  errorTypes
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
   * 9.Get visualization breadcrumbs
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
   * @param {Object} [parameter.subtotalsInfo] Contains information if subtotals are defined in the response, if they are visible, also includes the subtotalsAdresses and subtotal value we set for toggle in prepare data.
   * @param {Object} [parameter.subtotalsInfo.subtotalsDefined=false] information that if the subtotals are defined in response
   * @param {Object} [parameter.subtotalsInfo.subtotalsVisible=false] information that if the subtotals are visible in response
   * @param {Object} [parameter.subtotalsInfo.subtotalsAddresses=false] Contains information of subtotal adresses.
   * @param {Object} [parameter.subtotalsInfo.importSubtotal=false] information that if the subtotals will be imported from the prepare data
   * @param {Object} [parameter.visualizationInfo=false]
   * @param {Object} [parameter.preparedInstanceId] Instance created before import workflow.
   * @param {Object} [parameter.manipulationsXML=false] Dossier Manipulation for imported visualization
   * @param {Object} [parameter.isRefreshAll]
   * @param {Boolean} [parameter.insertNewWorksheet] Flag for inserting new excel worksheet before import
   * @param {Boolean} [parameter.originalObjectName] Name of original object to create originalName + copy during duplicate workflow
   * @param {String} [parameter.displayAttrFormNames] Name of the display attribute names option
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
    subtotalsInfo: {
      subtotalsDefined = false,
      subtotalsVisible = false,
      subtotalsAddresses = false,
      importSubtotal = true,
    } = false,
    visualizationInfo = false,
    preparedInstanceId,
    manipulationsXML = false,
    isRefreshAll,
    tableName,
    previousTableDimensions,
    insertNewWorksheet = false,
    originalObjectName,
    displayAttrFormNames = officeProperties.displayAttrFormNames.automatic
  }) => {
    let newOfficeTableId;
    let shouldFormat;
    let excelContext;
    let startCell;
    let tableColumnsChanged;
    let instanceDefinition;
    let officeTable;
    let bindId;
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
      if (insertNewWorksheet) {
        await officeApiHelper.createAndActivateNewWorksheet(excelContext);
      }
      startCell = selectedCell || (await officeApiHelper.getSelectedCell(excelContext));
      console.timeEnd('Init excel');

      // Get mstr instance definition
      console.time('Instance definition');
      ({ body, instanceDefinition, isCrosstab } = await this.getInstaceDefinition(
        body, mstrObjectType, manipulationsXML, preparedInstanceId, projectId, objectId, dossierData,
        visualizationInfo, promptsAnswers, crosstabHeaderDimensions, subtotalsAddresses, subtotalsDefined,
        subtotalsVisible, displayAttrFormNames
      ));
      const { mstrTable } = instanceDefinition;
      ({ crosstabHeaderDimensions } = mstrTable);
      console.timeEnd('Instance definition');

      // Check if instance returned data
      if (!instanceDefinition || mstrTable.rows.length === 0) {
        return {
          type: 'warning',
          message: isPrompted ? ALL_DATA_FILTERED_OUT : NO_DATA_RETURNED,
        };
      }

      // Create or update table
      ({ officeTable, newOfficeTableId, shouldFormat, tableColumnsChanged, bindId } = await officeTableHelper.getOfficeTable(
        isRefresh, excelContext, bindingId, instanceDefinition, startCell, tableName, previousTableDimensions
      ));

      // Apply formating for changed vizualization
      shouldFormat = (shouldFormat || visualizationInfo.formatShouldUpdate);

      // Apply formatting when table was created
      if (shouldFormat && !mstrTable.isCrosstabular) {
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
        importSubtotal,
        displayAttrFormNames
      }));

      if (shouldFormat) await officeFormattingHelper.formatTable(officeTable, isCrosstab, crosstabHeaderDimensions, excelContext);
      mstrTable.subtotalsInfo.subtotalsAddresses = subtotalsAddresses;
      mstrTable.subtotalsInfo.importSubtotal = importSubtotal;

      if (subtotalsAddresses.length) {
        // Removing duplicated subtotal addresses from headers
        await officeFormattingHelper.applySubtotalFormatting(isCrosstab, subtotalsAddresses, officeTable, excelContext, instanceDefinition.mstrTable);
      }

      // Get visualization path from dossier definition.
      // Used to show in sidebar placeholder
      if (objectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
        mstrTable.id = objectId;
        const dossierInstance = preparedInstanceId || instanceDefinition.instanceId;
        console.time('Get dossier structure');
        visualizationInfo = await mstrObjectRestService.getVisualizationInfo(projectId, objectId, visualizationInfo.visualizationKey, dossierInstance) || visualizationInfo;
        console.timeEnd('Get dossier structure');
      }

      const tableid = await this.bindOfficeTable(officeTable, excelContext, bindingId, bindId);
      // assign new name in duplicate workflow
      if (originalObjectName) {
        console.time('Duplicate renaming');
        const nameCandidate = this.prepareNewNameForDuplicatedObject(originalObjectName);
        const finalNewName = this.checkAndSolveNameConflicts(nameCandidate);
        mstrTable.name = finalNewName;
        console.timeEnd('Duplicate renaming');
      }

      // Save to store
      officeStoreService.saveAndPreserveReportInStore({
        name: mstrTable.name,
        manipulationsXML: instanceDefinition.manipulationsXML,
        bindId: tableid,
        oldTableId: bindingId,
        projectId,
        envUrl,
        body,
        objectType,
        isCrosstab,
        isPrompted,
        promptsAnswers,
        subtotalsInfo: mstrTable.subtotalsInfo,
        visualizationInfo,
        id: objectId,
        isLoading: false,
        crosstabHeaderDimensions,
        tableName: newOfficeTableId,
        tableDimensions: { columns: instanceDefinition.columns },
        displayAttrFormNames
      }, isRefresh);

      console.timeEnd('Total');
      this.reduxStore.dispatch({ type: CLEAR_PROMPTS_ANSWERS });
      this.reduxStore.dispatch({
        type: officeProperties.actions.finishLoadingReport,
        reportBindId: tableid,
      });
      return { type: 'success', message: 'Data loaded successfully' };
    } catch (error) {
      const isError = true;
      if (officeTable) {
        if (!isRefresh) {
          officeTable.showHeaders = true;
          await officeApiHelper.deleteExcelTable(
            officeTable,
            excelContext,
            isCrosstab,
            instanceDefinition.mstrTable.crosstabHeaderDimensions
          );
        } else if (isCrosstab) {
          // hides table headers for crosstab if we fail on refresh
          officeTable.showHeaders = false;
        }
      }
      if (bindingId && bindId) {
        this.reduxStore.dispatch({
          type: officeProperties.actions.finishLoadingReport,
          reportBindId: bindId,
          isRefreshAll: false,
          isError,
        });
      } else if (bindingId) {
        this.reduxStore.dispatch({
          type: officeProperties.actions.finishLoadingReport,
          reportBindId: bindingId,
          isRefreshAll: false,
          isError,
        });
      }
      throw error;
    } finally {
      if (!isRefreshAll) {
        this.dispatchPrintFinish();
      }
      if (isCrosstab && officeTable) {
        officeTable.showHeaders = false;
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

  bindOfficeTable = async (officeTable, excelContext, bindingId, bindId) => {
    officeTable.load('name');
    await excelContext.sync();
    const tablename = officeTable.name;
    let tableid = bindingId;
    if (!bindingId || (bindId && (bindingId !== bindId))) {
      tableid = bindId;
    }
    await officeApiHelper.bindNamedItem(tablename, tableid);
    return tableid;
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
   * @param {Boolean} subtotalsDefined Information if the report has subtotals
   * @param {Boolean} subtotalsVisible Information if the subtotals are visible
   * @returns {Object} Object containing officeTable and subtotalAddresses
   * @memberof officeDisplayService
   */
  async getInstaceDefinition(body, mstrObjectType, manipulationsXML, preparedInstanceId, projectId, objectId, dossierData, visualizationInfo, promptsAnswers, crosstabHeaderDimensions, subtotalsAddresses, subtotalsDefined, subtotalsVisible, displayAttrFormNames) {
    let instanceDefinition;
    if (body && body.requestedObjects) {
      if (body.requestedObjects.attributes.length === 0 && body.requestedObjects.metrics.length === 0) {
        body.requestedObjects = undefined;
      }
      body.template = body.requestedObjects;
    }
    if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
      if (manipulationsXML) {
        if (!body) {
          body = {};
        }
        body.manipulations = manipulationsXML.manipulations;
        body.promptAnswers = manipulationsXML.promptAnswers;
      }
      let instanceId;
      try {
        instanceId = preparedInstanceId || (await createDossierInstance(projectId, objectId, body));
      } catch (error) {
        error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
        throw error;
      }
      const config = { projectId, objectId, instanceId, mstrObjectType, dossierData, body, visualizationInfo, displayAttrFormNames };
      let temporaryInstanceDefinition;
      try {
        temporaryInstanceDefinition = await fetchVisualizationDefinition(config);
      } catch (error) {
        error.type = this.getVisualizationErrorType(error);
        throw error;
      }
      instanceDefinition = { ...temporaryInstanceDefinition, instanceId };
    } else {
      const config = { objectId, projectId, mstrObjectType, dossierData, body, displayAttrFormNames };
      instanceDefinition = await createInstance(config);
    }
    // Status 2 = report has open prompts to be answered before data can be returned
    if (instanceDefinition.status === 2) {
      instanceDefinition = await this.answerPrompts(instanceDefinition, objectId, projectId, promptsAnswers, dossierData, body, displayAttrFormNames);
    }

    const { mstrTable } = instanceDefinition;
    const { isCrosstab } = mstrTable;
    mstrTable.prevCrosstabDimensions = crosstabHeaderDimensions;
    mstrTable.crosstabHeaderDimensions = isCrosstab
      ? officeTableHelper.getCrosstabHeaderDimensions(instanceDefinition)
      : false;
    mstrTable.subtotalsInfo.subtotalsAddresses = subtotalsAddresses;
    ({ subtotalsDefined, subtotalsVisible } = mstrTable.subtotalsInfo);
    return { body, instanceDefinition, isCrosstab, subtotalsDefined, subtotalsVisible };
  }

  /**
   * Returns error type based on error get from visualization importing.
   *
   * @param {Object} error
   * @return {String || undefined} errorType
   * @memberOf officeDisplayService
   */
  getVisualizationErrorType = (error) => {
    if (!error) {
      return;
    }

    let errorType = error.type;
    if ((error.message && error.message.includes(incomingErrorStrings.INVALID_VIZ_KEY))
      || (error.response
        && error.response.body
        && error.response.body.message
        && error.response.body.message.includes(incomingErrorStrings.INVALID_VIZ_KEY))
    ) {
      errorType = errorTypes.INVALID_VIZ_KEY;
    }

    return errorType;
  };

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
  async fetchInsertDataIntoExcel({ connectionData, officeData, instanceDefinition, isRefresh, tableColumnsChanged, visualizationInfo, importSubtotal, displayAttrFormNames }) {
    try {
      const { objectId, projectId, dossierData, mstrObjectType } = connectionData;
      const { excelContext, officeTable } = officeData;
      const { columns, rows, mstrTable } = instanceDefinition;
      const limit = Math.min(Math.floor(DATA_LIMIT / columns), IMPORT_ROW_LIMIT);
      const configGenerator = { instanceDefinition, objectId, projectId, mstrObjectType, dossierData, limit, visualizationInfo, displayAttrFormNames };
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
        if (importSubtotal) this.getSubtotalCoordinates(subtotalAddress, subtotalsAddresses);
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
    console.time('Split Rows');
    do {
      const tempSplit = [];
      let changed = false;
      for (let i = 0; i < splitRows.length; i += 1) {
        // 5 MB is a limit for excel
        if (this.checkIfSizeOverLimit(splitRows[i])) {
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
    console.timeEnd('Split Rows');
    return splitRows;
  }

  /**
   * Check size of passed object in MB
   *
   * @param {Object} object Item to check size of
   * @returns {Boolean} information whether the size of passed object is bigger than 5MB
   * @memberof officeDisplayService
   */
  checkIfSizeOverLimit = (chunk) => {
    let bytes = 0;
    for (let i = 0; i < chunk.length; i++) {
      for (let j = 0; j < chunk[0].length; j++) {
        if (typeof chunk[i][j] === 'string') {
          bytes += chunk[i][j].length * 2;
        } else if (typeof chunk[i][j] === 'number') {
          bytes += 8;
        } else {
          bytes += 2;
        }
        if (bytes / 1000000 > 5) return true; // we return true when the size is bigger than 5MB
      }
    }
    return false;
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
  answerPrompts = async (instanceDefinition, objectId, projectId, promptsAnswers, dossierData, body, displayAttrFormNames) => {
    try {
      let count = 0;
      while (instanceDefinition.status === 2 && count < promptsAnswers.length) {
        const config = { objectId, projectId, instanceId: instanceDefinition.instanceId, promptsAnswers: promptsAnswers[count] };
        await answerPrompts(config);
        const configInstance = { objectId, projectId, dossierData, body, instanceId: instanceDefinition.instanceId, displayAttrFormNames };
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
    const isOverLimit = this.checkIfSizeOverLimit(excelRows);
    const splitExcelRows = this.getExcelRows(excelRows, isOverLimit);
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
      if (isOverLimit) {
        console.time(`Sync for ${splitExcelRows[i].length} rows`);
        // eslint-disable-next-line no-await-in-loop
        await excelContext.sync();
        console.timeEnd(`Sync for ${splitExcelRows[i].length} rows`);
      }
    }
    console.groupEnd('Append rows');
  }

  /**
   * Return Excel Rows that will be added to table if needed rows will be splitted into chunks that meets limit of 5MB
   *
   * @param {Array} excelRows Array of table data
   * @param {Boolean} isOverLimit Specify if the passed Excel rows are over 5MB limit
   * @returns {Array} Array with sub-arrays with size not more than 5MB
   * @memberof officeDisplayService
   */
  getExcelRows(excelRows, isOverLimit) {
    let splitExcelRows = [excelRows];
    if (isOverLimit) { splitExcelRows = this.splitExcelRows(excelRows); }
    return splitExcelRows;
  }

  prepareNewNameForDuplicatedObject(originalObjectName) {
    const splitedName = originalObjectName.split(' ');
    const nrOfWords = splitedName.length;

    const lastWordIndex = nrOfWords - 1;
    const lastWord = splitedName[lastWordIndex];
    const lastWordAsNumber = Number(lastWord);

    const secondLastWordIndex = nrOfWords - 2;
    const secondLastWord = splitedName[secondLastWordIndex];

    if ((Number.isNaN(lastWordAsNumber)) && (lastWord !== 'copy')) {
      splitedName.push('copy');
    } else if (lastWord === 'copy') {
      splitedName.push('1');
    } else if (secondLastWord === 'copy') {
      splitedName.pop();
      splitedName.push(`${lastWordAsNumber + 1}`);
    } else {
      splitedName.push('copy');
    }

    const nameCandidate = splitedName.join(' ');

    return nameCandidate;
  }

  checkAndSolveNameConflicts(nameCandidate) {
    const splitedName = nameCandidate.split(' ');
    let finalNameCandidate = nameCandidate;

    const reportsArray = [...officeStoreService.getReportProperties()];
    const reportsArrayNames = [];
    for (const report of reportsArray) {
      reportsArrayNames.push(report.name);
    }

    while (reportsArrayNames.includes(finalNameCandidate)) {
      if (splitedName[splitedName.length - 1] === 'copy') {
        splitedName.push(1);
      } else {
        const last = splitedName.pop();
        const last2Number = Number(last);
        splitedName.push(`${last2Number + 1}`);
      }
      finalNameCandidate = splitedName.join(' ');
    }
    return finalNameCandidate;
  }
}


export const officeDisplayService = new OfficeDisplayService();
export default officeDisplayService;
