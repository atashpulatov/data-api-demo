import {
  popupActions as actions,
  RESET_STATE,
  SET_REPORT_N_FILTERS,
  SET_PREPARED_REPORT
} from '../../redux-reducer/popup-reducer/popup-actions';
import { popupHelper } from '../../popup/popup-helper';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { errorService } from '../../error/error-handler';
import { popupController } from '../../popup/popup-controller';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';

jest.mock('../../office/api/office-api-helper');
jest.mock('../../authentication/authentication-helper');
jest.mock('../../office/store/office-reducer-helper');
jest.mock('../../popup/popup-controller');
jest.mock('../../error/error-handler');
jest.mock('../../store');
jest.mock('../../mstr-object/mstr-object-rest-service');

const { createDossierInstance } = mstrObjectRestService;

describe('Popup actions', () => {
  beforeAll(() => {
    actions.init(
      errorService,
      officeApiHelper,
      officeReducerHelper,
      popupHelper,
      mstrObjectRestService,
      popupController,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
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
    const bindId = 'bindId';
    const report = { bindId, objectType: 'whatever' };
    const error = new Error('test error');
    officeApiHelper.checkStatusOfSessions.mockImplementationOnce(() => { throw error; });
    const listener = jest.fn();
    // when
    await actions.callForEditDossier(report)(listener);
    // then
    expect(errorService.handleError).toBeCalledWith(error);
  });

  it('should do certain operations when callForEditDossier action called', async () => {
    // given
    const bindId = 'bindId';
    const report = { bindId, objectType: 'whatever' };
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
    officeReducerHelper.getObjectFromObjectReducerByBindId.mockReturnValueOnce(returnedValue);
    mstrObjectRestService.getVisualizationInfo.mockReturnValueOnce(visInfo);
    createDossierInstance.mockReturnValueOnce(instanceDefinitionMocked);
    // when
    await actions.callForEditDossier(report)(listener);
    // then
    expect(officeApiHelper.checkStatusOfSessions).toBeCalled();
    expect(officeReducerHelper.getObjectFromObjectReducerByBindId).toBeCalledWith(bindId);
    expect(listener).toHaveBeenCalledWith({ type: SET_REPORT_N_FILTERS, editedObject: returnedValue });
  });

  it('should run edit popup if edit action for not prompted object is called', async () => {
    // given
    const bindId = 'bindId';
    const report = { bindId, objectType: 'whatever' };
    const returnedValue = {
      id: 'id', projectId: 'projectId', instanceId: 'instanceId', body: {}, promptsAnswers: [], isPrompted: false
    };
    officeReducerHelper.getObjectFromObjectReducerByBindId.mockReturnValueOnce(returnedValue);
    const listener = jest.fn();
    // when
    await actions.callForEdit(report)(listener);
    // then
    expect(officeReducerHelper.getObjectFromObjectReducerByBindId).toBeCalledWith(bindId);
    expect(listener).toHaveBeenCalledWith({ type: SET_REPORT_N_FILTERS, editedObject: returnedValue });
    expect(popupController.runEditFiltersPopup).toBeCalledWith(report);
  });

  it('should run reprompt popup if edit action for prompted object is called', async () => {
    // given
    const bindId = 'bindId';
    const report = { bindId, objectType: 'whatever' };
    const returnedValue = {
      id: 'id', projectId: 'projectId', instanceId: 'instanceId', body: {}, promptsAnswers: [], isPrompted: true
    };
    officeReducerHelper.getObjectFromObjectReducerByBindId.mockReturnValueOnce(returnedValue);
    const listener = jest.fn();
    // when
    await actions.callForEdit(report)(listener);
    // then
    expect(officeReducerHelper.getObjectFromObjectReducerByBindId).toBeCalledWith(bindId);
    expect(listener).toHaveBeenCalledWith({ type: SET_REPORT_N_FILTERS, editedObject: returnedValue });
    expect(popupController.runRepromptPopup).toBeCalledWith(report);
  });

  it('should call error service and dispatch stop loading when edit action fails', async () => {
    // given
    const bindId = 'bindId';
    const report = { bindId, objectType: 'whatever' };
    const error = new Error('test error');
    officeApiHelper.checkStatusOfSessions.mockImplementationOnce(() => { throw error; });
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
