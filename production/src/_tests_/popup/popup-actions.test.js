import {
  popupActions as actions,
  RESET_STATE,
  SET_REPORT_N_FILTERS,
  SET_PREPARED_REPORT
} from '../../popup/popup-actions';
import { popupHelper } from '../../popup/popup-helper';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { officeProperties } from '../../office/store/office-properties';
import { officeStoreService } from '../../office/store/office-store-service';
import { errorService } from '../../error/error-handler';
import { popupController } from '../../popup/popup-controller';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';

jest.mock('../../office/api/office-api-helper');
jest.mock('../../authentication/authentication-helper');
jest.mock('../../office/store/office-store-service');
jest.mock('../../popup/popup-controller');
jest.mock('../../error/error-handler');
jest.mock('../../store');
jest.mock('../../mstr-object/mstr-object-rest-service');

const { createDossierInstance } = mstrObjectRestService;

describe('Popup actions', () => {
  beforeAll(() => {
    actions.init(
      authenticationHelper,
      errorService,
      officeApiHelper,
      officeStoreService,
      popupHelper,
      mstrObjectRestService,
      popupController,
    );
  });
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
        isRefreshAll,
      });
      expect(listener).toHaveBeenCalledWith({
        type: officeProperties.actions.startLoadingReport,
        reportBindId: reportArray[1].bindId,
        isRefreshAll,
      });
      expect(listener).toHaveBeenCalledWith({
        type: officeProperties.actions.startLoadingReport,
        reportBindId: reportArray[2].bindId,
        isRefreshAll,
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
      popupHelper.printRefreshedReport = jest.fn().mockRejectedValue(mockErrorObject);
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
      try {
        await actions.refreshReportsArray(reportArray, false)(listener);
      } catch (error) {}
      // then
      expect(popupHelper.handleRefreshError).toHaveBeenCalledWith(mockErrorObject, 1, 0, false);
    });

    it('should call redux store stoplaoding and handle error when the session fails', async () => {
      // given
      const error = new Error('test error');
      officeApiHelper.getExcelSessionStatus.mockImplementationOnce(() => { throw error; });
      const mockedDispatch = jest.fn();
      const reportArray = [
        {
          bindId: 'test',
          objectType: 'report',
          name: 'test1',
        },
      ];
      // when
      await actions.refreshReportsArray(reportArray, false)(mockedDispatch);
      // then
      expect(errorService.handleError).toBeCalledWith(error);
      expect(mockedDispatch).toBeCalledWith({ type: officeProperties.actions.stopLoading });
    });
  });
  describe('resetState', () => {
    it('should dispatch proper resetState action', () => {
      // given
      const listener = jest.fn();
      // when
      actions.resetState(true)(listener);
      // then
      expect(listener).toHaveBeenCalledWith({ type: RESET_STATE });
    });
  });

  it('should call error service when callForEditDossier fails', async () => {
    // given
    const bindingId = 'bindingId';
    const report = { bindId: bindingId, objectType: 'whatever' };
    const error = new Error('test error');
    officeApiHelper.getExcelSessionStatus.mockImplementationOnce(() => { throw error; });
    const listener = jest.fn();
    // when
    await actions.callForEditDossier(report)(listener);
    // then
    expect(errorService.handleError).toBeCalledWith(error);
  });

  it('should do certain operations when callForEditDossier action called', async () => {
    // given
    const bindingId = 'bindingId';
    const report = { bindId: bindingId, objectType: 'whatever' };
    const returnedValue = {
      projectId: 'projectId',
      id: 'id',
      manipulationsXML: 'manipulationsXML',
      visualizationInfo: {
        pageKey: 'page',
        chapterKey: 'chapterKey',
        visualizationKey: 'visKey',
      }
    };
    const visInfo = {
      pageKey: 'page',
      chapterKey: 'chapterKey',
      visualizationKey: 'visKey'
    };
    const instanceDefinitionMocked = { instanceId: 'instanceId' };
    const listener = jest.fn();
    officeStoreService.getReportFromProperties.mockReturnValueOnce(returnedValue);
    mstrObjectRestService.getVisualizationInfo.mockReturnValueOnce(visInfo);
    createDossierInstance.mockReturnValueOnce(instanceDefinitionMocked);
    // when
    await actions.callForEditDossier(report)(listener);
    // then
    expect(officeApiHelper.getExcelSessionStatus).toBeCalled();
    expect(authenticationHelper.validateAuthToken).toBeCalled();
    expect(officeStoreService.getReportFromProperties).toBeCalledWith(bindingId);
    expect(listener).toHaveBeenCalledWith({ type: SET_REPORT_N_FILTERS, editedObject: returnedValue });
  });

  it('should run edit popup if edit action for not prompted object is called', async () => {
    // given
    const bindingId = 'bindingId';
    const report = { bindId: bindingId, objectType: 'whatever' };
    const returnedValue = {
      id: 'id', projectId: 'projectId', instanceId: 'instanceId', body: {}, promptsAnswers: [], isPrompted: false
    };
    officeStoreService.getReportFromProperties.mockReturnValueOnce(returnedValue);
    const listener = jest.fn();
    // when
    await actions.callForEdit(report)(listener);
    // then
    expect(officeStoreService.getReportFromProperties).toBeCalledWith(bindingId);
    expect(listener).toHaveBeenCalledWith({ type: SET_REPORT_N_FILTERS, editedObject: returnedValue });
    expect(popupController.runEditFiltersPopup).toBeCalledWith(report);
  });

  it('should run reprompt popup if edit action for prompted object is called', async () => {
    // given
    const bindingId = 'bindingId';
    const report = { bindId: bindingId, objectType: 'whatever' };
    const returnedValue = {
      id: 'id', projectId: 'projectId', instanceId: 'instanceId', body: {}, promptsAnswers: [], isPrompted: true
    };
    officeStoreService.getReportFromProperties.mockReturnValueOnce(returnedValue);
    const listener = jest.fn();
    // when
    await actions.callForEdit(report)(listener);
    // then
    expect(officeStoreService.getReportFromProperties).toBeCalledWith(bindingId);
    expect(listener).toHaveBeenCalledWith({ type: SET_REPORT_N_FILTERS, editedObject: returnedValue });
    expect(popupController.runRepromptPopup).toBeCalledWith(report);
  });

  it('should call error service and dispatch stop loading when edit action fails', async () => {
    // given
    const bindingId = 'bindingId';
    const report = { bindId: bindingId, objectType: 'whatever' };
    const error = new Error('test error');
    officeApiHelper.getExcelSessionStatus.mockImplementationOnce(() => { throw error; });
    const mockedDispatch = jest.fn();
    // when
    await actions.callForEdit(report)(mockedDispatch);
    // then
    expect(errorService.handleError).toBeCalledWith(error);
    expect(mockedDispatch).toBeCalledWith({ type: officeProperties.actions.stopLoading });
  });

  it('should set proper popupType when switch to edit requested', () => {
    // given
    const reportInstance = 'instanceId';
    const chosenObjectData = 'chosenObjectData';
    const listener = jest.fn();
    // when
    actions.preparePromptedReport(reportInstance, chosenObjectData)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({ type: SET_PREPARED_REPORT, instanceId: reportInstance, chosenObjectData });
  });
});
