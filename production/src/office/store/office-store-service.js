import { officeProperties } from './office-properties';
import { RunOutsideOfficeError } from '../../error/run-outside-office-error';
import { errorService } from '../../error/error-handler';

import { SAVE_OBJECT_IN_EXCEL, IMPORT_OPERATION } from '../../operation/operation-steps';
import { markStepCompleted } from '../../operation/operation-actions';
import { restoreAllObjects, deleteObject } from '../../operation/object-actions';

/* global Office */

class OfficeStoreService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  saveAndPreserveReportInStore = async (objectData, { operationType }) => {
    const { instanceDefinition } = objectData;
    objectData.excelContext = false;
    objectData.officeTable = false;
    objectData.previousTableDimensions = { columns: instanceDefinition.columns };
    const { mstrTable } = instanceDefinition;
    const refreshDate = new Date();

    const report = {
      id: objectData.objectId,
      name: mstrTable.name,
      bindId: objectData.newBindingId,
      projectId: objectData.projectId,
      envUrl: objectData.envUrl,
      body: objectData.body,
      isLoading: false,
      objectType: objectData.mstrObjectType,
      isCrosstab: mstrTable.isCrosstab,
      isPrompted: objectData.isPrompted,
      subtotalsInfo: mstrTable.subtotalsInfo,
      promptsAnswers: objectData.promptsAnswers,
      crosstabHeaderDimensions: mstrTable.crosstabHeaderDimensions,
      visualizationInfo: objectData.visualizationInfo,
      manipulationsXML: instanceDefinition.manipulationsXML,
      tableName: objectData.newOfficeTableName,
      previousTableDimensions: objectData.previousTableDimensions,
      displayAttrFormNames: objectData.displayAttrFormNames,
      oldTableId: objectData.bindingId,
      objectWorkingId: objectData.objectWorkingId,
      refreshDate
    };
    console.log('bindId:', report.bindId);
    console.log('oldTableId:', report.oldTableId);

    if (operationType !== IMPORT_OPERATION) {
      try {
        const settings = this.getOfficeSettings();
        const reportsArray = [...this.getReportProperties()];
        const reportObj = reportsArray.find((element) => element.bindId === report.oldTableId);
        const ObjectIndex = reportsArray.indexOf(reportObj);
        const refreshedObject = reportsArray[ObjectIndex];
        refreshedObject.crosstabHeaderDimensions = report.crosstabHeaderDimensions;
        refreshedObject.isCrosstab = report.isCrosstab;
        refreshedObject.bindId = report.bindId;
        refreshedObject.previousTableDimensions = report.previousTableDimensions;
        refreshedObject.subtotalsInfo = report.subtotalsInfo;
        refreshedObject.displayAttrFormNames = report.displayAttrFormNames;
        refreshedObject.refreshDate = report.refreshDate;
        refreshedObject.preparedInstanceId = null;
        refreshedObject.objectWorkingId = report.objectWorkingId; // Revert when we connect reducer to excel settings
        if (refreshedObject.visualizationInfo) {
          refreshedObject.manipulationsXML = report.manipulationsXML;
          refreshedObject.visualizationInfo.dossierStructure = report.visualizationInfo.dossierStructure;
          if (refreshedObject.visualizationInfo.nameShouldUpdate) {
            // If visualization was changed, preserve new visualization name and new dossierStructure.
            refreshedObject.name = report.name;
            refreshedObject.visualizationInfo.nameShouldUpdate = false;
          }
        }

        console.log('refreshedObject:', refreshedObject);
        settings.set(officeProperties.loadedReportProperties, reportsArray);
        settings.saveAsync((saveAsync) => console.log(`Refresh ${saveAsync.status}`));
        console.log('settings.set(officeProperties.loadedReportProperties, reportsArray);:', settings.get(officeProperties.loadedReportProperties));
        await this.loadExistingReportBindingsExcel();
      } catch (error) {
        errorService.handleError(error);
      }
    } else {
      this.reduxStore.dispatch({
        type: officeProperties.actions.loadReport,
        report
      });
      await this.preserveReport(report);
    }
    console.timeEnd('Total');
    console.groupEnd();

