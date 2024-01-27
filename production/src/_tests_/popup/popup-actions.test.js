import {
  popupActions as actions,
  RESET_STATE,
  SET_REPORT_N_FILTERS,
  SET_PREPARED_REPORT
} from '../../redux-reducer/popup-reducer/popup-actions';
import { popupHelper } from '../../popup/popup-helper';
import { officeApiHelper } from '../../office/api/office-api-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { errorService } from '../../error/error-handler';
import { popupController } from '../../popup/popup-controller';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { visualizationInfoService } from '../../mstr-object/visualization-info-service';

jest.mock('../../office/api/office-api-helper');
jest.mock('../../authentication/authentication-helper');
jest.mock('../../office/store/office-reducer-helper');
jest.mock('../../popup/popup-controller');
jest.mock('../../error/error-handler');
jest.mock('../../store');
jest.mock('../../mstr-object/mstr-object-rest-service');
jest.mock('../../mstr-object/visualization-info-service');

const { createDossierInstance } = mstrObjectRestService;
const { getVisualizationInfo } = visualizationInfoService;

describe('Popup actions', () => {
  beforeAll(() => {
    actions.init(
      errorService,
      officeApiHelper,
      officeReducerHelper,
      popupHelper,
      mstrObjectRestService,
      popupController,
      visualizationInfoService,
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
      },
      vizDimensions: {
        width: 454.34,
        height: 231.34
      }
    };
    const listener = jest.fn();
    const spyPrepareDossierForEdit = jest.spyOn(actions, 'prepareDossierForEdit');
    officeReducerHelper.getObjectFromObjectReducerByBindId.mockReturnValueOnce(returnedValue);
    // when
    await actions.callForEditDossier(report)(listener);
    // then
    expect(officeApiHelper.checkStatusOfSessions).toBeCalled();
    expect(officeReducerHelper.getObjectFromObjectReducerByBindId).toBeCalledWith(bindId);
    expect(spyPrepareDossierForEdit).toBeCalledWith(returnedValue);
    // expect(listener).toHaveBeenCalledWith({ type: SET_REPORT_N_FILTERS, editedObject: returnedValue });
  });

  it('should call error service when callForRepromptDossier fails', async () => {
    // given
    const bindId = 'bindId';
    const report = { bindId, objectType: 'whatever' };
    const error = new Error('test error');
    officeApiHelper.checkStatusOfSessions.mockImplementationOnce(() => { throw error; });
    const listener = jest.fn();
    // when
    await actions.callForRepromptDossier(report)(listener);
    // then
    expect(errorService.handleError).toBeCalledWith(error);
  });

  it('should do certain operations when callForRepromptDossier action called', async () => {
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
      },
      vizDimensions: {
        width: 454.34,
        height: 231.34
      }
    };
    const listener = jest.fn();
    const spyPrepareDossierForReprompt = jest.spyOn(actions, 'prepareDossierForReprompt');
    officeReducerHelper.getObjectFromObjectReducerByBindId.mockReturnValueOnce(returnedValue);
    // when
    await actions.callForRepromptDossier(report)(listener);
    // then
    expect(officeApiHelper.checkStatusOfSessions).toBeCalled();
    expect(officeReducerHelper.getObjectFromObjectReducerByBindId).toBeCalledWith(bindId);
    expect(spyPrepareDossierForReprompt).toBeCalledWith(returnedValue);
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

  it('should run reprompt popup with isEdit = false if reprompt action for prompted object is called', async () => {
    // given
    const bindId = 'bindId';
    const report = { bindId, objectType: 'whatever' };
    const returnedValue = {
      id: 'id', projectId: 'projectId', instanceId: 'instanceId', body: {}, promptsAnswers: [], isPrompted: true
    };
    officeReducerHelper.getObjectFromObjectReducerByBindId.mockReturnValueOnce(returnedValue);
    const listener = jest.fn();
    // when
    await actions.callForReprompt(report)(listener);
    // then
    expect(officeReducerHelper.getObjectFromObjectReducerByBindId).toBeCalledWith(bindId);
    expect(listener).toHaveBeenCalledWith({ type: SET_REPORT_N_FILTERS, editedObject: returnedValue });
    expect(popupController.runRepromptPopup).toBeCalledWith(report, false);
  });

  it('should call error service when edit action fails', async () => {
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

  it('should update dossier data in prepareDossierForEdit with visualizationInfo update', async () => {
    // given
    const projectId = 'projectId';
    const objectId = 'objectId';
    const instanceId = { mid: 'instanceId' };
    const manipulationsXML = { data: 'data' };
    const oldVisKey = 'oldVisualizationKey';
    const newVisKey = 'newVisualizationKey';

    const editedDossier = {
      projectId,
      objectId,
      manipulationsXML,
      visualizationInfo: { visualizationKey: oldVisKey },
      mstrObjectType: 'mstrObjectType',
      instanceId,
    };
    const body = {
      ...manipulationsXML,
      disableManipulationsAutoSaving: true,
      persistViewState: true
    };
    const newVizInfo = {
      chapterKey: 'chapterKey',
      pageKey: 'pageKey',
      visualizationKey: newVisKey,
      dossierStructure: {
        chapterName: 'chapterName',
        dossierName: 'dossierName',
        pageName: 'pageName',
      }
    };

    const newEditedDossier = {
      instanceId: 'instanceId',
      isEdit: true,
      manipulationsXML,
      mstrObjectType: 'mstrObjectType',
      objectType: 'mstrObjectType',
      objectId,
      projectId,
      visualizationInfo: newVizInfo
    };

    createDossierInstance.mockReturnValueOnce(instanceId);
    getVisualizationInfo.mockReturnValueOnce(newVizInfo);

    // when
    await actions.prepareDossierForEdit(editedDossier);

    // then
    expect(createDossierInstance).toBeCalledWith(projectId, objectId, body);
    expect(getVisualizationInfo).toBeCalledWith(
      projectId, objectId, oldVisKey, 'instanceId',
    );
    expect(editedDossier).toStrictEqual(newEditedDossier);
  });

  it('should update dossier data in prepareDossierForEdit without visualizationInfo update', async () => {
    // given
    const projectId = 'projectId';
    const objectId = 'objectId';
    const instanceId = { mid: 'instanceId' };
    const manipulationsXML = { data: 'data' };
    const oldVisKey = 'oldVisualizationKey';

    const editedDossier = {
      projectId,
      objectId,
      manipulationsXML,
      visualizationInfo: { visualizationKey: oldVisKey },
      mstrObjectType: 'mstrObjectType',
    };
    const body = {
      ...manipulationsXML,
      disableManipulationsAutoSaving: true,
      persistViewState: true
    };
    const newVizInfo = undefined;

    const newEditedDossier = {
      instanceId: 'instanceId',
      isEdit: true,
      manipulationsXML,
      mstrObjectType: 'mstrObjectType',
      objectType: 'mstrObjectType',
      objectId,
      projectId,
      visualizationInfo: { visualizationKey: oldVisKey },
    };

    createDossierInstance.mockReturnValueOnce(instanceId);
    getVisualizationInfo.mockReturnValueOnce(newVizInfo);

    // when
    await actions.prepareDossierForEdit(editedDossier);

    // then
    expect(createDossierInstance).toBeCalledWith(projectId, objectId, body);
    expect(getVisualizationInfo).toBeCalledWith(
      projectId, objectId, oldVisKey, 'instanceId'
    );
    expect(editedDossier).toStrictEqual(newEditedDossier);
  });

  it('should do callForDuplicate for duplication with edit for report', async () => {
    // object
    const object = { mstrObjectType: { name: 'report' } };
    const listener = jest.fn();
    const reportParams = {
      duplicateMode: true,
      object
    };
    // when
    await actions.callForDuplicate(object)(listener);
    // then
    expect(officeApiHelper.checkStatusOfSessions).toBeCalled();
    expect(listener).toHaveBeenCalledWith({ type: SET_REPORT_N_FILTERS, editedObject: object });
    expect(popupController.runEditFiltersPopup).toBeCalledWith(reportParams);
  });

  it('should do callForDuplicate for duplication with edit for prompted report', async () => {
    // object
    const object = { mstrObjectType: { name: 'report' }, isPrompted: 2 };
    const listener = jest.fn();
    const reportParams = {
      duplicateMode: true,
      object
    };
    // when
    await actions.callForDuplicate(object)(listener);
    // then
    expect(officeApiHelper.checkStatusOfSessions).toBeCalled();
    expect(listener).toHaveBeenCalledWith({ type: SET_REPORT_N_FILTERS, editedObject: object });
    expect(popupController.runRepromptPopup).toBeCalledWith(reportParams);
  });

  it('should do callForDuplicate for duplication with edit for dossier visualization', async () => {
    // object
    const object = { mstrObjectType: { name: 'visualization' } };
    const listener = jest.fn();
    const spyPrepareDossierForEdit = jest
      .spyOn(actions, 'prepareDossierForEdit')
      .mockImplementationOnce((paramObject) => {
        paramObject.test = 'test';
        delete paramObject.mstrObjectType;
        delete paramObject.objectType;
      });
    const newObject = { test: 'test' };
    const reportParams = {
      duplicateMode: true,
      object: newObject
    };
    // when
    await actions.callForDuplicate(object)(listener);
    // then
    expect(officeApiHelper.checkStatusOfSessions).toBeCalled();
    expect(spyPrepareDossierForEdit).toBeCalledWith(object);
    expect(listener).toHaveBeenCalledWith({ type: SET_REPORT_N_FILTERS, editedObject: newObject });
    expect(popupController.runEditDossierPopup).toBeCalledWith(reportParams);
  });
});
