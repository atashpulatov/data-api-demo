import { authenticationHelper } from '../../authentication/authentication-helper';
import { officeApiCrosstabHelper } from '../../office/api/office-api-crosstab-helper';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import { pageByHelper } from '../../page-by/page-by-helper';
import { mstrObjectRestService } from '../mstr-object-rest-service';
import instanceDefinitionHelper from './instance-definition-helper';

import { PageByDisplayType } from '../../page-by/page-by-types';
import {
  InstanceDefinition,
  MstrTable,
  OperationData,
} from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';
import { MstrObjectTypes } from '../mstr-object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { OperationSteps } from '../../operation/operation-steps';
import mstrObjectEnum from '../mstr-object-type-enum';
import dossierInstanceDefinition from './dossier-instance-definition';
import stepGetInstanceDefinition from './step-get-instance-definition';
import { ErrorMessages } from '../../error/constants';
import { DisplayAttrFormNames } from '../constants';

describe('StepGetInstanceDefinition', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('applyFormatting should log exceptions', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(mstrObjectRestService, 'answerPrompts').mockImplementation(() => {
      throw new Error('errorTest');
    });

    // when
    try {
      // @ts-expect-error
      await instanceDefinitionHelper.modifyInstanceWithPrompt({
        instanceDefinition: {
          status: 2,
        },
        promptsAnswers: ['answer1'],
      });
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('errorTest');
    }

    // then
    expect(mstrObjectRestService.answerPrompts).toBeCalledTimes(1);
    expect(mstrObjectRestService.answerPrompts).toThrowError(Error);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));
  });

  it.each`
    handleOperationErrorCallNo | expectedErrorMsg                       | rowsParam | isPromptedParam
    ${1}                       | ${ErrorMessages.ALL_DATA_FILTERED_OUT} | ${[]}     | ${true}
    ${0}                       | ${ErrorMessages.ALL_DATA_FILTERED_OUT} | ${[42]}   | ${true}
    ${1}                       | ${ErrorMessages.NO_DATA_RETURNED}      | ${[]}     | ${false}
    ${0}                       | ${ErrorMessages.NO_DATA_RETURNED}      | ${[42]}   | ${false}
  `(
    'getInstanceDefinition works as expected when mstrTable.rows.length is 0',
    async ({ handleOperationErrorCallNo, expectedErrorMsg, rowsParam, isPromptedParam }) => {
      // given
      jest.spyOn(console, 'error');

      jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation();
      jest.spyOn(officeApiWorksheetHelper, 'isActiveWorksheetEmpty').mockImplementation();
      jest.spyOn(mstrObjectRestService, 'createInstance').mockImplementation();
      jest.spyOn(pageByHelper, 'getPageByDataForDisplayType').mockImplementation();
      jest
        .spyOn(instanceDefinitionHelper, 'modifyInstanceWithPrompt')
        .mockResolvedValue({ mstrTable: { rows: rowsParam } });
      jest.spyOn(stepGetInstanceDefinition, 'savePreviousObjectData').mockImplementation();

      jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

      jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();
      jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
      jest.spyOn(operationStepDispatcher, 'completeGetInstanceDefinition').mockImplementation();

      const expectedDispatchCallNo = handleOperationErrorCallNo === 1 ? 0 : 1;

      // when
      await stepGetInstanceDefinition.getInstanceDefinition(
        {
          mstrObjectType: {} as MstrObjectTypes,
          isPrompted: isPromptedParam,
        } as unknown as ObjectData,
        {
          stepsQueue: ['step_0', 'step_1', undefined],
        } as unknown as OperationData
      );

      // then
      expect(operationErrorHandler.handleOperationError).toBeCalledTimes(
        handleOperationErrorCallNo
      );
      if (handleOperationErrorCallNo === 1) {
        expect(console.error).toBeCalledTimes(1);
        expect(console.error).toBeCalledWith(new Error(expectedErrorMsg));

        expect(operationErrorHandler.handleOperationError).toBeCalledWith(
          {
            mstrObjectType: {},
            isPrompted: isPromptedParam,
          },
          {
            stepsQueue: ['step_0', 'step_1', undefined],
          },
          new Error(expectedErrorMsg)
        );
      }

      expect(operationStepDispatcher.updateOperation).toBeCalledTimes(expectedDispatchCallNo);
      expect(operationStepDispatcher.updateObject).toBeCalledTimes(expectedDispatchCallNo);
      expect(operationStepDispatcher.completeGetInstanceDefinition).toBeCalledTimes(
        expectedDispatchCallNo
      );
    }
  );

  it.each`
    expectedVisualizationInfo         | visualizationInfoParam            | nextStepParam                                   | manipulationsXMLParam
    ${false}                          | ${undefined}                      | ${OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH} | ${undefined}
    ${false}                          | ${false}                          | ${OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH} | ${undefined}
    ${'visualizationInfoDossierTest'} | ${'visualizationInfoDossierTest'} | ${OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH} | ${undefined}
    ${false}                          | ${undefined}                      | ${OperationSteps.GET_OFFICE_TABLE_IMPORT}       | ${undefined}
    ${false}                          | ${false}                          | ${OperationSteps.GET_OFFICE_TABLE_IMPORT}       | ${undefined}
    ${'visualizationInfoDossierTest'} | ${'visualizationInfoDossierTest'} | ${OperationSteps.GET_OFFICE_TABLE_IMPORT}       | ${undefined}
    ${false}                          | ${undefined}                      | ${OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH} | ${'manipulationsXMLTest'}
    ${false}                          | ${false}                          | ${OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH} | ${'manipulationsXMLTest'}
    ${'visualizationInfoDossierTest'} | ${'visualizationInfoDossierTest'} | ${OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH} | ${'manipulationsXMLTest'}
    ${false}                          | ${undefined}                      | ${OperationSteps.GET_OFFICE_TABLE_IMPORT}       | ${'manipulationsXMLTest'}
    ${false}                          | ${false}                          | ${OperationSteps.GET_OFFICE_TABLE_IMPORT}       | ${'manipulationsXMLTest'}
    ${'visualizationInfoDossierTest'} | ${'visualizationInfoDossierTest'} | ${OperationSteps.GET_OFFICE_TABLE_IMPORT}       | ${'manipulationsXMLTest'}
  `(
    'getInstanceDefinition should work as expected for visualization',
    async ({
      expectedVisualizationInfo,
      visualizationInfoParam,
      nextStepParam,
      manipulationsXMLParam,
    }) => {
      // given
      const objectData = {
        objectWorkingId: 'objectWorkingIdTest',
        insertNewWorksheet: 'insertNewWorksheetTest',
        crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
        subtotalsInfo: {
          subtotalsAddresses: 'subtotalsAddressesTest',
        },
        bindId: 'bindIdTest',
        mstrObjectType: {
          name: mstrObjectEnum.mstrObjectType.visualization.name,
        },
        visualizationInfo: 'visualizationInfoTest',
        body: 'bodyDossierTest',
        name: 'nameTest',
        importType: 'table',
      } as unknown as ObjectData;

      const excelContext = { sync: jest.fn() };
      jest
        .spyOn(officeApiHelper, 'getExcelContext')
        .mockResolvedValue(excelContext as unknown as Excel.RequestContext);

      jest.spyOn(authenticationHelper, 'getCurrentMstrContext').mockReturnValue({
        envUrl: 'envUrlTest',
        username: 'usernameTest',
      });

      jest.spyOn(dossierInstanceDefinition, 'getDossierInstanceDefinition').mockResolvedValue({
        body: 'bodyDossierTest',
        visualizationInfo: visualizationInfoParam,
        instanceDefinition: {
          mstrTable: {
            name: 'mstrTableNameDossierTest',
          } as unknown as MstrTable,
        },
        viewFilterText: '-',
      });

      jest
        .spyOn(dossierInstanceDefinition, 'getVisualizationName')
        .mockReturnValue('getVisualizationNameTest');

      jest.spyOn(mstrObjectRestService, 'createInstance').mockImplementation();

      jest.spyOn(instanceDefinitionHelper, 'modifyInstanceWithPrompt').mockResolvedValue({
        mstrTable: {
          name: 'nameModifyInstanceWithPromptTest',
          rows: 'rowsModifyInstanceWithPromptTest',
          insertNewWorksheet: 'insertNewWorksheetTest',
          crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
          isCrosstab: 'isCrossTabTest',
          manipulationsXML: manipulationsXMLParam,
          attributes: ['some attributes'],
          metrics: ['some metrics'],
        },
        rows: 'rowsModifyInstanceWithPromptTest',
      });

      const expectedMstrTable = {
        name: 'nameModifyInstanceWithPromptTest',
        rows: 'rowsModifyInstanceWithPromptTest',
        insertNewWorksheet: 'insertNewWorksheetTest',
        crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
        isCrosstab: 'isCrossTabTest',
        attributes: ['some attributes'],
        metrics: ['some metrics'],
      };

      if (manipulationsXMLParam) {
        // @ts-expect-error
        expectedMstrTable.manipulationsXML = manipulationsXMLParam;
      }

      jest.spyOn(pageByHelper, 'getPageByDataForDisplayType').mockImplementation();

      jest.spyOn(stepGetInstanceDefinition, 'savePreviousObjectData').mockImplementation();

      jest.spyOn(officeApiWorksheetHelper, 'isActiveWorksheetEmpty').mockResolvedValue(false);

      const worksheet = { activate: jest.fn() };
      jest
        .spyOn(officeApiWorksheetHelper, 'createNewWorksheet')
        .mockResolvedValue(worksheet as any);

      jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();
      jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
      jest.spyOn(operationStepDispatcher, 'completeGetInstanceDefinition').mockImplementation();

      // when
      await stepGetInstanceDefinition.getInstanceDefinition(objectData, {
        operationType: 'operationTypeTest',
        stepsQueue: ['step_0', 'step_1', nextStepParam],
      } as unknown as OperationData);

      // then
      expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);

      expect(dossierInstanceDefinition.getDossierInstanceDefinition).toBeCalledTimes(1);
      expect(dossierInstanceDefinition.getDossierInstanceDefinition).toBeCalledWith({
        objectWorkingId: 'objectWorkingIdTest',
        insertNewWorksheet: 'insertNewWorksheetTest',
        crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
        subtotalsInfo: {
          subtotalsAddresses: 'subtotalsAddressesTest',
        },
        bindId: 'bindIdTest',
        mstrObjectType: {
          name: mstrObjectEnum.mstrObjectType.visualization.name,
        },
        body: 'bodyDossierTest',
        visualizationInfo: 'visualizationInfoTest',
        name: 'nameTest',
        importType: 'table',
      });

      expect(dossierInstanceDefinition.getVisualizationName).toBeCalledTimes(1);
      expect(dossierInstanceDefinition.getVisualizationName).toBeCalledWith(
        {
          operationType: 'operationTypeTest',
          stepsQueue: ['step_0', 'step_1', nextStepParam],
        },
        'nameTest',
        { mstrTable: { name: 'mstrTableNameDossierTest' } }
      );

      expect(mstrObjectRestService.createInstance).not.toBeCalled();

      expect(instanceDefinitionHelper.modifyInstanceWithPrompt).toBeCalledTimes(1);
      expect(instanceDefinitionHelper.modifyInstanceWithPrompt).toBeCalledWith({
        instanceDefinition: {
          mstrTable: {
            name: 'mstrTableNameDossierTest',
          },
        },
        objectWorkingId: 'objectWorkingIdTest',
        subtotalsInfo: {
          subtotalsAddresses: 'subtotalsAddressesTest',
        },
        bindId: 'bindIdTest',
        mstrObjectType: {
          name: mstrObjectEnum.mstrObjectType.visualization.name,
        },
        visualizationInfo: 'visualizationInfoTest',
        body: 'bodyDossierTest',
        insertNewWorksheet: 'insertNewWorksheetTest',
        crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
        name: 'nameTest',
        importType: 'table',
      });

      expect(stepGetInstanceDefinition.savePreviousObjectData).toBeCalledTimes(1);
      expect(stepGetInstanceDefinition.savePreviousObjectData).toBeCalledWith(
        {
          mstrTable: expectedMstrTable,
          rows: 'rowsModifyInstanceWithPromptTest',
        },
        'crosstabHeaderDimensionsTest',
        'subtotalsAddressesTest',
        nextStepParam,
        'table'
      );

      expect(authenticationHelper.getCurrentMstrContext).toBeCalledTimes(1);

      expect(operationStepDispatcher.updateOperation).toBeCalledTimes(1);
      expect(operationStepDispatcher.updateOperation).toBeCalledWith({
        excelContext,
        insertNewWorksheet: 'insertNewWorksheetTest',
        instanceDefinition: {
          mstrTable: expectedMstrTable,
          rows: 'rowsModifyInstanceWithPromptTest',
        },
        oldBindId: 'bindIdTest',
        shouldRenameExcelWorksheet: false,
        objectWorkingId: 'objectWorkingIdTest',
        totalRows: 'rowsModifyInstanceWithPromptTest',
      });

      expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
      expect(operationStepDispatcher.updateObject).toBeCalledWith({
        body: 'bodyDossierTest',
        crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
        envUrl: {
          envUrl: 'envUrlTest',
          username: 'usernameTest',
        },
        isCrosstab: 'isCrossTabTest',
        name: 'getVisualizationNameTest',
        objectWorkingId: 'objectWorkingIdTest',
        visualizationInfo: expectedVisualizationInfo,
        subtotalsInfo: {
          subtotalsAddresses: 'subtotalsAddressesTest',
        },
        definition: {
          attributes: ['some attributes'],
          metrics: ['some metrics'],
        },
        manipulationsXML: false,
        details: {
          filters: {
            viewFilterText: '-',
          },
        },
      });

      expect(operationStepDispatcher.completeGetInstanceDefinition).toBeCalledTimes(1);
      expect(operationStepDispatcher.completeGetInstanceDefinition).toBeCalledWith(
        'objectWorkingIdTest'
      );
    }
  );

  it.each`
    expectedVisualizationInfo         | visualizationInfoParam            | nextStepParam
    ${false}                          | ${undefined}                      | ${OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH}
    ${false}                          | ${false}                          | ${OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH}
    ${'visualizationInfoDossierTest'} | ${'visualizationInfoDossierTest'} | ${OperationSteps.GET_OFFICE_TABLE_EDIT_REFRESH}
    ${false}                          | ${undefined}                      | ${OperationSteps.GET_OFFICE_TABLE_IMPORT}
    ${false}                          | ${false}                          | ${OperationSteps.GET_OFFICE_TABLE_IMPORT}
    ${'visualizationInfoDossierTest'} | ${'visualizationInfoDossierTest'} | ${OperationSteps.GET_OFFICE_TABLE_IMPORT}
  `(
    'getInstanceDefinition should work as expected for NO visualization',
    async ({ expectedVisualizationInfo, visualizationInfoParam, nextStepParam }) => {
      // given
      const objectData = {
        objectWorkingId: 'objectWorkingIdTest',
        crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
        subtotalsInfo: {
          subtotalsAddresses: 'subtotalsAddressesTest',
        },
        bindId: 'bindIdTest',
        mstrObjectType: {
          name: mstrObjectEnum.mstrObjectType.report.name,
        },
        visualizationInfo: visualizationInfoParam,
        body: 'bodyTest',
        name: 'nameTest',
        importType: 'table',
        pageByData: {
          pageByDisplayType: PageByDisplayType.DEFAULT_PAGE,
          pageByLinkId: 'pageByLinkIdTest',
          elements: [
            {
              name: 'elementName',
              value: 'elementValue',
              valueId: 'elementValueId',
            },
          ],
        },
      } as unknown as ObjectData;

      jest
        .spyOn(officeApiHelper, 'getExcelContext')
        .mockResolvedValue('excelContextTest' as unknown as Excel.RequestContext);

      jest.spyOn(authenticationHelper, 'getCurrentMstrContext').mockReturnValue({
        envUrl: 'envUrlTest',
        username: 'usernameTest',
      });

      jest.spyOn(instanceDefinitionHelper, 'setupBodyTemplate').mockReturnValue(objectData.body);

      jest
        .spyOn(dossierInstanceDefinition, 'getDossierInstanceDefinition')
        .mockImplementation()
        .mockResolvedValue({
          body: 'bodyDossierTest',
          visualizationInfo: visualizationInfoParam,
          instanceDefinition: {
            mstrTable: {
              name: 'mstrTableNameDossierTest',
            } as unknown as MstrTable,
          },
          viewFilterText: '-',
        });

      jest.spyOn(mstrObjectRestService, 'createInstance').mockResolvedValue({
        mstrTable: {
          name: 'mstrTableNameNoDossierTest',
        },
      } as unknown as InstanceDefinition);

      jest.spyOn(instanceDefinitionHelper, 'modifyInstanceWithPrompt').mockResolvedValue({
        mstrTable: {
          name: 'nameModifyInstanceWithPromptTest',
          rows: 'rowsModifyInstanceWithPromptTest',
          crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
          isCrosstab: 'isCrossTabTest',
          attributes: ['some attributes'],
          metrics: ['some metrics'],
        },
        rows: 'rowsModifyInstanceWithPromptTest',
      });

      jest.spyOn(pageByHelper, 'getPageByDataForDisplayType').mockImplementation();

      jest.spyOn(stepGetInstanceDefinition, 'savePreviousObjectData').mockImplementation();

      jest.spyOn(officeApiWorksheetHelper, 'isActiveWorksheetEmpty').mockResolvedValue(false);

      const worksheet = { activate: jest.fn() };
      jest
        .spyOn(officeApiWorksheetHelper, 'createNewWorksheet')
        .mockResolvedValue(worksheet as any);

      jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();
      jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
      jest.spyOn(operationStepDispatcher, 'completeGetInstanceDefinition').mockImplementation();

      // when
      await stepGetInstanceDefinition.getInstanceDefinition(objectData, {
        operationType: 'operationTypeTest',
        stepsQueue: ['step_0', 'step_1', nextStepParam],
      } as unknown as OperationData);

      // then
      expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);

      expect(instanceDefinitionHelper.setupBodyTemplate).toBeCalledTimes(1);
      expect(instanceDefinitionHelper.setupBodyTemplate).toBeCalledWith('bodyTest');

      expect(dossierInstanceDefinition.getDossierInstanceDefinition).not.toBeCalled();

      expect(mstrObjectRestService.createInstance).toBeCalledTimes(1);

      expect(instanceDefinitionHelper.modifyInstanceWithPrompt).toBeCalledTimes(1);
      expect(instanceDefinitionHelper.modifyInstanceWithPrompt).toBeCalledWith({
        bindId: 'bindIdTest',
        body: 'bodyTest',
        crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
        importType: 'table',
        instanceDefinition: {
          mstrTable: {
            name: 'mstrTableNameNoDossierTest',
          },
        },
        mstrObjectType: {
          name: 'report',
        },
        name: 'nameTest',
        objectWorkingId: 'objectWorkingIdTest',
        subtotalsInfo: {
          subtotalsAddresses: 'subtotalsAddressesTest',
        },
        visualizationInfo: visualizationInfoParam,
        pageByData: {
          pageByDisplayType: PageByDisplayType.DEFAULT_PAGE,
          pageByLinkId: 'pageByLinkIdTest',
          elements: [
            {
              name: 'elementName',
              value: 'elementValue',
              valueId: 'elementValueId',
            },
          ],
        },
      });

      jest.spyOn(pageByHelper, 'getPageByDataForDisplayType').mockImplementation();

      expect(stepGetInstanceDefinition.savePreviousObjectData).toBeCalledTimes(1);
      expect(stepGetInstanceDefinition.savePreviousObjectData).toBeCalledWith(
        {
          mstrTable: {
            name: 'nameModifyInstanceWithPromptTest',
            rows: 'rowsModifyInstanceWithPromptTest',
            crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
            isCrosstab: 'isCrossTabTest',
            attributes: ['some attributes'],
            metrics: ['some metrics'],
          },
          rows: 'rowsModifyInstanceWithPromptTest',
        },
        'crosstabHeaderDimensionsTest',
        'subtotalsAddressesTest',
        nextStepParam,
        'table'
      );

      expect(authenticationHelper.getCurrentMstrContext).toBeCalledTimes(1);

      expect(operationStepDispatcher.updateOperation).toBeCalledTimes(1);
      expect(operationStepDispatcher.updateOperation).toBeCalledWith({
        excelContext: 'excelContextTest',
        instanceDefinition: {
          mstrTable: {
            attributes: ['some attributes'],
            metrics: ['some metrics'],
            name: 'nameModifyInstanceWithPromptTest',
            rows: 'rowsModifyInstanceWithPromptTest',
            crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
            isCrosstab: 'isCrossTabTest',
          },
          rows: 'rowsModifyInstanceWithPromptTest',
        },
        oldBindId: 'bindIdTest',
        shouldRenameExcelWorksheet: false,
        objectWorkingId: 'objectWorkingIdTest',
        totalRows: 'rowsModifyInstanceWithPromptTest',
      });

      expect(operationStepDispatcher.updateObject).toBeCalledTimes(1);
      expect(operationStepDispatcher.updateObject).toBeCalledWith({
        body: 'bodyTest',
        crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
        envUrl: {
          envUrl: 'envUrlTest',
          username: 'usernameTest',
        },
        isCrosstab: 'isCrossTabTest',
        name: 'nameTest',
        objectWorkingId: 'objectWorkingIdTest',
        visualizationInfo: expectedVisualizationInfo,
        subtotalsInfo: {
          subtotalsAddresses: 'subtotalsAddressesTest',
        },
        definition: {
          attributes: ['some attributes'],
          metrics: ['some metrics'],
        },
        manipulationsXML: false,
        details: {
          filters: {
            viewFilterText: '-',
          },
        },
      });

      expect(operationStepDispatcher.completeGetInstanceDefinition).toBeCalledTimes(1);
      expect(operationStepDispatcher.completeGetInstanceDefinition).toBeCalledWith(
        'objectWorkingIdTest'
      );
    }
  );

  it.each`
    expectedBodyTemplate                 | expectedRequestedObjects             | body
    ${undefined}                         | ${undefined}                         | ${{}}
    ${undefined}                         | ${undefined}                         | ${{ sth: 'sth' }}
    ${undefined}                         | ${undefined}                         | ${{ requestedObjects: { attributes: [], metrics: [] } }}
    ${{ attributes: [1], metrics: [] }}  | ${{ attributes: [1], metrics: [] }}  | ${{ requestedObjects: { attributes: [1], metrics: [] } }}
    ${{ attributes: [], metrics: [1] }}  | ${{ attributes: [], metrics: [1] }}  | ${{ requestedObjects: { attributes: [], metrics: [1] } }}
    ${{ attributes: [1], metrics: [1] }} | ${{ attributes: [1], metrics: [1] }} | ${{ requestedObjects: { attributes: [1], metrics: [1] } }}
  `(
    'setupBodyTemplate should work as expected',
    ({ expectedBodyTemplate, expectedRequestedObjects, body }) => {
      // when
      const modifiedBody = instanceDefinitionHelper.setupBodyTemplate(body);

      // then
      expect(modifiedBody.template).toEqual(expectedBodyTemplate);
      expect(modifiedBody.requestedObjects).toEqual(expectedRequestedObjects);
    }
  );

  it('modifyInstanceWithPrompt should work as expected - status not 2', async () => {
    // given
    const instanceDefinitionMock = { status: 1 };

    jest.spyOn(mstrObjectRestService, 'answerPrompts').mockImplementation();

    // when
    // @ts-expect-error
    const result = await instanceDefinitionHelper.modifyInstanceWithPrompt({
      instanceDefinition: instanceDefinitionMock,
    });

    // then
    expect(mstrObjectRestService.answerPrompts).not.toBeCalled();

    expect(result).toEqual(instanceDefinitionMock);
  });

  it('modifyInstanceWithPrompt should work as expected - status 2, no prompt answers', async () => {
    // given
    const instanceDefinitionMock = { status: 2 };

    jest.spyOn(mstrObjectRestService, 'answerPrompts').mockImplementation();

    // when
    const result = await instanceDefinitionHelper.modifyInstanceWithPrompt({
      instanceDefinition: instanceDefinitionMock,
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: [],
      dossierData: 'dossierDataTest',
      body: 'bodyTest',
      displayAttrFormNames: DisplayAttrFormNames.AUTOMATIC,
    });

    // then
    expect(mstrObjectRestService.answerPrompts).not.toBeCalled();

    expect(result).toEqual(instanceDefinitionMock);
  });

  it('modifyInstanceWithPrompt should work as expected - status 2, with 1 prompt answer', async () => {
    // given
    jest.spyOn(mstrObjectRestService, 'answerPrompts').mockImplementation();

    jest.spyOn(mstrObjectRestService, 'modifyInstance').mockResolvedValue({
      status: 1,
      instanceId: 'instanceIdTest',
    });

    // when
    const result = await instanceDefinitionHelper.modifyInstanceWithPrompt({
      instanceDefinition: {
        status: 2,
        instanceId: 'instanceIdTest',
      },
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: ['answer1'],
      dossierData: 'dossierDataTest',
      body: 'bodyTest',
      displayAttrFormNames: DisplayAttrFormNames.AUTOMATIC,
    });

    // then
    expect(mstrObjectRestService.answerPrompts).toBeCalledTimes(1);
    expect(mstrObjectRestService.answerPrompts).toBeCalledWith({
      instanceId: 'instanceIdTest',
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: 'answer1',
    });

    expect(mstrObjectRestService.modifyInstance).toBeCalledTimes(1);
    expect(mstrObjectRestService.modifyInstance).toHaveBeenNthCalledWith(1, {
      body: 'bodyTest',
      displayAttrFormNames: DisplayAttrFormNames.AUTOMATIC,
      dossierData: 'dossierDataTest',
      instanceId: 'instanceIdTest',
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: 'answer1',
    });

    expect(result).toEqual({
      status: 1,
      instanceId: 'instanceIdTest',
    });
  });

  it('modifyInstanceWithPrompt should work as expected - status 2, with many prompt answers', async () => {
    // given
    jest.spyOn(mstrObjectRestService, 'answerPrompts').mockImplementation();

    jest.spyOn(mstrObjectRestService, 'modifyInstance').mockResolvedValue({
      status: 1,
      instanceId: 'instanceIdTest',
    });

    // when
    const result = await instanceDefinitionHelper.modifyInstanceWithPrompt({
      instanceDefinition: {
        status: 2,
        instanceId: 'instanceIdTest',
      },
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: ['answer1', 'answer2'],
      dossierData: 'dossierDataTest',
      body: 'bodyTest',
      displayAttrFormNames: DisplayAttrFormNames.AUTOMATIC,
    });

    // then
    expect(mstrObjectRestService.answerPrompts).toBeCalledTimes(2);
    expect(mstrObjectRestService.answerPrompts).toHaveBeenNthCalledWith(1, {
      instanceId: 'instanceIdTest',
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: 'answer1',
    });
    expect(mstrObjectRestService.answerPrompts).toHaveBeenNthCalledWith(2, {
      instanceId: 'instanceIdTest',
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: 'answer2',
    });

    expect(mstrObjectRestService.modifyInstance).toBeCalledTimes(1);
    expect(mstrObjectRestService.modifyInstance).toHaveBeenNthCalledWith(1, {
      body: 'bodyTest',
      displayAttrFormNames: DisplayAttrFormNames.AUTOMATIC,
      dossierData: 'dossierDataTest',
      instanceId: 'instanceIdTest',
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: 'answer2',
    });

    expect(result).toEqual({
      status: 1,
      instanceId: 'instanceIdTest',
    });
  });

  it.each`
    expectedPrevCrosstabDimensions    | expectedCrosstabHeaderDimensions  | callNo | isCrosstab | crosstabHeaderDimensions
    ${false}                          | ${'crosstabHeaderDimensionsTest'} | ${1}   | ${true}    | ${undefined}
    ${false}                          | ${'crosstabHeaderDimensionsTest'} | ${1}   | ${true}    | ${false}
    ${'crosstabHeaderDimensionsTest'} | ${'crosstabHeaderDimensionsTest'} | ${1}   | ${true}    | ${'crosstabHeaderDimensionsTest'}
    ${false}                          | ${false}                          | ${0}   | ${false}   | ${undefined}
    ${false}                          | ${false}                          | ${0}   | ${false}   | ${false}
    ${'crosstabHeaderDimensionsTest'} | ${false}                          | ${0}   | ${false}   | ${'crosstabHeaderDimensionsTest'}
  `(
    'savePreviousObjectData should work as expected',
    ({
      expectedPrevCrosstabDimensions,
      expectedCrosstabHeaderDimensions,
      callNo,
      isCrosstab,
      crosstabHeaderDimensions,
    }) => {
      // given
      const mstrTableMock = {
        isCrosstab,
        subtotalsInfo: {},
      } as unknown as MstrTable;

      const instanceDefinition = { mstrTable: mstrTableMock };

      jest
        .spyOn(officeApiCrosstabHelper, 'getCrosstabHeaderDimensions')
        .mockReturnValue('crosstabHeaderDimensionsTest');

      // when
      stepGetInstanceDefinition.savePreviousObjectData(
        instanceDefinition,
        crosstabHeaderDimensions,
        'subtotalsAddressesTest' as unknown as any[]
      );

      // then
      expect(officeApiCrosstabHelper.getCrosstabHeaderDimensions).toBeCalledTimes(callNo);
      if (callNo === 1) {
        expect(officeApiCrosstabHelper.getCrosstabHeaderDimensions).toBeCalledWith(
          instanceDefinition
        );
      }

      expect(mstrTableMock.prevCrosstabDimensions).toEqual(expectedPrevCrosstabDimensions);
      expect(mstrTableMock.crosstabHeaderDimensions).toEqual(expectedCrosstabHeaderDimensions);
      expect(mstrTableMock.subtotalsInfo.subtotalsAddresses).toEqual('subtotalsAddressesTest');
    }
  );
});