    this.reduxStore.dispatch({
      type: officeProperties.actions.finishLoadingReport,
      reportBindId: objectData.newBindingId,
    });
    await this.saveObjectsInExcelStore();
    this.reduxStore.dispatch(markStepCompleted(objectData.objectWorkingId, SAVE_OBJECT_IN_EXCEL));
  };

  preserveReport = async (report) => {
    try {
      const settings = this.getOfficeSettings();
      const reportProperties = this.getReportProperties();
      reportProperties.unshift({
        id: report.id,
        name: report.name,
        bindId: report.bindId,
        projectId: report.projectId,
        envUrl: report.envUrl,
        body: report.body,
        objectType: report.objectType,
        isCrosstab: report.isCrosstab,
        isPrompted: report.isPrompted,
        subtotalsInfo: report.subtotalsInfo,
        promptsAnswers: report.promptsAnswers,
        crosstabHeaderDimensions: report.crosstabHeaderDimensions,
        visualizationInfo: report.visualizationInfo,
        manipulationsXML: report.manipulationsXML,
        tableName: report.tableName,
        tableDimensions: report.tableDimensions,
        displayAttrFormNames: report.displayAttrFormNames,
        refreshDate: report.refreshDate,
        objectWorkingId: report.objectWorkingId,
      });
      settings.set(officeProperties.loadedReportProperties, reportProperties);
      settings.saveAsync();
    } catch (error) {
      errorService.handleError(error);
    }
  }

  preserveReportValue = async (bindId, key, value) => {
    try {
      const settings = this.getOfficeSettings();
      const reportProperties = this.getReportProperties();
      const indexOfReport = reportProperties.findIndex((oldReport) => (oldReport.bindId === bindId));
      reportProperties[indexOfReport][key] = value;
      settings.set(officeProperties.loadedReportProperties, reportProperties);
      await settings.saveAsync();
      await this.loadExistingReportBindingsExcel();
    } catch (error) {
      errorService.handleError(error);
    }
  }

  deleteReport = (bindingId, objectWorkingId) => {
    try {
      const settings = this.getOfficeSettings();
      if (objectWorkingId) {
        const storedObjects = settings.get(officeProperties.storedObjects);
        const indexOfReport = storedObjects.findIndex((report) => (report.objectWorkingId === objectWorkingId));
        storedObjects.splice(indexOfReport, 1);
        settings.set(officeProperties.storedObjects, storedObjects);
      }


      // TODO remove after connecting object reducer to right panel
      const reportProperties = this.getReportProperties();
      const indexOfReport2 = reportProperties.findIndex((report) => (report.bindId === bindingId));
      reportProperties.splice(indexOfReport2, 1);
      settings.set(officeProperties.loadedReportProperties, reportProperties);

      settings.saveAsync();
    } catch (error) {
      errorService.handleError(error);
    }
  }

  getReportFromProperties = (bindingId) => {
    const reportProperties = this.getReportProperties();
    return reportProperties.find((report) => report.bindId === bindingId);
  };

  getReportProperties = () => {
    try {
      const settings = this.getOfficeSettings();
      if (!(settings.get(officeProperties.loadedReportProperties))) {
        const reportProperties = [];
        settings.set(officeProperties.loadedReportProperties, reportProperties);
        settings.saveAsync();
      }
      return settings.get(officeProperties.loadedReportProperties);
    } catch (error) {
      errorService.handleError(error);
    }
  };

  loadExistingReportBindingsExcel = async () => {
    const reportArray = await this.getReportProperties();
    this.reduxStore.dispatch({
      type: officeProperties.actions.loadAllReports,
      reportArray,
    });
  };

  getOfficeSettings = () => {
    if (Office === undefined || Office.context === undefined || Office.context.document === undefined) {
      throw new RunOutsideOfficeError();
    }
    return Office.context.document.settings;
  }

  toggleFileSecuredFlag = (value) => {
    try {
      const settings = this.getOfficeSettings();
      settings.set(officeProperties.isSecured, value);
      settings.saveAsync();
    } catch (error) {
      errorService.handleError(error);
    }
  }

  isFileSecured = () => {
    try {
      const settings = this.getOfficeSettings();
      return settings.get(officeProperties.isSecured);
    } catch (error) {
      errorService.handleError(error);
    }
  }

  restoreObjectsFromExcelStore = () => {
    const settings = this.getOfficeSettings();
    const objects = settings.get(officeProperties.storedObjects);

    objects && this.reduxStore.dispatch(restoreAllObjects(objects));
  };

  // TODO remove
  clearObjectReducerFromSettings = async () => {
    const settings = this.getOfficeSettings();
    settings.set(officeProperties.storedObjects, []);
    await settings.saveAsync();
  };


  saveObjectsInExcelStore = async () => {
    const { objects } = this.reduxStore.getState().objectReducer;
    const settings = this.getOfficeSettings();
    settings.set(officeProperties.storedObjects, objects);
    // TODO: check if needed
    await settings.saveAsync();
    // TODO: uncomment below
    // this.reduxStore.dispatch(markStepCompleted(objectData.objectWorkingId, SAVE_OBJECT_IN_EXCEL));
  }


  removeReportFromStore = (bindingId, objectWorkingId) => {
    this.reduxStore.dispatch(deleteObject(objectWorkingId));

    // TODO remove dispatch
    this.reduxStore.dispatch({
      type: officeProperties.actions.removeReport,
      reportBindId: bindingId,
    });
    this.deleteReport(bindingId, objectWorkingId);
    return true;
  };
}

export const officeStoreService = new OfficeStoreService();
