import dossierInstanceDefinition from '../../mstr-object/dossier-instance-definition';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { errorTypes, incomingErrorStrings, INVALID_VIZ_KEY_MESSAGE } from '../../error/constants';

describe('DossierInstanceDefinition', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle exception thrown by createDossierInstance', async () => {
    // given
    const createDossierInstanceMock = jest.spyOn(mstrObjectRestService, 'createDossierInstance')
      .mockImplementation(() => {
        throw new Error('errorTest');
      });

    const getVisualizationInfoMock = jest.spyOn(mstrObjectRestService, 'getVisualizationInfo')
      .mockImplementation();

    const fetchVisualizationDefinitionMock = jest.spyOn(mstrObjectRestService, 'fetchVisualizationDefinition')
      .mockImplementation();

    const getVisualizationErrorTypeMock = jest.spyOn(dossierInstanceDefinition, 'getVisualizationErrorType')
      .mockImplementation();

    // when
    let result;
    try {
      result = await dossierInstanceDefinition.getDossierInstanceDefinition({
        projectId: 'projectIdTest',
        objectId: 'objectIdTest',
        body: 'bodyTest',
        manipulationsXML: undefined,
        preparedInstanceId: undefined,
      });
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('errorTest');
      expect(error.mstrObjectType).toEqual(mstrObjectEnum.mstrObjectType.dossier);
      expect(result).toBeUndefined();
    }

    expect(createDossierInstanceMock).toBeCalledTimes(1);
    expect(createDossierInstanceMock).toBeCalledWith('projectIdTest', 'objectIdTest', 'bodyTest');

    expect(getVisualizationInfoMock).not.toBeCalled();
    expect(fetchVisualizationDefinitionMock).not.toBeCalled();
    expect(getVisualizationErrorTypeMock).not.toBeCalled();
  });

  it('should throw an exception when getVisualizationInfo returns empty value', async () => {
    // given
    const createDossierInstanceMock = jest.spyOn(mstrObjectRestService, 'createDossierInstance')
      .mockImplementation();

    const getVisualizationInfoMock = jest.spyOn(mstrObjectRestService, 'getVisualizationInfo')
      .mockReturnValue(undefined);

    const fetchVisualizationDefinitionMock = jest.spyOn(mstrObjectRestService, 'fetchVisualizationDefinition')
      .mockImplementation();

    const getVisualizationErrorTypeMock = jest.spyOn(dossierInstanceDefinition, 'getVisualizationErrorType')
      .mockImplementation();

    // when
    let result;
    try {
      result = await dossierInstanceDefinition.getDossierInstanceDefinition({
        projectId: 'projectIdTest',
        objectId: 'objectIdTest',
        manipulationsXML: undefined,
        preparedInstanceId: 'preparedInstanceIdTest',
        visualizationInfo: { visualizationKey: 'visualizationKeyTest' },
      });
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(INVALID_VIZ_KEY_MESSAGE);
      expect(result).toBeUndefined();
    }

    expect(createDossierInstanceMock).not.toBeCalled();

    expect(getVisualizationInfoMock).toBeCalledTimes(1);
    expect(getVisualizationInfoMock).toBeCalledWith(
      'projectIdTest',
      'objectIdTest',
      'visualizationKeyTest',
      'preparedInstanceIdTest'
    );

    expect(fetchVisualizationDefinitionMock).not.toBeCalled();
    expect(getVisualizationErrorTypeMock).not.toBeCalled();
  });

  it('should handle exception thrown by fetchVisualizationDefinition', async () => {
    // given
    const createDossierInstanceMock = jest.spyOn(mstrObjectRestService, 'createDossierInstance')
      .mockImplementation();

    const getVisualizationInfoMock = jest.spyOn(mstrObjectRestService, 'getVisualizationInfo')
      .mockReturnValue('updatedVisualizationInfoTest');

    const fetchVisualizationDefinitionMock = jest.spyOn(mstrObjectRestService, 'fetchVisualizationDefinition')
      .mockImplementation(() => {
        throw new Error('errorTest');
      });

    const getVisualizationErrorTypeMock = jest.spyOn(dossierInstanceDefinition, 'getVisualizationErrorType')
      .mockReturnValue('getVisualizationErrorTypeTest');

    // when
    let result;
    try {
      result = await dossierInstanceDefinition.getDossierInstanceDefinition({
        projectId: 'projectIdTest',
        objectId: 'objectIdTest',
        body: 'bodyTest',
        manipulationsXML: undefined,
        preparedInstanceId: 'preparedInstanceIdTest',
        visualizationInfo: { visualizationKey: 'visualizationKeyTest' },
        dossierData: 'dossierDataTest',
        displayAttrFormNames: 'displayAttrFormNamesTest',
      });
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('errorTest');
      expect(error.type).toEqual('getVisualizationErrorTypeTest');
      expect(result).toBeUndefined();
    }

    expect(createDossierInstanceMock).not.toBeCalled();

    expect(getVisualizationInfoMock).toBeCalledTimes(1);
    expect(getVisualizationInfoMock).toBeCalledWith(
      'projectIdTest',
      'objectIdTest',
      'visualizationKeyTest',
      'preparedInstanceIdTest'
    );

    expect(fetchVisualizationDefinitionMock).toBeCalledTimes(1);
    expect(fetchVisualizationDefinitionMock).toBeCalledWith({
      body: 'bodyTest',
      displayAttrFormNames: 'displayAttrFormNamesTest',
      dossierData: 'dossierDataTest',
      instanceId: 'preparedInstanceIdTest',
      mstrObjectType: mstrObjectEnum.mstrObjectType.dossier.name,
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      visualizationInfo: 'updatedVisualizationInfoTest'
    });

    expect(getVisualizationErrorTypeMock).toBeCalledTimes(1);
    expect(getVisualizationErrorTypeMock).toBeCalledWith(new Error('errorTest'));
  });

  it.each`
  expectedBody      | expectedInstanceId  | bodyParam         | manipulationsXMLParam | preparedInstanceIdParam

  ${undefined}      | ${'instanceIdTest'} | ${undefined}      | ${undefined}          | ${undefined}
  ${{ sth: 'sth' }} | ${'instanceIdTest'} | ${{ sth: 'sth' }} | ${undefined}          | ${undefined}

  ${undefined}      | ${'instanceIdTest'} | ${undefined}      | ${{}}                 | ${undefined}
  ${{ sth: 'sth' }} | ${'instanceIdTest'} | ${{ sth: 'sth' }} | ${{}}                 | ${undefined}

  ${undefined}      | ${42}               | ${undefined}      | ${undefined}          | ${42}
  ${{ sth: 'sth' }} | ${42}               | ${{ sth: 'sth' }} | ${undefined}          | ${42}

  ${undefined}      | ${42}               | ${undefined}      | ${{}}                 | ${42}
  ${{ sth: 'sth' }} | ${42}               | ${{ sth: 'sth' }} | ${{}}                 | ${42}

  ${undefined}      | ${'instanceIdTest'} | ${undefined}      | ${undefined}          | ${undefined}
  ${{ sth: 'sth' }} | ${'instanceIdTest'} | ${{ sth: 'sth' }} | ${undefined}          | ${undefined}

  ${undefined}      | ${'instanceIdTest'} | ${undefined}      | ${{}}                 | ${undefined}
  ${{ sth: 'sth' }} | ${'instanceIdTest'} | ${{ sth: 'sth' }} | ${{}}                 | ${undefined}

  ${undefined}      | ${42}               | ${undefined}      | ${undefined}          | ${42}
  ${{ sth: 'sth' }} | ${42}               | ${{ sth: 'sth' }} | ${undefined}          | ${42}

  ${undefined}      | ${42}               | ${undefined}      | ${{}}                 | ${42}
  ${{ sth: 'sth' }} | ${42}               | ${{ sth: 'sth' }} | ${{}}                 | ${42}

  `('getDossierInstanceDefinition should work as expected',
  async ({
    expectedBody,
    expectedInstanceId,
    bodyParam,
    manipulationsXMLParam,
    preparedInstanceIdParam
  }) => {
    // given
    if (manipulationsXMLParam) {
      manipulationsXMLParam.manipulations = 'manipulationsTest';
      manipulationsXMLParam.promptAnswers = 'promptAnswersTest';

      expectedBody = { ...expectedBody };
      expectedBody.manipulations = 'manipulationsTest';
      expectedBody.promptAnswers = 'promptAnswersTest';
    }

    const createDossierInstanceMock = jest.spyOn(mstrObjectRestService, 'createDossierInstance')
      .mockReturnValue('instanceIdTest');

    const getVisualizationInfoMock = jest.spyOn(mstrObjectRestService, 'getVisualizationInfo')
      .mockReturnValue('getVisualizationInfoTest');

    const fetchVisualizationDefinitionMock = jest.spyOn(mstrObjectRestService, 'fetchVisualizationDefinition')
      .mockReturnValue(
        { sth: 'fetchVisualizationDefinitionTest' }
      );

    const getVisualizationErrorTypeMock = jest.spyOn(dossierInstanceDefinition, 'getVisualizationErrorType')
      .mockImplementation();

    // when
    const result = await dossierInstanceDefinition.getDossierInstanceDefinition({
      projectId: 'projectIdTest',
      objectId: 'objectIdTest',
      body: bodyParam,
      dossierData: 'dossierDataTest',
      displayAttrFormNames: 'displayAttrFormNamesTest',
      manipulationsXML: manipulationsXMLParam,
      preparedInstanceId: preparedInstanceIdParam,
      visualizationInfo: { visualizationKey: 'visualizationKeyTest' },
    });

    // then
    if (preparedInstanceIdParam) {
      expect(createDossierInstanceMock).not.toBeCalled();
    } else {
      expect(createDossierInstanceMock).toBeCalledTimes(1);
      expect(createDossierInstanceMock).toBeCalledWith('projectIdTest', 'objectIdTest', expectedBody);
    }

    expect(getVisualizationInfoMock).toBeCalledTimes(1);
    expect(getVisualizationInfoMock).toBeCalledWith(
      'projectIdTest',
      'objectIdTest',
      'visualizationKeyTest',
      expectedInstanceId
    );

    expect(fetchVisualizationDefinitionMock).toBeCalledTimes(1);
    expect(fetchVisualizationDefinitionMock).toBeCalledWith({
      projectId: 'projectIdTest',
      objectId: 'objectIdTest',
      instanceId: expectedInstanceId,
      mstrObjectType: mstrObjectEnum.mstrObjectType.dossier.name,
      dossierData: 'dossierDataTest',
      body: expectedBody,
      visualizationInfo: 'getVisualizationInfoTest',
      displayAttrFormNames: 'displayAttrFormNamesTest'
    });

    expect(getVisualizationErrorTypeMock).not.toBeCalled();

    expect(result.body).toEqual(expectedBody);
    expect(result.visualizationInfo).toEqual('getVisualizationInfoTest');
    expect(result.instanceDefinition).toEqual({
      sth: 'fetchVisualizationDefinitionTest',
      instanceId: expectedInstanceId
    });
  });

  it.each`
  expectedErrorType | error
  
  ${undefined}                  | ${undefined}
  ${undefined}                  | ${{ sth: 'sth' }}
  ${'typeTest'}                 | ${{ type: 'typeTest' }}
  ${undefined}                  | ${{ message: '' }}
  ${undefined}                  | ${{ message: 'messageTest' }}
  ${'typeTest'}                 | ${{ type: 'typeTest', message: '' }}
  ${'typeTest'}                 | ${{ type: 'typeTest', message: 'messageTest' }}

  ${errorTypes.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: `test1 ${incomingErrorStrings.INVALID_VIZ_KEY} test1` }}

  ${'typeTest'}                 | ${{ type: 'typeTest', response: 'test' }}
  ${'typeTest'}                 | ${{ type: 'typeTest', response: { body: 'test' } }}
  ${'typeTest'}                 | ${{ type: 'typeTest', response: { body: { message: 'test' } } }}

  ${errorTypes.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: 'testMessage', response: { body: { message: `test2 ${incomingErrorStrings.INVALID_VIZ_KEY} test2` } } }}
  ${errorTypes.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: 'testMessage', response: { body: { message: `test2 ${incomingErrorStrings.INVALID_VIZ_KEY} test2` } } }}

  ${errorTypes.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: `test1 ${incomingErrorStrings.INVALID_VIZ_KEY} test1`, response: 'test' }}
  ${errorTypes.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: `test1 ${incomingErrorStrings.INVALID_VIZ_KEY} test1`, response: { body: 'test' } }}
  ${errorTypes.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: `test1 ${incomingErrorStrings.INVALID_VIZ_KEY} test1`, response: { body: { message: 'test' } } }}
  ${errorTypes.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: `test1 ${incomingErrorStrings.INVALID_VIZ_KEY} test1`, response: { body: { message: `test2 ${incomingErrorStrings.INVALID_VIZ_KEY} test2` } } }}
  
  `('getVisualizationErrorType work as expected',
  ({ expectedErrorType, error }) => {
    // when
    const result = dossierInstanceDefinition.getVisualizationErrorType(error);

    // then
    expect(result).toEqual(expectedErrorType);
  });
});
