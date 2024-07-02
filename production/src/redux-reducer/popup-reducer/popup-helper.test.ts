import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { visualizationInfoService } from '../../mstr-object/visualization-info-service';
import { popupHelper } from './popup-helper';

import { reduxStore } from '../../store';

import { ObjectData } from '../../types/object-types';
import { PromptsAnswer } from '../answers-reducer/answers-reducer-types';

describe('Popup Helper', () => {
  afterEach(() => {
    jest.clearAllMocks();
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
    const spyPrepareDossierForEdit = jest.spyOn(popupHelper, 'prepareDossierForEdit');
    // when
    await popupHelper.callForEditDossier(objectData);
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
    const spyPrepareDossierForReprompt = jest.spyOn(popupHelper, 'prepareDossierForReprompt');

    // when
    await popupHelper.callForRepromptDossier(objectData);
    // then
    expect(spyPrepareDossierForReprompt).toBeCalledWith(objectData);
  });

  it('should run edit popup if edit action for not prompted object is called', () => {
    // given
    reduxStore.dispatch = jest.fn();
    const objectData = {
      id: 'id',
      projectId: 'projectId',
      instanceId: 'instanceId',
      body: {},
      promptsAnswers: [] as PromptsAnswer[],
      isPrompted: false,
    } as unknown as ObjectData;

    // when
    popupHelper.callForEdit(objectData);
    // then

    expect(reduxStore.dispatch).toHaveBeenCalledTimes(2);
  });

  it('should run reprompt popup if edit action for prompted object is called', () => {
    // given
    reduxStore.dispatch = jest.fn();

    const objectData = {
      id: 'id',
      projectId: 'projectId',
      instanceId: 'instanceId',
      body: {},
      promptsAnswers: [] as PromptsAnswer[],
      isPrompted: true,
    } as unknown as ObjectData;

    // when
    popupHelper.callForEdit(objectData);
    // then

    expect(reduxStore.dispatch).toHaveBeenCalledTimes(3);
  });

  it('should run reprompt popup with isEdit = false if reprompt action for prompted object is called', () => {
    // given
    reduxStore.dispatch = jest.fn();
    const objectData = {
      id: 'id',
      projectId: 'projectId',
      instanceId: 'instanceId',
      body: {},
      promptsAnswers: [] as PromptsAnswer[],
      isPrompted: true,
    } as unknown as ObjectData;

    // when
    popupHelper.callForReprompt(objectData);
    // then
    expect(reduxStore.dispatch).toHaveBeenCalledTimes(3);
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

    const createDossierInstanceMock = jest
      .spyOn(mstrObjectRestService, 'createDossierInstance')
      .mockResolvedValue(instanceId);
    const getVisualizationInfoMock = jest
      .spyOn(visualizationInfoService, 'getVisualizationInfo')
      .mockResolvedValue({ vizInfo: newVizInfo, viewFilterText: 'viewFilterText' });

    // when
    await popupHelper.prepareDossierForEdit(editedDossier);

    // then
    expect(createDossierInstanceMock).toBeCalledWith(projectId, objectId, body);
    expect(getVisualizationInfoMock).toBeCalledWith(projectId, objectId, oldVisKey, 'instanceId');
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

    const createDossierInstanceMock = jest
      .spyOn(mstrObjectRestService, 'createDossierInstance')
      .mockResolvedValue(instanceId);
    const getVisualizationInfoMock = jest
      .spyOn(visualizationInfoService, 'getVisualizationInfo')
      .mockResolvedValue({ vizInfo: newVizInfo, viewFilterText: 'viewFilterText' });

    // when
    await popupHelper.prepareDossierForEdit(editedDossier);

    // then
    expect(createDossierInstanceMock).toBeCalledWith(projectId, objectId, body);
    expect(getVisualizationInfoMock).toBeCalledWith(projectId, objectId, oldVisKey, 'instanceId');
    expect(editedDossier).toStrictEqual(newEditedDossier);
  });

  it('should do callForDuplicate for duplication with edit for report', async () => {
    // object
    const object = { mstrObjectType: { name: 'report' } } as ObjectData;

    reduxStore.dispatch = jest.fn();

    // when
    await popupHelper.callForDuplicate(object);
    // then

    expect(reduxStore.dispatch).toHaveBeenCalledTimes(3);
  });

  it('should do callForDuplicate for duplication with edit for prompted report', async () => {
    // object
    const object = { mstrObjectType: { name: 'report' }, isPrompted: 2 } as unknown as ObjectData;

    reduxStore.dispatch = jest.fn();

    // when
    await popupHelper.callForDuplicate(object);

    // then
    expect(reduxStore.dispatch).toHaveBeenCalledTimes(4);
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

    const createDossierInstanceMock = jest
      .spyOn(mstrObjectRestService, 'createDossierInstance')
      .mockResolvedValue(instanceId);
    const getVisualizationInfoMock = jest
      .spyOn(visualizationInfoService, 'getVisualizationInfo')
      .mockResolvedValue({ vizInfo: newVizInfo, viewFilterText: 'viewFilterText' });

    jest.spyOn(mstrObjectRestService, 'rePromptDossier').mockResolvedValue({});

    // when
    await popupHelper.prepareDossierForReprompt(promptedDossier);

    // then
    expect(createDossierInstanceMock).toHaveBeenCalledWith(projectId, objectId, body);
    expect(getVisualizationInfoMock).toHaveBeenCalledWith(
      projectId,
      objectId,
      oldVisKey,
      'instanceId'
    );
    expect(promptedDossier).toStrictEqual(newPromptedDossierDossier);
  });

  it('should do callForDuplicate for duplication with edit for dossier visualization', async () => {
    // object
    const object = { mstrObjectType: { name: 'visualization' } } as unknown as ObjectData;
    reduxStore.dispatch = jest.fn();
    const spyPrepareDossierForEdit = jest
      .spyOn(popupHelper, 'prepareDossierForEdit')
      .mockImplementationOnce(async paramObject => {
        paramObject.test = 'test';
        delete paramObject.mstrObjectType;
        delete paramObject.objectType;
      });

    // when
    await popupHelper.callForDuplicate(object);
    // then
    expect(spyPrepareDossierForEdit).toHaveBeenCalledWith(object);
    expect(reduxStore.dispatch).toHaveBeenCalledTimes(3);
  });
});
