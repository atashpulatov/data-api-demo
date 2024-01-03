import {
  prepareGivenPromptAnswers,
  answerDossierPromptsHelper,
  preparePromptedDossier,
  preparePromptedReport,
} from '../../helpers/prompts-handling-helper';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';

describe('PromptsHandlingHelper', () => {
  let rePromptDossierSpy;
  let getDossierStatusSpy;
  let createInstanceSpy;
  let createDossierBasedOnReportSpy;
  let answerDossierPromptsSpy;

  beforeEach(() => {
    rePromptDossierSpy = jest.spyOn(mstrObjectRestService, 'rePromptDossier').mockImplementation(async () => ({ mid: 'mid' }));
    getDossierStatusSpy = jest.spyOn(mstrObjectRestService, 'getDossierStatus').mockImplementation(async () => ({ statusCode: 1, body: { status: 1 } }));
    createInstanceSpy = jest.spyOn(mstrObjectRestService, 'createInstance').mockImplementation(async () => ({ instanceId: 'instanceId' }));
    createDossierBasedOnReportSpy = jest.spyOn(mstrObjectRestService, 'createDossierBasedOnReport').mockImplementation(async () => ({ status: 2, mid: 'mid' }));
    answerDossierPromptsSpy = jest.spyOn(mstrObjectRestService, 'answerDossierPrompts').mockImplementation(async () => 1);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('prepareGivenPromptAnswers should return proper contents in array when given prompts + previous answers', () => {
    // given
    const promptObjects = [
      { key: '1', type: 'type', answers: [] },
      { key: '2', type: 'type', answers: [] }
    ];
    const previousPromptAnswers = [
      { key: '1', type: 'type', answers: ['2'], values: ['2'] },
      { key: '2', type: 'type', answers: [], values: [] }
    ];
    // when
    const result = prepareGivenPromptAnswers(promptObjects, previousPromptAnswers);
    // then
    const expectedResult = [{
      messageName: 'New Dossier',
      answers: [
        { key: '1', type: 'type', answers: ['2'], values: ['2'] },
        { key: '2', type: 'type', answers: [], values: [], useDefault: true }
      ]
    }];
    expect(result).toEqual(expectedResult);
  });

  it('prepareGivenPromptAnswers should return empty array when no prompts', () => {
    // given
    const promptObjects = [];
    const previousPromptAnswers = [];
    // when
    const result = prepareGivenPromptAnswers(promptObjects, previousPromptAnswers);
    // then
    const expectedResult = [{ messageName: 'New Dossier', answers: [] }];
    expect(result).toEqual(expectedResult);
  });

  it('answerDossierPromptsHelper should return proper contents and call proper functions when given instanceDefinition + objectId + projectId + promptsAnswers', async () => {
    // given
    const instanceDefinition = { status: 2, mid: 'mid' };
    const { mid } = instanceDefinition;
    const objectId = 'objectId';
    const projectId = 'projectId';
    const promptsAnswers = [{ key: '1', type: 'type', answers: ['2'], values: ['2'] }];
    const config = {
      objectId,
      projectId,
      instanceId: mid,
      promptsAnswers: promptsAnswers[0],
      ignoreValidateRequiredCheck: true,
    };
    // when
    const result = await answerDossierPromptsHelper(instanceDefinition, objectId, projectId, promptsAnswers);
    // then
    expect(answerDossierPromptsSpy).toHaveBeenCalledTimes(1);
    expect(answerDossierPromptsSpy).toHaveBeenCalledWith(config);
    expect(getDossierStatusSpy).toHaveBeenCalledTimes(1);
    expect(getDossierStatusSpy).toHaveBeenCalledWith(objectId, mid, projectId);
    expect(result).toEqual({ status: 1, mid: 'mid' });
  });

  it('preparePromptedDossier should return proper contents and call proper functions when given instanceDef + objectId + projectId + promptsAnswers', async () => {
    // given
    const instanceDefinition = { status: 2, mid: 'mid' };
    const { mid } = instanceDefinition;
    const objectId = 'objectId';
    const projectId = 'projectId';
    const promptsAnswers = [{ key: '1', type: 'type', answers: ['2'], values: ['2'] }];
    // when
    const result = await preparePromptedDossier(instanceDefinition, objectId, projectId, promptsAnswers);
    // then
    expect(result).toEqual({ status: 1, mid: 'mid' });
    expect(rePromptDossierSpy).toHaveBeenCalledTimes(1);
    expect(rePromptDossierSpy).toHaveBeenCalledWith(objectId, mid, projectId);
  });

  it('preparePromptedReport should return proper contents and call proper functions when given chosenObjectIdLocal + projectId + promptsAnswers', async () => {
    // given
    const chosenObjectIdLocal = 'chosenObjectIdLocal';
    const projectId = 'projectId';
    const promptsAnswers = [{ key: '1', type: 'type', answers: ['2'], values: ['2'] }];
    const config = {
      objectId: chosenObjectIdLocal,
      projectId
    };
    // when
    const result = await preparePromptedReport(chosenObjectIdLocal, projectId, promptsAnswers);
    // then
    expect(createInstanceSpy).toHaveBeenCalledTimes(1);
    expect(createInstanceSpy).toHaveBeenCalledWith(config);
    expect(createDossierBasedOnReportSpy).toHaveBeenCalledTimes(1);
    expect(createDossierBasedOnReportSpy).toHaveBeenCalledWith(chosenObjectIdLocal, 'instanceId', projectId);
    expect(rePromptDossierSpy).toHaveBeenCalledTimes(1);
    expect(rePromptDossierSpy).toHaveBeenCalledWith(chosenObjectIdLocal, 'mid', projectId);
    expect(result).toEqual({ status: 1, id: 'chosenObjectIdLocal', mid: 'mid' });
  });
});
