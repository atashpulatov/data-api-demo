import { mstrObjectRestService } from '../mstr-object-rest-service';
import { visualizationInfoService } from '../visualization-info-service';

import { InstanceDefinition } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { DossierData, ObjectData, VisualizationInfo } from '../../types/object-types';

import mstrObjectEnum from '../mstr-object-type-enum';
import dossierInstanceDefinition from './dossier-instance-definition';
import { ErrorType, IncomingErrorStrings } from '../../error/constants';
import { DisplayAttrFormNames } from '../constants';

describe('DossierInstanceDefinition', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle exception thrown by createDossierInstance', async () => {
    // given
    jest.spyOn(mstrObjectRestService, 'createDossierInstance').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(visualizationInfoService, 'getVisualizationInfo').mockImplementation();

    jest.spyOn(mstrObjectRestService, 'fetchVisualizationDefinition').mockImplementation();

    jest.spyOn(dossierInstanceDefinition, 'getVisualizationErrorType').mockImplementation();

    // when
    let result;
    try {
      result = await dossierInstanceDefinition.getDossierInstanceDefinition({
        projectId: 'projectIdTest',
        objectId: 'objectIdTest',
        body: 'bodyTest',
        manipulationsXML: undefined,
        preparedInstanceId: undefined,
      } as ObjectData);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('errorTest');
      expect(error.mstrObjectType).toEqual(mstrObjectEnum.mstrObjectType.dossier.name);
      expect(result).toBeUndefined();
    }

    expect(mstrObjectRestService.createDossierInstance).toBeCalledTimes(1);
    expect(mstrObjectRestService.createDossierInstance).toBeCalledWith(
      'projectIdTest',
      'objectIdTest',
      'bodyTest'
    );

    expect(visualizationInfoService.getVisualizationInfo).not.toBeCalled();
    expect(mstrObjectRestService.fetchVisualizationDefinition).not.toBeCalled();
    expect(dossierInstanceDefinition.getVisualizationErrorType).not.toBeCalled();
  });

  it('should handle exception thrown by fetchVisualizationDefinition', async () => {
    // given
    jest.spyOn(mstrObjectRestService, 'createDossierInstance').mockImplementation();

    jest
      .spyOn(visualizationInfoService, 'getVisualizationInfo')
      .mockResolvedValue('updatedVisualizationInfoTest' as unknown as VisualizationInfo);

    jest.spyOn(mstrObjectRestService, 'fetchVisualizationDefinition').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest
      .spyOn(dossierInstanceDefinition, 'getVisualizationErrorType')
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
        dossierData: 'dossierDataTest' as unknown as DossierData,
        displayAttrFormNames: DisplayAttrFormNames.AUTOMATIC,
      } as ObjectData);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('errorTest');
      expect(error.type).toEqual('getVisualizationErrorTypeTest');
      expect(result).toBeUndefined();
    }

    expect(mstrObjectRestService.createDossierInstance).not.toBeCalled();

    expect(visualizationInfoService.getVisualizationInfo).toBeCalledTimes(1);
    expect(visualizationInfoService.getVisualizationInfo).toBeCalledWith(
      'projectIdTest',
      'objectIdTest',
      'visualizationKeyTest',
      'preparedInstanceIdTest'
    );

    expect(mstrObjectRestService.fetchVisualizationDefinition).toBeCalledTimes(1);
    expect(mstrObjectRestService.fetchVisualizationDefinition).toBeCalledWith({
      body: 'bodyTest',
      displayAttrFormNames: 'displayAttrFormNamesTest',
      dossierData: 'dossierDataTest',
      instanceId: 'preparedInstanceIdTest',
      mstrObjectType: mstrObjectEnum.mstrObjectType.dossier.name,
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      visualizationInfo: 'updatedVisualizationInfoTest',
    });

    expect(dossierInstanceDefinition.getVisualizationErrorType).toBeCalledTimes(1);
    expect(dossierInstanceDefinition.getVisualizationErrorType).toBeCalledWith(
      new Error('errorTest')
    );
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
  `(
    'getDossierInstanceDefinition should work as expected',
    async ({
      expectedBody,
      expectedInstanceId,
      bodyParam,
      manipulationsXMLParam,
      preparedInstanceIdParam,
    }) => {
      // given
      if (manipulationsXMLParam) {
        manipulationsXMLParam.manipulations = 'manipulationsTest';
        manipulationsXMLParam.promptAnswers = 'promptAnswersTest';

        expectedBody = { ...expectedBody };
        expectedBody.manipulations = 'manipulationsTest';
        expectedBody.promptAnswers = 'promptAnswersTest';
      }

      // jest.spyOn(mstrObjectRestService, 'createDossierInstance').mockReturnValue('instanceIdTest');

      // Arrange: Set up any mock functions or data needed for the test
      const mockCreateDossierInstance = jest.spyOn(mstrObjectRestService, 'createDossierInstance');
      // Mock the createDossierInstance function to return a predefined instance
      mockCreateDossierInstance.mockResolvedValue({ mid: expectedInstanceId });

      jest
        .spyOn(visualizationInfoService, 'getVisualizationInfo')
        .mockResolvedValue('getVisualizationInfoTest' as unknown as VisualizationInfo);

      jest
        .spyOn(mstrObjectRestService, 'fetchVisualizationDefinition')
        .mockResolvedValue({ sth: 'fetchVisualizationDefinitionTest' } as InstanceDefinition);

      jest.spyOn(dossierInstanceDefinition, 'getVisualizationErrorType').mockImplementation();

      // when
      const result = await dossierInstanceDefinition.getDossierInstanceDefinition({
        projectId: 'projectIdTest',
        objectId: 'objectIdTest',
        body: bodyParam,
        dossierData: 'dossierDataTest' as unknown as DossierData,
        displayAttrFormNames: DisplayAttrFormNames.AUTOMATIC,
        manipulationsXML: manipulationsXMLParam,
        preparedInstanceId: preparedInstanceIdParam,
        visualizationInfo: { visualizationKey: 'visualizationKeyTest' },
      } as ObjectData);

      // then
      if (preparedInstanceIdParam) {
        expect(mstrObjectRestService.createDossierInstance).not.toBeCalled();
      } else {
        expect(mstrObjectRestService.createDossierInstance).toBeCalledWith(
          'projectIdTest',
          'objectIdTest',
          expectedBody
        );
      }

      expect(visualizationInfoService.getVisualizationInfo).toBeCalledTimes(1);
      expect(visualizationInfoService.getVisualizationInfo).toBeCalledWith(
        'projectIdTest',
        'objectIdTest',
        'visualizationKeyTest',
        expectedInstanceId
      );

      expect(mstrObjectRestService.fetchVisualizationDefinition).toBeCalledTimes(1);
      expect(mstrObjectRestService.fetchVisualizationDefinition).toBeCalledWith({
        projectId: 'projectIdTest',
        objectId: 'objectIdTest',
        instanceId: expectedInstanceId,
        mstrObjectType: mstrObjectEnum.mstrObjectType.dossier.name,
        dossierData: 'dossierDataTest',
        body: expectedBody,
        visualizationInfo: 'getVisualizationInfoTest',
        displayAttrFormNames: 'displayAttrFormNamesTest',
      });

      expect(dossierInstanceDefinition.getVisualizationErrorType).not.toBeCalled();

      expect(result.body).toEqual(expectedBody);
      expect(result.visualizationInfo).toEqual('getVisualizationInfoTest');
      expect(result.instanceDefinition).toEqual({
        sth: 'fetchVisualizationDefinitionTest',
        instanceId: expectedInstanceId,
      });
    }
  );

  it.each`
    expectedErrorType            | error
    ${undefined}                 | ${undefined}
    ${undefined}                 | ${{ sth: 'sth' }}
    ${'typeTest'}                | ${{ type: 'typeTest' }}
    ${undefined}                 | ${{ message: '' }}
    ${undefined}                 | ${{ message: 'messageTest' }}
    ${'typeTest'}                | ${{ type: 'typeTest', message: '' }}
    ${'typeTest'}                | ${{ type: 'typeTest', message: 'messageTest' }}
    ${ErrorType.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: `test1 ${IncomingErrorStrings.INVALID_VIZ_KEY} test1` }}
    ${'typeTest'}                | ${{ type: 'typeTest', response: 'test' }}
    ${'typeTest'}                | ${{ type: 'typeTest', response: { body: 'test' } }}
    ${'typeTest'}                | ${{ type: 'typeTest', response: { body: { message: 'test' } } }}
    ${ErrorType.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: 'testMessage', response: { body: { message: `test2 ${IncomingErrorStrings.INVALID_VIZ_KEY} test2` } } }}
    ${ErrorType.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: 'testMessage', response: { body: { message: `test2 ${IncomingErrorStrings.INVALID_VIZ_KEY} test2` } } }}
    ${ErrorType.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: `test1 ${IncomingErrorStrings.INVALID_VIZ_KEY} test1`, response: 'test' }}
    ${ErrorType.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: `test1 ${IncomingErrorStrings.INVALID_VIZ_KEY} test1`, response: { body: 'test' } }}
    ${ErrorType.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: `test1 ${IncomingErrorStrings.INVALID_VIZ_KEY} test1`, response: { body: { message: 'test' } } }}
    ${ErrorType.INVALID_VIZ_KEY} | ${{ type: 'typeTest', message: `test1 ${IncomingErrorStrings.INVALID_VIZ_KEY} test1`, response: { body: { message: `test2 ${IncomingErrorStrings.INVALID_VIZ_KEY} test2` } } }}
  `('getVisualizationErrorType work as expected', ({ expectedErrorType, error }) => {
    // when
    const result = dossierInstanceDefinition.getVisualizationErrorType(error);

    // then
    expect(result).toEqual(expectedErrorType);
  });
});
