import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { visualizationInfoService } from '../../mstr-object/visualization-info-service';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { popupHelper } from '../../popup/popup-helper';

import { ObjectData } from '../../types/object-types';
import { PromptsAnswer } from '../answers-reducer/answers-reducer-types';
import { PopupActionTypes } from './popup-reducer-types';

import { errorService } from '../../error/error-handler';
import { popupController } from '../../popup/popup-controller';
import { popupActions as actions } from './popup-actions';

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
      officeReducerHelper,
      popupHelper,
      mstrObjectRestService,
      popupController,
      visualizationInfoService
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
      actions.resetState()(listener);
      // then
      expect(listener).toHaveBeenCalledWith({ type: PopupActionTypes.RESET_STATE });
    });
  });

  it('should do certain operations when callForEditDossier action called', async () => {
    // given
    const objectData = {
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
        height: 231.34,
      },
    } as unknown as ObjectData;
    const listener = jest.fn();
    const spyPrepareDossierForEdit = jest.spyOn(actions, 'prepareDossierForEdit');
    // when
    await actions.callForEditDossier(objectData)(listener);
    // then
    expect(spyPrepareDossierForEdit).toBeCalledWith(objectData);
  });

  it('should do certain operations when callForRepromptDossier action called', async () => {
    // given
    const objectData = {
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
        height: 231.34,
      },
    } as unknown as ObjectData;
    const listener = jest.fn();
    const spyPrepareDossierForReprompt = jest.spyOn(actions, 'prepareDossierForReprompt');

    // when
    await actions.callForRepromptDossier(objectData)(listener);
    // then
    expect(spyPrepareDossierForReprompt).toBeCalledWith(objectData);
  });

  it('should run edit popup if edit action for not prompted object is called', async () => {
    // given
    const objectData = {
      id: 'id',
      projectId: 'projectId',
      instanceId: 'instanceId',
      body: {},
      promptsAnswers: [] as PromptsAnswer[],
      isPrompted: false,
    } as unknown as ObjectData;

    const listener = jest.fn();
    // when
    await actions.callForEdit(objectData)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({
      type: PopupActionTypes.SET_REPORT_N_FILTERS,
      editedObject: objectData,
    });
    expect(popupController.runEditFiltersPopup).toHaveBeenCalledWith(objectData);
  });

  it('should run reprompt popup if edit action for prompted object is called', async () => {
    // given
    const objectData = {
      id: 'id',
      projectId: 'projectId',
      instanceId: 'instanceId',
      body: {},
      promptsAnswers: [] as PromptsAnswer[],
      isPrompted: true,
    } as unknown as ObjectData;
    const listener = jest.fn();
    // when
    await actions.callForEdit(objectData)(listener);
    // then

    expect(listener).toHaveBeenCalledWith({
      type: PopupActionTypes.SET_REPORT_N_FILTERS,
      editedObject: objectData,
    });
    expect(popupController.runRepromptPopup).toBeCalledWith(objectData);
  });

  it('should run reprompt popup with isEdit = false if reprompt action for prompted object is called', async () => {
    // given
    const objectData = {
      id: 'id',
      projectId: 'projectId',
      instanceId: 'instanceId',
      body: {},
      promptsAnswers: [] as PromptsAnswer[],
      isPrompted: true,
    } as unknown as ObjectData;
    const listener = jest.fn();
    // when
    await actions.callForReprompt(objectData)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({
      type: PopupActionTypes.SET_REPORT_N_FILTERS,
      editedObject: objectData,
    });
    expect(popupController.runRepromptPopup).toBeCalledWith(objectData, false);
  });

  it('should set proper popupType when switch to edit requested', () => {
    // given
    const reportInstance = 'instanceId';
    const chosenObjectData = 'chosenObjectData';
    const listener = jest.fn();
    // when
    actions.preparePromptedReport(reportInstance, chosenObjectData)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({
      type: PopupActionTypes.SET_PREPARED_REPORT,
      instanceId: reportInstance,
      chosenObjectData,
    });
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
    } as unknown as ObjectData;
    const body = {
      ...manipulationsXML,
      disableManipulationsAutoSaving: true,
      persistViewState: true,
    };
    const newVizInfo = {
      chapterKey: 'chapterKey',
      pageKey: 'pageKey',
      visualizationKey: newVisKey,
      dossierStructure: {
        chapterName: 'chapterName',
        dossierName: 'dossierName',
        pageName: 'pageName',
      },
      vizDimensions: {
        width: 454.34,
        height: 231.34,
      },
    };

    const newEditedDossier = {
      instanceId: 'instanceId',
      isEdit: true,
      manipulationsXML,
      mstrObjectType: 'mstrObjectType',
      objectType: 'mstrObjectType',
      objectId,
      projectId,
      visualizationInfo: newVizInfo,
    };
    // @ts-expect-error
    createDossierInstance.mockReturnValueOnce(instanceId);

    (getVisualizationInfo as jest.Mock).mockReturnValueOnce({
      vizInfo: newVizInfo,
      viewFilterText: 'viewFilterText',
    });

    // when
    await actions.prepareDossierForEdit(editedDossier);

    // then
    expect(createDossierInstance).toBeCalledWith(projectId, objectId, body);
    expect(getVisualizationInfo).toBeCalledWith(projectId, objectId, oldVisKey, 'instanceId');
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
    } as unknown as ObjectData;
    const body = {
      ...manipulationsXML,
      disableManipulationsAutoSaving: true,
      persistViewState: true,
    };
    const newVizInfo: any = undefined;

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

    // @ts-expect-error
    createDossierInstance.mockReturnValueOnce(instanceId);

    (getVisualizationInfo as jest.Mock).mockReturnValueOnce({
      vizInfo: newVizInfo,
      viewFilterText: 'viewFilterText',
    });

    // when
    await actions.prepareDossierForEdit(editedDossier);

    // then
    expect(createDossierInstance).toBeCalledWith(projectId, objectId, body);
    expect(getVisualizationInfo).toBeCalledWith(projectId, objectId, oldVisKey, 'instanceId');
    expect(editedDossier).toStrictEqual(newEditedDossier);
  });

  it('should do callForDuplicate for duplication with edit for report', async () => {
    // object
    const object = { mstrObjectType: { name: 'report' } } as ObjectData;
    const listener = jest.fn();
    const reportParams = {
      duplicateMode: true,
      object,
    };
    // when
    await actions.callForDuplicate(object)(listener);
    // then

    expect(listener).toHaveBeenCalledWith({
      type: PopupActionTypes.SET_REPORT_N_FILTERS,
      editedObject: object,
    });
    expect(popupController.runEditFiltersPopup).toBeCalledWith(reportParams);
  });

  it('should do callForDuplicate for duplication with edit for prompted report', async () => {
    // object
    const object = { mstrObjectType: { name: 'report' }, isPrompted: 2 } as unknown as ObjectData;
    const listener = jest.fn();
    const reportParams = {
      duplicateMode: true,
      object,
    };
    // when
    await actions.callForDuplicate(object)(listener);
    // then
    expect(listener).toHaveBeenCalledWith({
      type: PopupActionTypes.SET_REPORT_N_FILTERS,
      editedObject: object,
    });
    expect(popupController.runRepromptPopup).toBeCalledWith(reportParams);
  });

  it('should update dossier data in prepareDossierForReprompt with visualizationInfo update', async () => {
    // given
    const projectId = 'projectId';
    const objectId = 'objectId';
    const instanceId = { mid: 'instanceId' };
    const manipulationsXML = { data: 'data' };
    const oldVisKey = 'oldVisualizationKey';
    const newVisKey = 'newVisualizationKey';

    const promptedDossier = {
      projectId,
      objectId,
      manipulationsXML,
      visualizationInfo: { visualizationKey: oldVisKey },
      mstrObjectType: 'mstrObjectType',
      instanceId,
    } as unknown as ObjectData;
    const body = {
      ...manipulationsXML,
      disableManipulationsAutoSaving: true,
      persistViewState: true,
    };
    const newVizInfo = {
      chapterKey: 'chapterKey',
      pageKey: 'pageKey',
      visualizationKey: newVisKey,
      dossierStructure: {
        chapterName: 'chapterName',
        dossierName: 'dossierName',
        pageName: 'pageName',
      },
      vizDimensions: {
        width: 454.34,
        height: 231.34,
      },
    };

    const newPromptedDossierDossier = {
      instanceId: 'instanceId',
      isEdit: true,
      manipulationsXML,
      mstrObjectType: 'mstrObjectType',
      objectType: 'mstrObjectType',
      objectId,
      projectId,
      visualizationInfo: newVizInfo,
    };

    // @ts-expect-error
    createDossierInstance.mockReturnValueOnce(instanceId);

    (getVisualizationInfo as jest.Mock).mockReturnValueOnce({
      vizInfo: newVizInfo,
      viewFilterText: 'viewFilterText',
    });

    // when
    await actions.prepareDossierForReprompt(promptedDossier);

    // then
    expect(createDossierInstance).toBeCalledWith(projectId, objectId, body);
    expect(getVisualizationInfo).toBeCalledWith(projectId, objectId, oldVisKey, 'instanceId');
    expect(promptedDossier).toStrictEqual(newPromptedDossierDossier);
  });

  it('should do callForDuplicate for duplication with edit for dossier visualization', async () => {
    // object
    const object = { mstrObjectType: { name: 'visualization' } } as unknown as ObjectData;
    const listener = jest.fn();
    const spyPrepareDossierForEdit = jest
      .spyOn(actions, 'prepareDossierForEdit')
      .mockImplementationOnce(async paramObject => {
        paramObject.test = 'test';
        delete paramObject.mstrObjectType;
        delete paramObject.objectType;
      });
    const newObject = { test: 'test' };
    const reportParams = {
      duplicateMode: true,
      object: newObject,
    };
    // when
    await actions.callForDuplicate(object)(listener);
    // then
    expect(spyPrepareDossierForEdit).toBeCalledWith(object);
    expect(listener).toHaveBeenCalledWith({
      type: PopupActionTypes.SET_REPORT_N_FILTERS,
      editedObject: newObject,
    });
    expect(popupController.runEditDossierPopup).toBeCalledWith(reportParams);
  });
});
