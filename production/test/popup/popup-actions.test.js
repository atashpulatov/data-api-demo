import * as actions from '../../src/popup/popup-actions';
import {popupHelper} from '../../src/popup/popup-helper';
import {officeApiHelper} from '../../src/office/office-api-helper';
import {authenticationHelper} from '../../src/authentication/authentication-helper';
import {UnauthorizedError} from '../../src/error/unauthorized-error';
import {officeProperties} from '../../src/office/office-properties';
import {officeStoreService} from '../../src/office/store/office-store-service';
import {popupController} from '../../src/popup/popup-controller';

jest.mock('../../src/office/office-api-helper');
jest.mock('../../src/authentication/authentication-helper');
jest.mock('../../src/office/store/office-store-service');
jest.mock('../../src/popup/popup-controller');

describe('Popup actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('refreshReportsArray', () => {
    it('should call proper methods when isRefreshAll is true', async () => {
      // given
      officeApiHelper.getExcelSessionStatus = jest.fn();
      authenticationHelper.validateAuthToken = jest.fn();
      popupHelper.storagePrepareRefreshAllData = jest.fn();
      popupHelper.runRefreshAllPopup = jest.fn();
      popupHelper.printRefreshedReport = jest.fn();
      const listener = jest.fn();
      const reportArray = [{
        bindId: 'testBinding1',
        objectType: 'report',
        name: 'testName1',
      },
      {
        bindId: 'testBinding2',
        objectType: 'report',
        name: 'testName2',
      },
      {
        bindId: 'testBinding3',
        objectType: 'report',
        name: 'testName3',
        promptsAnswers: 'testPromptAnswers3',
      }];
      const isRefreshAll = true;
      // when
      await actions.refreshReportsArray(reportArray, isRefreshAll)(listener);
      // then
      expect(officeApiHelper.getExcelSessionStatus).toHaveBeenCalled();
      expect(authenticationHelper.validateAuthToken).toHaveBeenCalled();
      expect(popupHelper.storagePrepareRefreshAllData).toHaveBeenCalledWith(reportArray);
      expect(popupHelper.runRefreshAllPopup).toHaveBeenCalledWith(reportArray);
      expect(popupHelper.printRefreshedReport).toHaveBeenCalledTimes(3);
      expect(popupHelper.printRefreshedReport).toHaveBeenCalledWith(reportArray[0].bindId, reportArray[0].objectType, reportArray.length, 0, true, reportArray[0].promptsAnswers);
      expect(popupHelper.printRefreshedReport).toHaveBeenCalledWith(reportArray[1].bindId, reportArray[1].objectType, reportArray.length, 1, true, reportArray[1].promptsAnswers);
      expect(popupHelper.printRefreshedReport).toHaveBeenCalledWith(reportArray[2].bindId, reportArray[2].objectType, reportArray.length, 2, true, reportArray[2].promptsAnswers);
      expect(listener).toHaveBeenCalledTimes(6);
      expect(listener).toHaveBeenCalledWith({
        type: officeProperties.actions.startLoadingReport,
        reportBindId: reportArray[0].bindId,
        isRefreshAll: isRefreshAll,
      });
      expect(listener).toHaveBeenCalledWith({
        type: officeProperties.actions.startLoadingReport,
        reportBindId: reportArray[1].bindId,
        isRefreshAll: isRefreshAll,
      });
      expect(listener).toHaveBeenCalledWith({
        type: officeProperties.actions.startLoadingReport,
        reportBindId: reportArray[2].bindId,
        isRefreshAll: isRefreshAll,
      });
    });
    it('should NOT call some methods when isRefreshAll is false', async () => {
      // given
      officeApiHelper.getExcelSessionStatus = jest.fn();
      authenticationHelper.validateAuthToken = jest.fn();
      popupHelper.storagePrepareRefreshAllData = jest.fn();
      popupHelper.runRefreshAllPopup = jest.fn();
      popupHelper.printRefreshedReport = jest.fn();
      const listener = jest.fn();
      const reportArray = [
        {
          bindId: 'testBinding1',
          objectType: 'report',
          name: 'testNamne1',
        },
      ];
      // when
      await actions.refreshReportsArray(reportArray, false)(listener);
      // then
      expect(officeApiHelper.getExcelSessionStatus).toHaveBeenCalled();
      expect(authenticationHelper.validateAuthToken).toHaveBeenCalled();
      expect(popupHelper.storagePrepareRefreshAllData).not.toHaveBeenCalled();
      expect(popupHelper.runRefreshAllPopup).not.toHaveBeenCalled();
      expect(popupHelper.printRefreshedReport).toHaveBeenCalledTimes(1);
    });
    it('should run handleRefreshError with proper parameters when error', async () => {
      // given
      officeApiHelper.getExcelSessionStatus = jest.fn();
      authenticationHelper.validateAuthToken = jest.fn();
      const mockErrorObject = {
        status: 'testStatus',
        response: 'testResponse',
        message: 'testMessage',
      };
      popupHelper.printRefreshedReport = jest.fn().mockRejectedValue(new UnauthorizedError(mockErrorObject));
      popupHelper.handleRefreshError = jest.fn();
      const listener = jest.fn();
      const reportArray = [
        {
          bindId: 'testBinding1',
          objectType: 'report',
          name: 'testNamne1',
        },
      ];
      // when
      await actions.refreshReportsArray(reportArray, false)(listener);
      // then
      expect(popupHelper.handleRefreshError).toHaveBeenCalledWith(mockErrorObject, 1, 0, false);
    });
  });
  describe('resetState', () => {
    it('should dispatch proper resetState action', () => {
      // given
      const listener = jest.fn();
      // when
      actions.resetState(true)(listener);
      // then
      expect(listener).toHaveBeenCalledWith({type: actions.RESET_STATE});
    });
  });

  it('should do certain operations when edit action called', async () => {
    // given
    const bindingId = 'bindingId';
    const report = {bindId: bindingId, objectType: 'whatever'};
    const returnedValue = 'returnFromSettings';
    officeStoreService.getReportFromProperties.mockReturnValue(returnedValue);
    const listener = jest.fn();
    // when
    await actions.callForEdit(report)(listener);
    // then
    expect(officeApiHelper.getExcelSessionStatus).toBeCalled();
    expect(authenticationHelper.validateAuthToken).toBeCalled();
    expect(officeStoreService.getReportFromProperties).toBeCalledWith(bindingId);
    expect(listener).toHaveBeenCalledWith({type: actions.SET_REPORT_N_FILTERS, editedReport: returnedValue});
    expect(popupController.runEditFiltersPopup).toBeCalledWith(report);
  });

  it('should set proper popupType when switch to edit requested', () => {
    // given
    const reportInstance = 'instanceId';
    const reportData = 'reportData';
    const listener = jest.fn();
    // when
    actions.preparePromptedReport(reportInstance, reportData)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({type: actions.SET_PREPARED_REPORT, instanceId: reportInstance, reportData});
  });
});
