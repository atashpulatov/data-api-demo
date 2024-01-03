import {
  prepareGivenPromptAnswers,
  answerDossierPromptsHelper,
  preparePromptedDossier,
  preparePromptedReport,
  mergeAnswersWithPromptsDefined
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

  it('mergeAnswersWithPromptsDefined should return proper contents when given promptsAnswers for a Report definition.', async () => {
    // given
    const objectId = 'objectId';
    const projectId = 'projectId';
    const instanceId = 'instanceId';
    const promptsAnswers = [
      {
        messageName: 'New Dossier',
        answers: [
          {
            key: 'C90F1D2C477501EBE929109222385DDC@0@10',
            values: ['8D679D5111D3E4981000E787EC6DE8A4:2014~1048576~2014', '8D679D5111D3E4981000E787EC6DE8A4:2016~1048576~2016'],
            useDefault: false
          }
        ]
      }
    ];

    jest.spyOn(mstrObjectRestService, 'getObjectPrompts').mockImplementationOnce(async () => ([
      {
        id: 'C90F1D2C477501EBE929109222385DDC',
        key: 'C90F1D2C477501EBE929109222385DDC@0@10',
        name: 'Elements of Year',
        title: 'Year',
        type: 'ELEMENTS',
        required: false,
        closed: true,
        source: {
          name: 'Year',
          id: '8D679D5111D3E4981000E787EC6DE8A4',
          type: 12
        },
        defaultAnswer: [],
        answers: [
          {
            id: 'h2014;8D679D5111D3E4981000E787EC6DE8A4',
            name: '2014'
          },
          {
            id: 'h2016;8D679D5111D3E4981000E787EC6DE8A4',
            name: '2016'
          }
        ]
      }
    ]));
    // when
    await mergeAnswersWithPromptsDefined(objectId, projectId, instanceId, promptsAnswers);
    // then
    expect(promptsAnswers[0].answers[0].type).toBeDefined();
    expect(promptsAnswers[0].answers[0].answers).toBeDefined();
  });

  it('mergeAnswersWithPromptsDefined should return proper contents when given promptsAnswers for a Dossier definition.', async () => {
    // given
    const objectId = 'objectId';
    const projectId = 'projectId';
    const instanceId = 'instanceId';
    const promptsAnswers = [
      {
        key: 'F675275D462EB676E317569EE6B3D1B4@0@10',
        values: [
          '8D679D5211D3E4981000E787EC6DE8A4:1:5~1048576~Miami',
          '8D679D5211D3E4981000E787EC6DE8A4:1:4~1048576~San Diego',
          '8D679D5211D3E4981000E787EC6DE8A4:1:6~1048576~Boston'
        ],
        useDefault: false
      }
    ];

    jest.spyOn(mstrObjectRestService, 'getObjectPrompts').mockImplementationOnce(async () => ([
      {
        id: 'F675275D462EB676E317569EE6B3D1B4',
        key: 'F675275D462EB676E317569EE6B3D1B4@0@10',
        name: 'Distribution Center',
        title: 'Dist Center',
        type: 'ELEMENTS',
        required: false,
        closed: true,
        source: {
          name: 'Distribution Center',
          id: '8D679D5211D3E4981000E787EC6DE8A4',
          type: 12
        },
        defaultAnswer: [],
        answers: [
          {
            id: 'h1:5;8D679D5211D3E4981000E787EC6DE8A4',
            name: 'Miami'
          },
          {
            id: 'h1:4;8D679D5211D3E4981000E787EC6DE8A4',
            name: 'San Diego'
          },
          {
            id: 'h1:6;8D679D5211D3E4981000E787EC6DE8A4',
            name: 'Boston'
          }
        ]
      }
    ]));
    // when
    await mergeAnswersWithPromptsDefined(objectId, projectId, instanceId, promptsAnswers, false);
    // then
    expect(promptsAnswers[0].type).toBeDefined();
    expect(promptsAnswers[0].answers).toBeDefined();
  });
});
