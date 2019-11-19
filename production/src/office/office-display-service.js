import { officeApiHelper } from './office-api-helper';
import officeTableHelper from './office-table-helper';
import officeFormattingHelper from './office-formatting-helper';
import {
  DATA_LIMIT,
  PROMISE_LIMIT,
  IMPORT_ROW_LIMIT,
  CONTEXT_LIMIT,
  getObjectInfo,
  getObjectDefinition,
  createInstance,
  getObjectContentGenerator,
  answerPrompts,
  modifyInstance,
  createDossierInstance,
  fetchVisualizationDefinition,
  getDossierDefinition,
} from '../mstr-object/mstr-object-rest-service';
import { reduxStore } from '../store';
import { officeProperties } from './office-properties';
import { officeStoreService } from './store/office-store-service';
import { errorService } from '../error/error-handler';
import { popupController } from '../popup/popup-controller';
import { authenticationHelper } from '../authentication/authentication-helper';
import { PopupTypeEnum } from '../home/popup-type-enum';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import {
  NOT_SUPPORTED_NO_ATTRIBUTES,
  ALL_DATA_FILTERED_OUT,
  ERROR_POPUP_CLOSED,
} from '../error/constants';


class OfficeDisplayService {
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
      excelContext = await officeApiHelper.getExcelContext();
      startCell = selectedCell || (await officeApiHelper.getSelectedCell(excelContext));
      console.timeEnd('Init excel');

      // Get mstr instance definition
      console.time('Instance definition');
      ({ body, instanceDefinition } = await this.getInstaceDefinition(body, mstrObjectType, manipulationsXML, preparedInstanceId, projectId, objectId, dossierData, visualizationInfo, promptsAnswers));
      const { mstrTable } = instanceDefinition;
      isCrosstab = mstrTable.isCrosstab;
      mstrTable.prevCrosstabDimensions = crosstabHeaderDimensions;
      mstrTable.crosstabHeaderDimensions = isCrosstab
        ? officeTableHelper.getCrosstabHeaderDimensions(instanceDefinition)
        : false;
      mstrTable.subtotalsAddresses = subtotalsAddresses;
      console.timeEnd('Instance definition');

      // Check if instance returned data
      if (!instanceDefinition || instanceDefinition.mstrTable.rows.length === 0) {
        return {
          type: 'warning',
          message: isPrompted ? ALL_DATA_FILTERED_OUT : NOT_SUPPORTED_NO_ATTRIBUTES,
        };
      }

      // TODO: If isRefresh check if new instance definition is same as before

      // Create or update table
      ({ officeTable, newOfficeTableId, shouldFormat, tableColumnsChanged } = await officeTableHelper.getOfficeTable(isRefresh, excelContext, bindingId, instanceDefinition, startCell));

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

