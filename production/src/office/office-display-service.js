import { officeApiHelper } from './office-api-helper';
import officeTableHelper from './office-table/office-table-helper';
import officeTableService from './office-table/office-table-service';
import officeFormattingData from './office-formatting/office-formatting-data';
import {
  mstrObjectRestService,
  DATA_LIMIT,
  PROMISE_LIMIT,
  IMPORT_ROW_LIMIT,
} from '../mstr-object/mstr-object-rest-service';
import { CLEAR_PROMPTS_ANSWERS } from '../navigation/navigation-tree-actions';
import { officeProperties } from './store/office-properties';
import { officeStoreService } from './store/office-store-service';
import { PopupTypeEnum } from '../home/popup-type-enum';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import {
  NO_DATA_RETURNED,
  ALL_DATA_FILTERED_OUT,
  ERROR_POPUP_CLOSED,
  incomingErrorStrings,
  errorTypes,
  INVALID_VIZ_KEY_MESSAGE
} from '../error/constants';
import officeFormattingSubtotals from './office-formatting/office-formatting-subtotals';
import officeFormattingTable from './office-formatting/office-formatting-table';

const {
  getObjectInfo,
  getObjectDefinition,
  getVisualizationInfo,
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
   * Main function in office Display Service responsible for import/refresh and display workflow.
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
   * @param {Object} [parameter.subtotalsInfo] Contains information if subtotals are defined in the response,
   *  if they are visible, also includes the subtotalsAdresses and subtotal value we set for toggle in prepare data.
   * @param {Object} [parameter.subtotalsInfo.subtotalsDefined=false]
   * information that if the subtotals are defined in response
   * @param {Object} [parameter.subtotalsInfo.subtotalsVisible=false]
   * information that if the subtotals are visible in response
   * @param {Object} [parameter.subtotalsInfo.subtotalsAddresses=false] Contains information of subtotal adresses.
   * @param {Object} [parameter.subtotalsInfo.importSubtotal=false]
   * information that if the subtotals will be imported from the prepare data
   * @param {Object} [parameter.visualizationInfo=false]
   * @param {Object} [parameter.preparedInstanceId] Instance created before import workflow.
   * @param {Object} [parameter.manipulationsXML=false] Dossier Manipulation for imported visualization
   * @param {Object} [parameter.isRefreshAll]
   * @param {Boolean} [parameter.insertNewWorksheet] Flag for inserting new excel worksheet before import
   * @param {Boolean} [parameter.originalObjectName]
   * Name of original object to create originalName + copy during duplicate workflow
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
    let newOfficeTableName;
    let shouldFormat;
    let excelContext;
    let startCell;
    let tableColumnsChanged;
    let instanceDefinition;
    let officeTable;
    let newBindingId = bindingId;
    try {
      excelContext = await officeApiHelper.getExcelContext();

      // Get excel context and initial cell
      console.group('Importing data performance');
      console.time('Total');
      console.time('Init excel');
      if (insertNewWorksheet) {
        await officeApiHelper.createAndActivateNewWorksheet(excelContext);
      }
      startCell = selectedCell || (await officeApiHelper.getSelectedCell(excelContext));
      console.timeEnd('Init excel');

      const connectionData = {
        objectId,
        projectId,
        dossierData,
        mstrObjectType,
        body,
        preparedInstanceId,
        manipulationsXML,
        promptsAnswers,
      };

      // Get mstr instance definition
      console.time('Instance definition');
      ({ body, instanceDefinition, visualizationInfo } = await this.getInstaceDefinition(
        connectionData,
        visualizationInfo,
        displayAttrFormNames
      ));
      console.timeEnd('Instance definition');


      this.savePreviousObjectData(instanceDefinition, crosstabHeaderDimensions, subtotalsAddresses);
      const { mstrTable } = instanceDefinition;

      // Check if instance returned data
      if (mstrTable.rows.length === 0) {
        return {
          type: 'warning',
          message: isPrompted ? ALL_DATA_FILTERED_OUT : NO_DATA_RETURNED,
        };
      }

      // Create or update table
      ({
        officeTable, newOfficeTableName, shouldFormat, tableColumnsChanged, newBindingId
      } = await officeTableService
        .getOfficeTable(
          isRefresh,
          excelContext,
          bindingId,
          instanceDefinition,
          startCell,
          tableName,
          previousTableDimensions,
          visualizationInfo
        ));

      const officeData = {
        officeTable,
        excelContext,
        startCell,
      };

      // Apply formatting when table was created
      if (shouldFormat && !mstrTable.isCrosstabular) {
        await officeFormattingData.applyFormatting(officeData, instanceDefinition);
      }

      // Fetch, convert and insert with promise generator
      console.time('Fetch and insert into excel');

      await this.fetchInsertDataIntoExcel({
        connectionData,
        officeData,
        instanceDefinition,
        isRefresh,
        startCell,
        tableColumnsChanged,
        visualizationInfo,
        importSubtotal,
        displayAttrFormNames
      });

      if (shouldFormat) {
        await officeFormattingTable.formatTable(officeData, mstrTable);
      }

      if (mstrTable.subtotalsInfo.subtotalsAddresses.length) {
        // Removing duplicated subtotal addresses from headers
        await officeFormattingSubtotals.applySubtotalFormatting(officeData, instanceDefinition.mstrTable);
      }

      await this.bindOfficeTable(officeData, newBindingId);


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
        bindId: newBindingId,
        oldTableId: bindingId,
        projectId,
        envUrl : officeApiHelper.getCurrentMstrContext(),
        body,
        objectType: mstrObjectType,
        isCrosstab: mstrTable.isCrosstab,
        isPrompted,
        promptsAnswers,
        subtotalsInfo: mstrTable.subtotalsInfo,
        visualizationInfo,
        id: objectId,
        isLoading: false,
        crosstabHeaderDimensions: mstrTable.crosstabHeaderDimensions,
        tableName: newOfficeTableName,
        tableDimensions: { columns: instanceDefinition.columns },
        displayAttrFormNames
      }, isRefresh);

      console.timeEnd('Total');
      this.reduxStore.dispatch({ type: CLEAR_PROMPTS_ANSWERS });
      this.reduxStore.dispatch({
        type: officeProperties.actions.finishLoadingReport,
        reportBindId: newBindingId,
      });
      return {
        type: 'success',
        message: 'Data loaded successfully'
      };
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
      if (bindingId && newBindingId) {
        this.reduxStore.dispatch({
          type: officeProperties.actions.finishLoadingReport,
          reportBindId: newBindingId,
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
        console.log('isCrosstab && officeTable:', isCrosstab && officeTable);
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

  bindOfficeTable = async ({ officeTable, excelContext }, newBindingId) => {
    officeTable.load('name');
    await excelContext.sync();
    const tablename = officeTable.name;
    await officeApiHelper.bindNamedItem(tablename, newBindingId);
  }

  savePreviousObjectData = (instanceDefinition, crosstabHeaderDimensions, subtotalsAddresses) => {
    const { mstrTable } = instanceDefinition;
    mstrTable.prevCrosstabDimensions = crosstabHeaderDimensions;
    mstrTable.crosstabHeaderDimensions = mstrTable.isCrosstab
      ? officeTableHelper.getCrosstabHeaderDimensions(instanceDefinition)
      : false;
    mstrTable.subtotalsInfo.subtotalsAddresses = subtotalsAddresses;
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
  async getInstaceDefinition(
    connectionData,
    visualizationInfo,
    displayAttrFormNames
  ) {
    let instanceDefinition;
    let { body } = connectionData;
    const { mstrObjectType } = connectionData;

    if (body && body.requestedObjects) {
      if (body.requestedObjects.attributes.length === 0 && body.requestedObjects.metrics.length === 0) {
        body.requestedObjects = undefined;
      }
      body.template = body.requestedObjects;
    }

    const config = {
      ...connectionData,
      displayAttrFormNames,
    };

    if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
      ({ body, visualizationInfo, instanceDefinition } = await this.getDossierInstanceDefinition(
        config, visualizationInfo,
      ));
    } else {
      instanceDefinition = await createInstance(config);
    }


    // Status 2 = report has open prompts to be answered before data can be returned
    if (instanceDefinition.status === 2) {
      instanceDefinition = await this.modifyInstanceWithPrompt(instanceDefinition, config);
    }

    return {
      body,
      instanceDefinition,
      visualizationInfo,
    };
  }

  /**
   * Returns an error type based on error get from visualization importing.
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

  async getDossierInstanceDefinition(
    {
      projectId,
      objectId,
      body,
      dossierData,
      displayAttrFormNames,
      manipulationsXML,
      preparedInstanceId,
    },
    visualizationInfo,
  ) {
    if (manipulationsXML) {
      if (!body) {
        body = {};
      }
      body.manipulations = manipulationsXML.manipulations;
      body.promptAnswers = manipulationsXML.promptAnswers;
    }
    console.log('body:', body);

    let instanceId;

    try {
      instanceId = preparedInstanceId || (await createDossierInstance(projectId, objectId, body));
    } catch (error) {
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier;
      throw error;
    }

    const updatedVisualizationInfo = await getVisualizationInfo(projectId, objectId, visualizationInfo.visualizationKey, instanceId);

    if (!updatedVisualizationInfo) {
      throw new Error(INVALID_VIZ_KEY_MESSAGE);
    }
    visualizationInfo = updatedVisualizationInfo;

    const config = {
      projectId,
      objectId,
      instanceId,
      mstrObjectType : mstrObjectEnum.mstrObjectType.dossier.name,
      dossierData,
      body,
      visualizationInfo,
      displayAttrFormNames
    };

    let temporaryInstanceDefinition;

    try {
      temporaryInstanceDefinition = await fetchVisualizationDefinition(config);
    } catch (error) {
      error.type = this.getVisualizationErrorType(error);
      throw error;
    }
    const instanceDefinition = {
      ...temporaryInstanceDefinition,
      instanceId
    };
    return { body, visualizationInfo, instanceDefinition };
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
      const {
        objectId, projectId, dossierData, mstrObjectType
      } = connectionData;
      const { excelContext } = officeData;
      const { columns, rows, mstrTable } = instanceDefinition;
      const limit = Math.min(Math.floor(DATA_LIMIT / columns), IMPORT_ROW_LIMIT);
      const configGenerator = {
        instanceDefinition,
        objectId,
        projectId,
        mstrObjectType,
        dossierData,
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

        await this.appendRows(
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

        await this.syncChangesToExcel(contextPromises, false);
        console.groupEnd();
      }
      console.timeEnd('Fetch and insert into excel');

      mstrTable.subtotalsInfo.subtotalsAddresses = subtotalsAddresses;
      mstrTable.subtotalsInfo.importSubtotal = importSubtotal;

      await this.syncChangesToExcel(contextPromises, true);
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
  appendRows = async (
    officeData,
    excelRows,
    rowIndex,
    isRefresh = false,
    tableColumnsChanged,
    contextPromises,
    header,
    mstrTable) => {
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
      if (!changed) { isFitSize = true; }
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
        if (bytes / 1000000 > 5) { return true; } // we return true when the size is bigger than 5MB
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
  modifyInstanceWithPrompt = async (
    instanceDefinition,
    {
      objectId,
      projectId,
      promptsAnswers,
      dossierData,
      body,
      displayAttrFormNames
    }) => {
    try {
      let count = 0;
      while (instanceDefinition.status === 2 && count < promptsAnswers.length) {
        const config = {
          objectId,
          projectId,
          instanceId: instanceDefinition.instanceId,
          promptsAnswers: promptsAnswers[count]
        };

        await answerPrompts(config);
        const configInstance = {
          ...config,
          dossierData,
          body,
          displayAttrFormNames
        };
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

  prepareNewNameForDuplicatedObject = (originalObjectName) => {
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

  checkAndSolveNameConflicts = (nameCandidate) => {
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
