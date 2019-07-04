import {popupController} from '../../src/popup/popup-controller';
import {popupHelper} from '../../src/popup/popup-helper';
import {officeStoreService} from '../../src/office/store/office-store-service';
import {officeDisplayService} from '../../src/office/office-display-service';
import {notificationService} from '../../src/notification/notification-service';
import {errorService} from '../../src/error/error-handler';

describe('Popup actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('capitalize should return with first letter set to upper case', () => {
    // given
    const string = 'test string';
    // when
    const capitalized = popupHelper.capitalize(string);
    // then
    expect(capitalized).toBe('Test string');
  });
  it('getPopupHeight should calculate proper % height for 10 reports to show and 9 reports in array', () => {
    // given
    const reportNumberToShow = 10;
    const reportArray = prepareReportArray(9);
    window.innerHeight = 1300;
    // when
    const height = popupHelper.getPopupHeight(reportArray, reportNumberToShow);
    // then
    expect(height).toBe(32);
  });
  it('getPopupHeight should calculate proper % height for 10 reports to show and 10 reports in array', () => {
    // given
    const reportNumberToShow = 10;
    const reportArray = prepareReportArray(10);
    window.innerHeight = 1300;
    // when
    const height = popupHelper.getPopupHeight(reportArray, reportNumberToShow);
    // then
    expect(height).toBe(34);
  });
  it('getPopupHeight should calculate proper % height for 10 reports to show and 11 reports in array', () => {
    // given
    const reportNumberToShow = 10;
    const reportArray = prepareReportArray(11);
    window.innerHeight = 1300;
    // when
    const height = popupHelper.getPopupHeight(reportArray, reportNumberToShow);
    // then
    expect(height).toBe(34);
  });
  it('runRefreshAllPopup should run proper helpers', () => {
    // given
    popupHelper.getPopupHeight = jest.fn();
    popupController.runPopup = jest.fn();
    const reportArray = [{
      bindId: 'testBinding1',
      name: 'testNamne1',
    },
    {
      bindId: 'testBinding2',
      name: 'testNamne2',
    }];
    // when
    popupHelper.runRefreshAllPopup(reportArray, 10);
    // then
    expect(popupHelper.getPopupHeight).toHaveBeenCalled();
    expect(popupController.runPopup).toHaveBeenCalled();
  });
  it('storagePrepareRefreshAllData should write all rrefreshed eports data to localstorage', () => {
    // given
    const mockStorageRemoveItem = jest.spyOn(localStorage, 'removeItem').mockImplementation(() => {});
    const mockStorageSetItem = jest.spyOn(localStorage, 'setItem').mockImplementation(() => {});
    const reportArray = [{
      bindId: 'testBinding1',
      name: 'testNamne1',
    },
    {
      bindId: 'testBinding2',
      name: 'testNamne2',
    }];
    // when
    popupHelper.storagePrepareRefreshAllData(reportArray);
    // then
    expect(mockStorageRemoveItem).toHaveBeenCalledWith('refreshData');
    expect(mockStorageSetItem).toHaveBeenCalledWith('refreshData', JSON.stringify({
      data: [
        {
          key: 'testBinding1',
          name: 'testNamne1',
          result: false,
          isError: null,
        },
        {
          key: 'testBinding2',
          name: 'testNamne2',
          result: false,
          isError: null,
        },
      ],
      allNumber: reportArray.length,
      finished: false,
      currentNumber: 1,
    }));
  });
  it('storageReportRefreshStart should write report refresh data to localstorage', () => {
    // given
    const mockStorageGetItem = jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
      return JSON.stringify({});
    });
    const mockStorageSetItem = jest.spyOn(localStorage, 'setItem').mockImplementation(() => {});
    const refreshReport = {
      name: 'testName',
    };
    const index = 0;
    // when
    popupHelper.storageReportRefreshStart(refreshReport, index);
    // then
    expect(mockStorageGetItem).toHaveBeenCalled();
    expect(mockStorageSetItem).toHaveBeenCalledWith('refreshData', JSON.stringify({
      currentName: 'testName',
      currentNumber: 1,
    }));
  });
  it('storageReportRefreshFinish should write report refresh data to localstorage', () => {
    // given
    const refreshData = {
      data: [
        {
          key: 'testBinding1',
          name: 'testNamne1',
          result: false,
          isError: null,
        },
        {
          key: 'testBinding2',
          name: 'testNamne2',
          result: false,
          isError: null,
        },
      ],
      allNumber: 2,
      finished: false,
      currentNumber: 1,
    };
    const index = 0;
    const mockStorageGetItem = jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
      return JSON.stringify(refreshData);
    });
    const mockStorageSetItem = jest.spyOn(localStorage, 'setItem').mockImplementation(() => {});
    // when
    popupHelper.storageReportRefreshFinish('ok', false, index, refreshData.data.length);
    // then
    expect(mockStorageGetItem).toHaveBeenCalled();
    expect(mockStorageSetItem).toHaveBeenCalledWith('refreshData',
        JSON.stringify({
          data: [
            {
              key: 'testBinding1',
              name: 'testNamne1',
              result: 'ok',
              isError: false,
            },
            {
              key: 'testBinding2',
              name: 'testNamne2',
              result: false,
              isError: null,
            },
          ],
          allNumber: 2,
          finished: false,
          currentNumber: 1,
        })
    );
  });
  it('printRefreshedReport should call proper methods when isRefreshAll is true', async () => {
    // given
    const mockReport = {
      id: 'testBindId',
      projectId: 'testProjectId',
      body: {},
    };
    officeStoreService.getReportFromProperties = jest.fn().mockImplementation(() => mockReport);
    popupHelper.storageReportRefreshStart = jest.fn();
    officeDisplayService.printObject = jest.fn();
    notificationService.displayNotification = jest.fn();
    popupHelper.storageReportRefreshFinish = jest.fn();
    const isRefreshAll = true;
    const expectedOptions = {
      dossierData: null,
      objectId: mockReport.id,
      projectId: mockReport.projectId,
      isReport: true,
      selectedCell: true,
      bindingId: 'testBind',
      body: mockReport.body,
      isRefresh: true,
      isPrompted: false,
      isRefreshAll: isRefreshAll,
    };
    // when
    await popupHelper.printRefreshedReport('testBind', 'report', 10, 3, isRefreshAll);
    // then
    expect(officeStoreService.getReportFromProperties).toHaveBeenCalled();
    expect(popupHelper.storageReportRefreshStart).toHaveBeenCalled();
    expect(officeDisplayService.printObject).toHaveBeenCalledWith(expectedOptions);
    expect(notificationService.displayNotification).not.toHaveBeenCalled();
    expect(popupHelper.storageReportRefreshFinish).toHaveBeenCalled();
  });
  it('printRefreshedReport should call proper methods when isRefreshAll is false', async () => {
    // given
    const mockReport = {
      id: 'testBindId',
      projectId: 'testProjectId',
      body: {},
    };
    officeStoreService.getReportFromProperties = jest.fn().mockImplementation(() => mockReport);
    popupHelper.storageReportRefreshStart = jest.fn();
    officeDisplayService.printObject = jest.fn();
    notificationService.displayNotification = jest.fn();
    popupHelper.storageReportRefreshFinish = jest.fn();
    // when
    await popupHelper.printRefreshedReport('testBind', 'Report', 10, 3, false);
    // then
    expect(officeStoreService.getReportFromProperties).toHaveBeenCalled();
    expect(popupHelper.storageReportRefreshStart).not.toHaveBeenCalled();
    expect(officeDisplayService.printObject).toHaveBeenCalled();
    expect(notificationService.displayNotification).toHaveBeenCalled();
    expect(popupHelper.storageReportRefreshFinish).not.toHaveBeenCalled();
  });
  it('printRefreshedReport throws error when result type is warning', async () => {
    // given
    const mockReport = {
      id: 'testBindId',
      projectId: 'testProjectId',
      body: {},
    };
    const mockResult = {
      type: 'warning',
      message: 'Test err message',
    };
    officeStoreService.getReportFromProperties = jest.fn().mockImplementation(() => mockReport);
    popupHelper.storageReportRefreshStart = jest.fn();
    officeDisplayService.printObject = jest.fn().mockReturnValue(mockResult);
    // then
    await expect(popupHelper.printRefreshedReport('testBind', 'Report', 10, 3, false)).rejects.toThrowError(new Error(mockResult.message));
  });
  it('handleRefreshError calls proper methods when isRefreshAll flag is true', () => {
    // given
    const error = 'testError';
    const officeError = 'Test error message';
    const errorMessage = 'Test error message';
    errorService.errorOfficeFactory = jest.fn().mockReturnValue(officeError);
    errorService.getErrorMessage = jest.fn().mockReturnValue(errorMessage);
    popupHelper.storageReportRefreshFinish = jest.fn();
    // when
    popupHelper.handleRefreshError(error, 10, 2, true);
    // then
    expect(errorService.errorOfficeFactory).toHaveBeenCalledWith(error);
    expect(errorService.getErrorMessage).toHaveBeenCalledWith(officeError);
    expect(popupHelper.storageReportRefreshFinish).toHaveBeenCalledWith(errorMessage, true, 2, 10);
  });
  it('handleRefreshError display proper notifications when isRefreshAll is false and error.code is ItemNotFound', () => {
    // given
    const mockError = {
      code: 'ItemNotFound',
    };
    notificationService.displayNotification = jest.fn();
    // when
    popupHelper.handleRefreshError(mockError, 10, 2, false);
    // then
    expect(notificationService.displayNotification)
        .toHaveBeenCalledWith('info', 'Data is not relevant anymore. You can delete it from the list');
  });
  it('handleRefreshError display proper notifications when isRefreshAll is false and error.code is NOT ItemNotFound', () => {
    // given
    const mockError = {
      code: 'testErrCode',
    };
    errorService.handleError = jest.fn();
    // when
    popupHelper.handleRefreshError(mockError, 10, 2, false);
    // then
    expect(errorService.handleError).toHaveBeenCalledWith(mockError);
  });
});

function prepareReportArray(reportsNumber) {
  const reportsArray = [];
  for (let i = 0; i < reportsNumber; i++) {
    reportsArray.push(
        {
          bindId: 'testBinding' + i,
          name: 'testNamne' + i,
        });
  }
  return reportsArray;
}