      if (subtotalsAddresses.length) {
        // Removing duplicated subtotal addresses from headers
        await officeFormattingHelper.applySubtotalFormatting(isCrosstab, subtotalsAddresses, officeTable, excelContext, mstrTable);
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
      officeStoreService.addObjectToStore({
        isRefresh,
        instanceDefinition,
        bindingId,
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
        objectId,
      });

      console.timeEnd('Total');
      reduxStore.dispatch({
        type: officeProperties.actions.finishLoadingReport,
        reportBindId: bindingId,
      });
      return { type: 'success', message: 'Data loaded successfully' };
    } catch (error) {
      if (officeTable && !isRefresh) {
        let crosstabRange;
        if (isCrosstab) {
          const sheet = officeTable.worksheet;
          crosstabRange = officeApiHelper.getCrosstabRange(officeTable.getRange().getCell(0, 0),
            crosstabHeaderDimensions,
            sheet);
        }
        officeTable.delete();
        if (isCrosstab) (await crosstabRange.clear());
      }
      throw error;
    } finally {
      excelContext = excelContext || await officeApiHelper.getExcelContext();
      if (!isRefreshAll) {
        reduxStore.dispatch({
          type: officeProperties.actions.finishLoadingReport,
          reportBindId: bindingId,
        });
        this.dispatchPrintFinish();
      }
      await excelContext.sync();
      console.groupEnd();
    }
  };

  removeReportFromExcel = async (
    bindingId,
    isCrosstab,
    crosstabHeaderDimensions,
    isRefresh,
  ) => {
    let crosstabRange;
    try {
      await authenticationHelper.validateAuthToken();
      const officeContext = await officeApiHelper.getOfficeContext();
      try {
        await officeContext.document.bindings.releaseByIdAsync(bindingId,
          () => {
            console.log('released binding');
          });
        const excelContext = await officeApiHelper.getExcelContext();
        const tableObject = excelContext.workbook.tables.getItem(bindingId);
        if (isCrosstab) {
          officeApiHelper.clearEmptyCrosstabRow(tableObject); // Since showing Excel table header dont override the data but insert new row, we clear values from empty row in crosstab to prevent it
          tableObject.showHeaders = true;
          crosstabRange = await officeApiHelper.getCrosstabRangeSafely(tableObject,
            crosstabHeaderDimensions,
            excelContext);
          excelContext.trackedObjects.add(crosstabRange);
        }
        await tableObject.clearFilters();
        // since we are removing table from Excel, we don't need event to be emitted
        excelContext.runtime.enableEvents = false;
        await excelContext.sync();
        await tableObject.delete();
        if (isCrosstab) {
          await crosstabRange.clear();
          excelContext.trackedObjects.remove(crosstabRange);
        }
        excelContext.runtime.enableEvents = true;
        await excelContext.sync();
        return !isRefresh && officeStoreService.removeReportFromStore(bindingId);
      } catch (e) {
        if (e.code === 'ItemNotFound') {
          return !isRefresh && officeStoreService.removeReportFromStore(bindingId);
        }
        throw e;
      }
    } catch (error) {
      return errorService.handleError(error);
    }
  };

  /**
   * Function closes popup; used when  importing report
   * it swallows error from office if dialog has been closed by user
   *
   * @memberOf OfficeDisplayService
   */
  dispatchPrintFinish = () => {
    const reduxStoreState = reduxStore.getState();
    reduxStore.dispatch({ type: officeProperties.actions.popupHidden });
    reduxStore.dispatch({ type: officeProperties.actions.stopLoading });
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

  async getInstaceDefinition(body, mstrObjectType, manipulationsXML, preparedInstanceId, projectId, objectId, dossierData, visualizationInfo, promptsAnswers) {
    let instanceDefinition;
    if (body) {
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
    return { body, instanceDefinition };
  }

  async getObjectInformation(mstrObjectType, isPrompted, objectId, projectId) {
    if (mstrObjectType.name !== mstrObjectEnum.mstrObjectType.visualization.name) {
      const objectInfo = isPrompted
        ? await getObjectInfo(objectId, projectId, mstrObjectType)
        : await getObjectDefinition(objectId, projectId, mstrObjectType);
      reduxStore.dispatch({
        type: officeProperties.actions.preLoadReport,
        preLoadReport: objectInfo,
      });
    }
    await popupController.runPopup(PopupTypeEnum.loadingPage, 22, 28);
  }

  async fetchInsertDataIntoExcel({ connectionData, officeData, instanceDefinition, isRefresh, tableColumnsChanged, visualizationInfo }) {
    try {
      const { objectId, projectId, dossierData, mstrObjectType } = connectionData;
      const { excelContext, officeTable } = officeData;
      const { columns, rows, mstrTable } = instanceDefinition;
      const limit = Math.min(Math.floor(DATA_LIMIT / columns),
        IMPORT_ROW_LIMIT);
      const configGenerator = { instanceDefinition, objectId, projectId, mstrObjectType, dossierData, limit, visualizationInfo, };
      const rowGenerator = getObjectContentGenerator(configGenerator);
      let rowIndex = 0;
      let contextPromises = [];
      const subtotalsAddresses = [];
      console.time('Fetch data');
      // eslint-disable-next-line no-restricted-syntax, no-unused-vars
      for await (const { row, header, subtotalAddress } of rowGenerator) {
        console.groupCollapsed(`Importing rows: ${rowIndex} to ${Math.min(rowIndex + limit, rows)}`);
        console.timeEnd('Fetch data');
        excelContext.workbook.application.suspendApiCalculationUntilNextSync();
        console.group('Append rows');
        await this.appendRowsToTable(officeTable, row, rowIndex, isRefresh, tableColumnsChanged, excelContext);
        console.groupEnd('Append rows');
        if (mstrTable.isCrosstab) {
          console.time('Append crosstab rows');
          this.appendCrosstabRowsToRange(officeTable, header.rows, rowIndex, isRefresh, excelContext);
          contextPromises.push(excelContext.sync());
          console.timeEnd('Append crosstab rows');
        }
        console.time('Get subtotals coordinates');
        for (let i = 0; i < subtotalAddress.length; i += 1) {
          // eslint removed Boolean(subtotalAddress[i])
          if (subtotalAddress[i]) subtotalsAddresses.push(subtotalAddress[i]);
        }
        console.timeEnd('Get subtotals coordinates');
        rowIndex += row.length;
        const promiseLength = contextPromises.length;
        if (promiseLength % PROMISE_LIMIT === 0) {
          console.time('Waiting for pending context syncs');
          await Promise.all(contextPromises);
          console.timeEnd('Waiting for pending context syncs');
          contextPromises = [];
        }
        console.time('Fetch data');
        console.groupEnd();
      }
      console.timeEnd('Fetch and insert into excel');
      console.time('Context sync');
      await Promise.all(contextPromises);
      console.timeEnd('Context sync');
      console.time('Column auto size');
      await officeApiHelper.formatTable(officeTable, mstrTable.isCrosstab, mstrTable.crosstabHeaderDimensions, excelContext);
      console.timeEnd('Column auto size');
      if (mstrTable.isCrosstab) officeTable.showHeaders = false;
      await excelContext.sync();
      return { officeTable, subtotalsAddresses };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  appendCrosstabRowsToRange = (officeTable, headerRows, rowIndex) => {
    const startCell = officeTable
      .getDataBodyRange()
      .getRow(0)
      .getCell(0, 0)
      .getOffsetRange(rowIndex, 0);
    officeApiHelper.createRowsHeaders(startCell, headerRows);
  }

  appendRowsToTable = async (officeTable, excelRows, rowIndex, isRefresh = false, tableColumnsChanged, excelContext) => {
    console.time('Split Rows');
    let splitExcelRows = [excelRows];
    if (this.sizeOfObject(excelRows) > 5) splitExcelRows = this.splitExcelRows(excelRows);
    console.timeEnd('Split Rows');
    // Get resize range: The number of rows/cols by which to expand the bottom-right corner,
    // relative to the current range.
    for (let i = 0; i < splitExcelRows.length; i += 1) {
      excelContext.workbook.application.suspendApiCalculationUntilNextSync();
      const rowRange = officeTable
        .getDataBodyRange()
        .getRow(rowIndex)
        .getResizedRange(splitExcelRows[i].length - 1, 0);
      rowIndex += splitExcelRows[i].length;
      if (!tableColumnsChanged && isRefresh) rowRange.clear('Contents');
      rowRange.values = splitExcelRows[i];
      console.time(`Sync for ${splitExcelRows[i].length} rows`);
      await excelContext.sync();
      console.timeEnd(`Sync for ${splitExcelRows[i].length} rows`);
    }
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
            }
          }
        }
      }
    }
    return undefined;
  }


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
}
export const officeDisplayService = new OfficeDisplayService();
export default officeDisplayService;
