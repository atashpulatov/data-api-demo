import { officeProperties } from '../office-properties';
import { RunOutsideOfficeError } from '../../error/run-outside-office-error';
import { errorService } from '../../error/error-handler';

/* global Office */

export class OfficeStoreService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  preserveReport = (report) => {
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
        subtotalInfo: report.subtotalInfo,
        promptsAnswers: report.promptsAnswers,
        crosstabHeaderDimensions: report.crosstabHeaderDimensions,
        visualizationInfo: report.visualizationInfo,
        manipulationsXML: report.manipulationsXML,
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

  deleteReport = (bindingId) => {
    try {
      const settings = this.getOfficeSettings();
      const reportProperties = this.getReportProperties();
      const indexOfReport = reportProperties.findIndex((report) => (report.bindId === bindingId));
      reportProperties.splice(indexOfReport, 1);
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

  saveAndPreserveReportInStore = (report, isRefresh) => {
    if (isRefresh) {
      try {
        const settings = this.getOfficeSettings();
        const reportsArray = [...this.getReportProperties()];
        const reportObj = reportsArray.find((element) => element.bindId === report.bindId);
        const ObjectIndex = reportsArray.indexOf(reportObj);
        reportsArray[ObjectIndex].crosstabHeaderDimensions = report.crosstabHeaderDimensions;
        reportsArray[ObjectIndex].isCrosstab = report.isCrosstab;
        reportsArray[ObjectIndex].manipulationsXML = report.manipulationsXML;
        settings.set(officeProperties.loadedReportProperties, reportsArray);
      } catch (error) {
        errorService.handleError(error);
      }
    } else {
      this.reduxStore.dispatch({
        type: officeProperties.actions.loadReport,
        report: {
          id: report.id,
          name: report.name,
          bindId: report.bindId,
          projectId: report.projectId,
          envUrl: report.envUrl,
          body: report.body,
          isLoading: report.isLoading,
          objectType: report.objectType,
          isCrosstab: report.isCrosstab,
          isPrompted: report.isPrompted,
          subtotalInfo: report.subtotalInfo,
          promptsAnswers: report.promptsAnswers,
          crosstabHeaderDimensions: report.crosstabHeaderDimensions,
          visualizationInfo: report.visualizationInfo,
          manipulationsXML: report.manipulationsXML,
        },
      });
      this.preserveReport(report);
    }
  };

  removeReportFromStore = (bindingId) => {
    this.reduxStore.dispatch({
      type: officeProperties.actions.removeReport,
      reportBindId: bindingId,
    });
    this.deleteReport(bindingId);
    return true;
  };
}

export const officeStoreService = new OfficeStoreService();
