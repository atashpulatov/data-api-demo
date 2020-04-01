import { officeApiHelper } from './api/office-api-helper';
import { officeProperties } from './store/office-properties';
import { officeStoreService } from './store/office-store-service';

import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import mstrObjectInstance from '../mstr-object/mstr-object-instance';

import officeTableHelper from './table/office-table-helper';
import officeTableService from './table/office-table-service';
import officeFormattingData from './format/office-format-data';
import officeFormatTable from './format/office-format-table';
import officeImportService from './import/office-import-service';
import officeDuplicateService from './office-duplicate-service';
import officeFormatSubtotals from './format/office-format-subtotals';

import { CLEAR_PROMPTS_ANSWERS } from '../navigation/navigation-tree-actions';
import { NO_DATA_RETURNED, ALL_DATA_FILTERED_OUT } from '../error/constants';
import { officeApiWorksheetHelper } from './api/office-api-worksheet-helper';
import { officeApiRemoveHelper } from './api/office-api-remove-helper';


class OfficeDisplayService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
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
      startCell = await this.getStartCell(insertNewWorksheet, excelContext, startCell, selectedCell);
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
      ({ body, instanceDefinition, visualizationInfo } = await mstrObjectInstance.getInstaceDefinition(
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
        officeTable,
        newOfficeTableName,
        shouldFormat,
        tableColumnsChanged,
        newBindingId
      } = await officeTableService.getOfficeTable(
        {
          isRefresh,
          excelContext,
          bindingId,
          instanceDefinition,
          startCell,
          tableName,
          previousTableDimensions,
          visualizationInfo
        }
      ));


      const officeData = {
        officeTable,
        excelContext,
        startCell,
      };

      // Apply number formatting after table was created
      if (shouldFormat && !mstrTable.isCrosstabular) {
        await officeFormattingData.applyFormatting({ ...officeData, instanceDefinition });
      }

      // Fetch, convert and insert with promise generator
      console.time('Fetch and insert into excel');

      await officeImportService.fetchInsertDataIntoExcel({
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
        // excel column width autoresize
        await officeFormatTable.formatTable(officeData, mstrTable);
      }

      if (mstrTable.subtotalsInfo.subtotalsAddresses.length) {
        // Removing duplicated subtotal addresses from headers
        await officeFormatSubtotals.applySubtotalFormatting(officeData, instanceDefinition.mstrTable);
      }

      await officeTableService.bindOfficeTable(officeData, newBindingId);


      // assign new name in duplicate workflow
      if (originalObjectName) {
        console.time('Duplicate renaming');
        const nameCandidate = officeDuplicateService.prepareNewNameForDuplicatedObject(originalObjectName);
        const finalNewName = officeDuplicateService.checkAndSolveNameConflicts(nameCandidate);
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
          await officeApiRemoveHelper.removeExcelTable(
            officeTable,
            excelContext,
            isCrosstab,
            instanceDefinition.mstrTable.crosstabHeaderDimensions
          );
        } else if (instanceDefinition.mstrTable.isCrosstab) {
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
      if (instanceDefinition.mstrTable.isCrosstab && officeTable) {
        officeTable.showHeaders = false;
      }
      await excelContext.sync();
      console.groupEnd();
    }
  };

  savePreviousObjectData = (instanceDefinition, crosstabHeaderDimensions, subtotalsAddresses) => {
    const { mstrTable } = instanceDefinition;
    mstrTable.prevCrosstabDimensions = crosstabHeaderDimensions;
    mstrTable.crosstabHeaderDimensions = mstrTable.isCrosstab
      ? officeTableHelper.getCrosstabHeaderDimensions(instanceDefinition)
      : false;
    mstrTable.subtotalsInfo.subtotalsAddresses = subtotalsAddresses;
  }

  getStartCell = async (insertNewWorksheet, excelContext, startCell, selectedCell) => {
    if (insertNewWorksheet) {
      await officeApiWorksheetHelper.createAndActivateNewWorksheet(excelContext);
    }
    startCell = selectedCell || (await officeApiHelper.getSelectedCell(excelContext));
    return startCell;
  }
}


export const officeDisplayService = new OfficeDisplayService();
export default officeDisplayService;
