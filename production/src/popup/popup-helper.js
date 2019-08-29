import { officeDisplayService } from '../office/office-display-service';
import { officeStoreService } from '../office/store/office-store-service';
import { notificationService } from '../notification/notification-service';
import { popupController } from './popup-controller';
import { errorService } from '../error/error-handler';
import { PopupTypeEnum } from '../home/popup-type-enum';
import MstrObjectType from '../mstr-object/mstr-object-type-enum';

class PopupHelper {
  capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  getPopupHeight = (reportArray, reportNumberToShow = 10) => {
    const reportsListLength = reportArray.length > reportNumberToShow
      ? reportNumberToShow
      : reportArray.length;
    // This formula calculates the height as a percentage of the excel window
    // 230 is the title and refresh text height
    // 30 is the height of each report list (variable)
    // 200 is the excel ribbon + toolbar height
    // 100 is to convert to percentage
    return Math.floor(
      ((230 + reportsListLength * 30) / (window.innerHeight + 200)) * 100,
    );
  };

  runRefreshAllPopup = async (reportArray, reportNumberToShow = 10) => {
    const popupHeight = this.getPopupHeight(reportArray, reportNumberToShow);
    await popupController.runPopup(
      PopupTypeEnum.refreshAllPage,
      popupHeight,
      28,
    );
  };

  storagePrepareRefreshAllData = (reportArray) => {
    localStorage.removeItem('refreshData');
    const refreshReportsData = reportArray.map((report) => ({
      key: report.bindId,
      name: report.name,
      result: false,
      isError: null,
    }));
    const refreshData = {
      data: refreshReportsData,
      allNumber: reportArray.length,
      finished: false,
      currentNumber: 1,
    };
    localStorage.setItem('refreshData', JSON.stringify(refreshData));
  };

  storageReportRefreshStart = (refreshReport, index) => {
    const fromStorage = JSON.parse(localStorage.getItem('refreshData'));
    fromStorage.currentName = refreshReport.name;
    fromStorage.currentNumber = index + 1;
    localStorage.setItem('refreshData', JSON.stringify(fromStorage));
  };

  storageReportRefreshFinish = (result, isError, index, length) => {
    const fromStorage = JSON.parse(localStorage.getItem('refreshData'));
    fromStorage.data[index].result = result;
    fromStorage.data[index].isError = isError;
    fromStorage.finished = index === length - 1;
    return localStorage.setItem('refreshData', JSON.stringify(fromStorage));
  };

  printRefreshedReport = async (
    bindingId,
    objectType,
    length,
    index,
    isRefreshAll,
    promptsAnswers,
  ) => {
    const refreshReport = officeStoreService.getReportFromProperties(bindingId);
    if (isRefreshAll) this.storageReportRefreshStart(refreshReport, index);
    const mstrObjectType = MstrObjectType.getMstrTypeByName(objectType);
    const instanceId = null;
    // TODO: Pass proper isPrompted value – promptsAnswers could probably serve as such,
    // to be refactored.

    const options = {
      dossierData: instanceId,
      promptsAnswers: !promptsAnswers
        ? refreshReport.promptsAnswers
        : promptsAnswers,
      objectId: refreshReport.id,
      instanceId: refreshReport.instanceId,
      projectId: refreshReport.projectId,
      mstrObjectType,
      selectedCell: true,
      bindingId,
      body: refreshReport.body,
      isCrosstab: refreshReport.isCrosstab,
      crosstabHeaderDimensions: refreshReport.crosstabHeaderDimensions,
      isRefresh: true,
      isPrompted: refreshReport.isPrompted,
      isRefreshAll,
    };
    const result = await officeDisplayService.printObject(options);
    if (result && result.type === 'warning') {
      throw new Error(result.message);
    }
    if (!isRefreshAll) {
      notificationService.displayNotification(
        'success',
        `${this.capitalize(objectType.name)} refreshed`,
      );
      return false;
    }
    this.storageReportRefreshFinish('ok', false, index, length);
    return false;
  };

  handleRefreshError = (error, length, index, isRefreshAll) => {
    if (isRefreshAll) {
      const officeError = errorService.errorOfficeFactory(error);
      const errorMessage = errorService.getErrorMessage(officeError);
      return this.storageReportRefreshFinish(errorMessage, true, index, length);
    }
    if (error.code === 'ItemNotFound') {
      return notificationService.displayNotification(
        'info',
        'Data is not relevant anymore. You can delete it from the list',
      );
    }
    errorService.handleError(error);
  }
}

export const popupHelper = new PopupHelper();
