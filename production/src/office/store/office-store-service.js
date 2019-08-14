import {officeProperties} from '../office-properties';
import {officeApiHelper} from '../../office/office-api-helper';
import {RunOutsideOfficeError} from '../../error/run-outside-office-error';
import {errorService} from '../../error/error-handler';
import {reduxStore} from '../../store';

/* global Office */

class OfficeStoreService {
  preserveReport = (report) => {
    try {
      const settings = this.getOfficeSettings();
      const reportProperties = this._getReportProperties();
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
        promptsAnswers: report.promptsAnswers,
        crosstabHeaderDimensions: report.crosstabHeaderDimensions,
      });
      settings.set(officeProperties.loadedReportProperties, reportProperties);
      settings.saveAsync();
    } catch (error) {
      errorService.handleOfficeError(error);
    }
  }

  preserveReportValue = async (bindId, key, value) => {
    try {
      const settings = this.getOfficeSettings();
      const reportProperties = this._getReportProperties();
      const indexOfReport = reportProperties.findIndex((oldReport) => {
        return (oldReport.bindId === bindId);
      });
      reportProperties[indexOfReport][key] = value;
      settings.set(officeProperties.loadedReportProperties, reportProperties);
      await settings.saveAsync();
      await officeApiHelper.loadExistingReportBindingsExcel();
    } catch (error) {
      errorService.handleOfficeError(error);
    }
  }

  deleteReport = (bindingId) => {
    try {
      const settings = this.getOfficeSettings();
      const reportProperties = this._getReportProperties();
      const indexOfReport = reportProperties.findIndex((report) => {
        return (report.bindId === bindingId);
      });
      reportProperties.splice(indexOfReport, 1);
      settings.set(officeProperties.loadedReportProperties, reportProperties);
      settings.saveAsync();
    } catch (error) {
      errorService.handleOfficeError(error);
    }
  }

  getReportFromProperties = (bindingId) => {
    const reportProperties = this._getReportProperties();
    return reportProperties.find((report) => {
      return report.bindId === bindingId;
    });
  };

  _getReportProperties = () => {
    try {
      const settings = this.getOfficeSettings();
      if (!(settings.get(officeProperties.loadedReportProperties))) {
        const reportProperties = [];
        settings.set(officeProperties.loadedReportProperties, reportProperties);
        settings.saveAsync();
      }
      return settings.get(officeProperties.loadedReportProperties);
    } catch (error) {
      errorService.handleOfficeError(error);
    }
  };

  getOfficeSettings = () => {
    if (Office === undefined
      || Office.context === undefined
      || Office.context.document === undefined) {
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
      errorService.handleOfficeError(error);
    }
  }

  isFileSecured = () => {
    try {
      const settings = this.getOfficeSettings();
      return settings.get(officeProperties.isSecured);
    } catch (error) {
      errorService.handleOfficeError(error);
    }
  }
  saveAndPreserveReportInStore = (report, isRefresh) => {
    if (isRefresh) {
      try {
        const settings = this.getOfficeSettings();
        const reportsArray = [...this._getReportProperties()];
        const reportObj = reportsArray.find(
            (element) => element.bindId === report.bindId
        );
        reportsArray[reportsArray.indexOf(reportObj)].crosstabHeaderDimensions = report.crosstabHeaderDimensions;
        settings.set(officeProperties.loadedReportProperties, reportsArray);
      } catch (error) {
        const e = errorService.errorOfficeFactory(error);
        errorService.handleOfficeError(e);
      }
    } else {
      reduxStore.dispatch({
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
          promptsAnswers: report.promptsAnswers,
          crosstabHeaderDimensions: report.crosstabHeaderDimensions,
        },
      });
      this.preserveReport(report);
    }
  };
}

export const officeStoreService = new OfficeStoreService();
