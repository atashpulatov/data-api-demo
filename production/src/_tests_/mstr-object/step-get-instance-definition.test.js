import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeApiHelper } from '../../office/api/office-api-helper';
import stepGetInstanceDefinition from '../../mstr-object/step-get-instance-definition';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import dossierInstanceDefinition from '../../mstr-object/dossier-instance-definition';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { officeApiCrosstabHelper } from '../../office/api/office-api-crosstab-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import { GET_OFFICE_TABLE_IMPORT } from '../../operation/operation-steps';
import operationErrorHandler from '../../operation/operation-error-handler';
import { ALL_DATA_FILTERED_OUT, NO_DATA_RETURNED } from '../../error/constants';

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
      await stepGetInstanceDefinition.modifyInstanceWithPrompt({
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
  handleOperationErrorCallNo      | expectedErrorMsg         | rowsParam | isPromptedParam
  
  ${1}                            | ${ALL_DATA_FILTERED_OUT} | ${[]}     | ${true}
  ${0}                            | ${ALL_DATA_FILTERED_OUT} | ${[42]}   | ${true}
                                            
  ${1}                            | ${NO_DATA_RETURNED}      | ${[]}     | ${false}
  ${0}                            | ${NO_DATA_RETURNED}      | ${[42]}   | ${false}
  
  `('getInstanceDefinition works as expected when mstrTable.rows.length is 0',
  async ({
    handleOperationErrorCallNo,
    expectedErrorMsg,
    rowsParam,
    isPromptedParam,
  }) => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation();
    jest.spyOn(mstrObjectRestService, 'createInstance').mockImplementation();
    jest.spyOn(stepGetInstanceDefinition, 'modifyInstanceWithPrompt').mockReturnValue(
      { mstrTable: { rows: rowsParam } }
    );
    jest.spyOn(stepGetInstanceDefinition, 'savePreviousObjectData').mockImplementation();

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'completeGetInstanceDefinition').mockImplementation();

    const expectedDispatchCallNo = handleOperationErrorCallNo === 1 ? 0 : 1;

    // when
    await stepGetInstanceDefinition.getInstanceDefinition({
      mstrObjectType: {},
      isPrompted: isPromptedParam,
    }, {
      stepsQueue: ['step_0', undefined],
    });

    // then
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(handleOperationErrorCallNo);
    if (handleOperationErrorCallNo === 1) {
      expect(console.error).toBeCalledTimes(1);
      expect(console.error).toBeCalledWith(new Error(expectedErrorMsg));

      expect(operationErrorHandler.handleOperationError).toBeCalledWith({
        mstrObjectType: {},
        isPrompted: isPromptedParam,
      }, {
        stepsQueue: ['step_0', undefined],
      }, new Error(expectedErrorMsg));
    }

    expect(operationStepDispatcher.updateOperation).toBeCalledTimes(expectedDispatchCallNo);
    expect(operationStepDispatcher.updateObject).toBeCalledTimes(expectedDispatchCallNo);
    expect(operationStepDispatcher.completeGetInstanceDefinition).toBeCalledTimes(expectedDispatchCallNo);
  });

  it.each`
  expectedVisualizationInfo         | expectedStartCell  | expectedGetStartCellCallsNo | visualizationInfoParam            | nextStepParam                    | manipulationsXMLParam

  ${false}                          | ${undefined}       | ${0}                        | ${undefined}                      | ${'not GET_OFFICE_TABLE_IMPORT'} | ${undefined}
  ${false}                          | ${undefined}       | ${0}                        | ${false}                          | ${'not GET_OFFICE_TABLE_IMPORT'} | ${undefined}
  ${'visualizationInfoDossierTest'} | ${undefined}       | ${0}                        | ${'visualizationInfoDossierTest'} | ${'not GET_OFFICE_TABLE_IMPORT'} | ${undefined}

  ${false}                          | ${'startCellTest'} | ${1}                        | ${undefined}                      | ${GET_OFFICE_TABLE_IMPORT}       | ${undefined}
  ${false}                          | ${'startCellTest'} | ${1}                        | ${false}                          | ${GET_OFFICE_TABLE_IMPORT}       | ${undefined}
  ${'visualizationInfoDossierTest'} | ${'startCellTest'} | ${1}                        | ${'visualizationInfoDossierTest'} | ${GET_OFFICE_TABLE_IMPORT}       | ${undefined}

  ${false}                          | ${undefined}       | ${0}                        | ${undefined}                      | ${'not GET_OFFICE_TABLE_IMPORT'} | ${'manipulationsXMLTest'}
  ${false}                          | ${undefined}       | ${0}                        | ${false}                          | ${'not GET_OFFICE_TABLE_IMPORT'} | ${'manipulationsXMLTest'}
  ${'visualizationInfoDossierTest'} | ${undefined}       | ${0}                        | ${'visualizationInfoDossierTest'} | ${'not GET_OFFICE_TABLE_IMPORT'} | ${'manipulationsXMLTest'}

  ${false}                          | ${'startCellTest'} | ${1}                        | ${undefined}                      | ${GET_OFFICE_TABLE_IMPORT}       | ${'manipulationsXMLTest'}
  ${false}                          | ${'startCellTest'} | ${1}                        | ${false}                          | ${GET_OFFICE_TABLE_IMPORT}       | ${'manipulationsXMLTest'}
  ${'visualizationInfoDossierTest'} | ${'startCellTest'} | ${1}                        | ${'visualizationInfoDossierTest'} | ${GET_OFFICE_TABLE_IMPORT}       | ${'manipulationsXMLTest'}

  `('getInstanceDefinition should work as expected for visualization',
  async ({
    expectedVisualizationInfo,
    expectedStartCell,
    expectedGetStartCellCallsNo,
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
      body: 'bodyTest',
      name: 'nameTest',
    };

    jest.spyOn(officeApiHelper, 'getExcelContext').mockReturnValue('excelContextTest');

    jest.spyOn(officeApiHelper, 'getCurrentMstrContext')
      .mockReturnValue({
        envUrl: 'envUrlTest',
        username: 'usernameTest',
      });

    jest.spyOn(stepGetInstanceDefinition, 'setupBodyTemplate').mockImplementation();

    jest.spyOn(dossierInstanceDefinition, 'getDossierInstanceDefinition')
      .mockReturnValue({
        body: 'bodyDossierTest',
        visualizationInfo: visualizationInfoParam,
        instanceDefinition: {
          mstrTable: {
            name: 'mstrTableNameDossierTest'
          }
        },
      });

    jest.spyOn(dossierInstanceDefinition, 'getVisualizationName').mockReturnValue('getVisualizationNameTest');

    jest.spyOn(mstrObjectRestService, 'createInstance').mockImplementation();

    jest.spyOn(stepGetInstanceDefinition, 'modifyInstanceWithPrompt')
      .mockReturnValue({
        mstrTable: {
          name: 'nameModifyInstanceWithPromptTest',
          rows: 'rowsModifyInstanceWithPromptTest',
          insertNewWorksheet: 'insertNewWorksheetTest',
          crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
          isCrosstab: 'isCrossTabTest',
          manipulationsXML: manipulationsXMLParam,
        },
        rows: 'rowsModifyInstanceWithPromptTest',
      });

    const expectedMstrTable = {
      name: 'nameModifyInstanceWithPromptTest',
      rows: 'rowsModifyInstanceWithPromptTest',
      insertNewWorksheet: 'insertNewWorksheetTest',
      crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
      isCrosstab: 'isCrossTabTest',
    };

    if (manipulationsXMLParam) {
      expectedMstrTable.manipulationsXML = manipulationsXMLParam;
    }

    jest.spyOn(stepGetInstanceDefinition, 'savePreviousObjectData').mockImplementation();

    jest.spyOn(stepGetInstanceDefinition, 'getStartCell').mockReturnValue('startCellTest');

    jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'completeGetInstanceDefinition').mockImplementation();

    // when
    await stepGetInstanceDefinition.getInstanceDefinition(objectData, {
      operationType: 'operationTypeTest',
      stepsQueue: ['step_0', nextStepParam],
    });

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);

    expect(stepGetInstanceDefinition.setupBodyTemplate).toBeCalledTimes(1);
    expect(stepGetInstanceDefinition.setupBodyTemplate).toBeCalledWith('bodyTest');

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
        name: mstrObjectEnum.mstrObjectType.visualization.name
      },
      body: 'bodyTest',
      visualizationInfo: 'visualizationInfoTest',
      name: 'nameTest',
    });

    expect(dossierInstanceDefinition.getVisualizationName).toBeCalledTimes(1);
    expect(dossierInstanceDefinition.getVisualizationName).toBeCalledWith(
      { operationType: 'operationTypeTest', stepsQueue: ['step_0', nextStepParam] },
      'nameTest',
      { mstrTable: { name: 'mstrTableNameDossierTest' } }
    );

    expect(mstrObjectRestService.createInstance).not.toBeCalled();

    expect(stepGetInstanceDefinition.modifyInstanceWithPrompt).toBeCalledTimes(1);
    expect(stepGetInstanceDefinition.modifyInstanceWithPrompt).toBeCalledWith({
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
        name: mstrObjectEnum.mstrObjectType.visualization.name
      },
      visualizationInfo: 'visualizationInfoTest',
      body: 'bodyTest',
      insertNewWorksheet: 'insertNewWorksheetTest',
      crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
      name: 'nameTest',
    });

    expect(stepGetInstanceDefinition.savePreviousObjectData).toBeCalledTimes(1);
    expect(stepGetInstanceDefinition.savePreviousObjectData).toBeCalledWith(
      {
        mstrTable: expectedMstrTable,
        rows: 'rowsModifyInstanceWithPromptTest',
      },
      'crosstabHeaderDimensionsTest',
      'subtotalsAddressesTest',
    );

    expect(stepGetInstanceDefinition.getStartCell).toBeCalledTimes(expectedGetStartCellCallsNo);
    if (expectedGetStartCellCallsNo === 1) {
      expect(stepGetInstanceDefinition.getStartCell).toBeCalledWith(
        'insertNewWorksheetTest',
        'excelContextTest',
      );
    }

    expect(officeApiHelper.getCurrentMstrContext).toBeCalledTimes(1);

    expect(operationStepDispatcher.updateOperation).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateOperation).toBeCalledWith({
      excelContext: 'excelContextTest',
      instanceDefinition: {
        mstrTable: expectedMstrTable,
        rows: 'rowsModifyInstanceWithPromptTest',
      },
      oldBindId: 'bindIdTest',
      objectWorkingId: 'objectWorkingIdTest',
      startCell: expectedStartCell,
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
      manipulationsXML: false,
    });

    expect(operationStepDispatcher.completeGetInstanceDefinition).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeGetInstanceDefinition).toBeCalledWith('objectWorkingIdTest');
  });

  it.each`
  expectedVisualizationInfo         | expectedStartCell  | expectedGetStartCellCallsNo | visualizationInfoParam            | nextStepParam

  ${false}                          | ${undefined}       | ${0}                        | ${undefined}                      | ${'not GET_OFFICE_TABLE_IMPORT'}
  ${false}                          | ${undefined}       | ${0}                        | ${false}                          | ${'not GET_OFFICE_TABLE_IMPORT'}
  ${'visualizationInfoDossierTest'} | ${undefined}       | ${0}                        | ${'visualizationInfoDossierTest'} | ${'not GET_OFFICE_TABLE_IMPORT'}

  ${false}                          | ${'startCellTest'} | ${1}                        | ${undefined}                      | ${GET_OFFICE_TABLE_IMPORT}
  ${false}                          | ${'startCellTest'} | ${1}                        | ${false}                          | ${GET_OFFICE_TABLE_IMPORT}
  ${'visualizationInfoDossierTest'} | ${'startCellTest'} | ${1}                        | ${'visualizationInfoDossierTest'} | ${GET_OFFICE_TABLE_IMPORT}

  `('getInstanceDefinition should work as expected for NO visualization',
  async ({
    expectedVisualizationInfo,
    expectedStartCell,
    expectedGetStartCellCallsNo,
    visualizationInfoParam,
    nextStepParam
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
        name: mstrObjectEnum.mstrObjectType.report.name
      },
      visualizationInfo: visualizationInfoParam,
      body: 'bodyTest',
    };

    jest.spyOn(officeApiHelper, 'getExcelContext').mockReturnValue('excelContextTest');

    jest.spyOn(officeApiHelper, 'getCurrentMstrContext')
      .mockReturnValue({
        envUrl: 'envUrlTest',
        username: 'usernameTest',
      });

    jest.spyOn(stepGetInstanceDefinition, 'setupBodyTemplate').mockImplementation();

    jest.spyOn(dossierInstanceDefinition, 'getDossierInstanceDefinition').mockImplementation();

    jest.spyOn(mstrObjectRestService, 'createInstance').mockReturnValue({
      body: 'bodyNoDossierTest',
      visualizationInfo: visualizationInfoParam,
      instanceDefinition: {
        mstrTable: {
          name: 'mstrTableNameNoDossierTest'
        }
      },
    });

    jest.spyOn(stepGetInstanceDefinition, 'modifyInstanceWithPrompt').mockReturnValue({
      mstrTable: {
        name: 'nameModifyInstanceWithPromptTest',
        rows: 'rowsModifyInstanceWithPromptTest',
        insertNewWorksheet: 'insertNewWorksheetTest',
        crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
        isCrosstab: 'isCrossTabTest',
      },
      rows: 'rowsModifyInstanceWithPromptTest',
    });

    jest.spyOn(stepGetInstanceDefinition, 'savePreviousObjectData').mockImplementation();

    jest.spyOn(stepGetInstanceDefinition, 'getStartCell').mockReturnValue('startCellTest');

    jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'completeGetInstanceDefinition').mockImplementation();

    // when
    await stepGetInstanceDefinition.getInstanceDefinition(objectData, {
      operationType: 'operationTypeTest',
      stepsQueue: ['step_0', nextStepParam],
    });

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);

    expect(stepGetInstanceDefinition.setupBodyTemplate).toBeCalledTimes(1);
    expect(stepGetInstanceDefinition.setupBodyTemplate).toBeCalledWith('bodyTest');

    expect(dossierInstanceDefinition.getDossierInstanceDefinition).not.toBeCalled();

    expect(mstrObjectRestService.createInstance).toBeCalledTimes(1);

    expect(stepGetInstanceDefinition.modifyInstanceWithPrompt).toBeCalledTimes(1);
    expect(stepGetInstanceDefinition.modifyInstanceWithPrompt).toBeCalledWith({
      bindId: 'bindIdTest',
      body: 'bodyTest',
      crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
      insertNewWorksheet: 'insertNewWorksheetTest',
      instanceDefinition: {
        body: 'bodyNoDossierTest',
        instanceDefinition: {
          mstrTable: {
            name: 'mstrTableNameNoDossierTest',
          },
        },
        visualizationInfo: visualizationInfoParam,
      },
      mstrObjectType: {
        name: 'report',
      },
      objectWorkingId: 'objectWorkingIdTest',
      subtotalsInfo: {
        subtotalsAddresses: 'subtotalsAddressesTest',
      },
      visualizationInfo: visualizationInfoParam,
    });

    expect(stepGetInstanceDefinition.savePreviousObjectData).toBeCalledTimes(1);
    expect(stepGetInstanceDefinition.savePreviousObjectData).toBeCalledWith(
      {
        mstrTable: {
          name: 'nameModifyInstanceWithPromptTest',
          rows: 'rowsModifyInstanceWithPromptTest',
          insertNewWorksheet: 'insertNewWorksheetTest',
          crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
          isCrosstab: 'isCrossTabTest',
        },
        rows: 'rowsModifyInstanceWithPromptTest',
      },
      'crosstabHeaderDimensionsTest',
      'subtotalsAddressesTest',
    );

    expect(stepGetInstanceDefinition.getStartCell).toBeCalledTimes(expectedGetStartCellCallsNo);
    if (expectedGetStartCellCallsNo === 1) {
      expect(stepGetInstanceDefinition.getStartCell).toBeCalledWith(
        'insertNewWorksheetTest',
        'excelContextTest',
      );
    }

    expect(officeApiHelper.getCurrentMstrContext).toBeCalledTimes(1);

    expect(operationStepDispatcher.updateOperation).toBeCalledTimes(1);
    expect(operationStepDispatcher.updateOperation).toBeCalledWith({
      excelContext: 'excelContextTest',
      instanceDefinition: {
        mstrTable: {
          name: 'nameModifyInstanceWithPromptTest',
          rows: 'rowsModifyInstanceWithPromptTest',
          insertNewWorksheet: 'insertNewWorksheetTest',
          crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
          isCrosstab: 'isCrossTabTest',
        },
        rows: 'rowsModifyInstanceWithPromptTest',
      },
      oldBindId: 'bindIdTest',
      objectWorkingId: 'objectWorkingIdTest',
      startCell: expectedStartCell,
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
      name: 'nameModifyInstanceWithPromptTest',
      objectWorkingId: 'objectWorkingIdTest',
      visualizationInfo: expectedVisualizationInfo,
      subtotalsInfo: {
        subtotalsAddresses: 'subtotalsAddressesTest',
      },
      manipulationsXML: false,
    });

    expect(operationStepDispatcher.completeGetInstanceDefinition).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeGetInstanceDefinition).toBeCalledWith('objectWorkingIdTest');
  });

  it.each`
  expectedBodyTemplate                 | expectedRequestedObjects             | body
  
  ${undefined}                         | ${undefined}                         | ${{}}
  ${undefined}                         | ${undefined}                         | ${{ sth: 'sth' }}
  ${undefined}                         | ${undefined}                         | ${{ requestedObjects: { attributes: [], metrics: [] } }}
  
  ${{ attributes: [1], metrics: [] }}  | ${{ attributes: [1], metrics: [] }}  | ${{ requestedObjects: { attributes: [1], metrics: [] } }}
  ${{ attributes: [], metrics: [1] }}  | ${{ attributes: [], metrics: [1] }}  | ${{ requestedObjects: { attributes: [], metrics: [1] } }}
  ${{ attributes: [1], metrics: [1] }} | ${{ attributes: [1], metrics: [1] }} | ${{ requestedObjects: { attributes: [1], metrics: [1] } }}
  
  `('setupBodyTemplate should work as expected',
  ({ expectedBodyTemplate, expectedRequestedObjects, body }) => {
    // when
    stepGetInstanceDefinition.setupBodyTemplate(body);

    // then
    expect(body.template).toEqual(expectedBodyTemplate);
    expect(body.requestedObjects).toEqual(expectedRequestedObjects);
  });

  it('modifyInstanceWithPrompt should work as expected - status not 2', async () => {
    // given
    const instanceDefinitionMock = { status: 1 };

    jest.spyOn(mstrObjectRestService, 'answerPrompts').mockImplementation();

    // when
    const result = await stepGetInstanceDefinition.modifyInstanceWithPrompt(
      { instanceDefinition: instanceDefinitionMock }
    );

    // then
    expect(mstrObjectRestService.answerPrompts).not.toBeCalled();

    expect(result).toEqual(instanceDefinitionMock);
  });

  it('modifyInstanceWithPrompt should work as expected - status 2, no prompt answers', async () => {
    // given
    const instanceDefinitionMock = { status: 2 };

    jest.spyOn(mstrObjectRestService, 'answerPrompts').mockImplementation();

    // when
    const result = await stepGetInstanceDefinition.modifyInstanceWithPrompt({
      instanceDefinition: instanceDefinitionMock,
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: [],
      dossierData: 'dossierDataTest',
      body: 'bodyTest',
      displayAttrFormNames: 'displayAttrFormNamesTest',
    });

    // then
    expect(mstrObjectRestService.answerPrompts).not.toBeCalled();

    expect(result).toEqual(instanceDefinitionMock);
  });

  it('modifyInstanceWithPrompt should work as expected - status 2, with 1 prompt answer', async () => {
    // given
    jest.spyOn(mstrObjectRestService, 'answerPrompts').mockImplementation();

    jest.spyOn(mstrObjectRestService, 'modifyInstance').mockReturnValue({
      status: 1,
      instanceId: 'instanceIdTest',
    });

    // when
    const result = await stepGetInstanceDefinition.modifyInstanceWithPrompt({
      instanceDefinition: {
        status: 2,
        instanceId: 'instanceIdTest',
      },
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: ['answer1'],
      dossierData: 'dossierDataTest',
      body: 'bodyTest',
      displayAttrFormNames: 'displayAttrFormNamesTest',
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
      displayAttrFormNames: 'displayAttrFormNamesTest',
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

    jest.spyOn(mstrObjectRestService, 'modifyInstance').mockReturnValue({
      status: 1,
      instanceId: 'instanceIdTest',
    });

    // when
    const result = await stepGetInstanceDefinition.modifyInstanceWithPrompt({
      instanceDefinition: {
        status: 2,
        instanceId: 'instanceIdTest',
      },
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: ['answer1', 'answer2'],
      dossierData: 'dossierDataTest',
      body: 'bodyTest',
      displayAttrFormNames: 'displayAttrFormNamesTest',
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
      displayAttrFormNames: 'displayAttrFormNamesTest',
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
  expectedPrevCrosstabDimensions | expectedCrosstabHeaderDimensions | callNo | isCrosstab | crosstabHeaderDimensions
  
  ${false} | ${'crosstabHeaderDimensionsTest'} | ${1} | ${true} | ${undefined}    
  ${false} | ${'crosstabHeaderDimensionsTest'} | ${1} | ${true} | ${false}      
  ${'crosstabHeaderDimensionsTest'} | ${'crosstabHeaderDimensionsTest'} | ${1} | ${true} | ${'crosstabHeaderDimensionsTest'}      

  ${false} | ${false} | ${0} | ${false} | ${undefined}    
  ${false} | ${false} | ${0} | ${false} | ${false}      
  ${'crosstabHeaderDimensionsTest'} | ${false} | ${0} | ${false} | ${'crosstabHeaderDimensionsTest'}      

  `('savePreviousObjectData should work as expected',
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
    };

    const instanceDefinition = { mstrTable: mstrTableMock };

    jest.spyOn(officeApiCrosstabHelper, 'getCrosstabHeaderDimensions')
      .mockReturnValue('crosstabHeaderDimensionsTest');

    // when
    stepGetInstanceDefinition.savePreviousObjectData(
      instanceDefinition,
      crosstabHeaderDimensions,
      'subtotalsAddressesTest',
    );

    // then
    expect(officeApiCrosstabHelper.getCrosstabHeaderDimensions).toBeCalledTimes(callNo);
    if (callNo === 1) {
      expect(officeApiCrosstabHelper.getCrosstabHeaderDimensions).toBeCalledWith(instanceDefinition);
    }

    expect(mstrTableMock.prevCrosstabDimensions).toEqual(expectedPrevCrosstabDimensions);
    expect(mstrTableMock.crosstabHeaderDimensions).toEqual(expectedCrosstabHeaderDimensions);
    expect(mstrTableMock.subtotalsInfo.subtotalsAddresses).toEqual('subtotalsAddressesTest');
  });

  it.each`
  expectedStartCell | createAndActivateNewWorksheetCallNo | insertNewWorksheet
  
  ${42}             | ${0}                                | ${false}
  ${42}             | ${1}                                | ${true}
  
  `('getStartCell should work as expected',
  async ({
    expectedStartCell,
    createAndActivateNewWorksheetCallNo,
    insertNewWorksheet,
  }) => {
    // given
    jest.spyOn(officeApiWorksheetHelper, 'createAndActivateNewWorksheet').mockImplementation();

    jest.spyOn(officeApiHelper, 'getSelectedCell').mockReturnValue(42);

    // when
    const result = await stepGetInstanceDefinition.getStartCell(
      insertNewWorksheet,
      'excelContextTest',
    );

    // then
    expect(result).toEqual(expectedStartCell);

    expect(officeApiWorksheetHelper.createAndActivateNewWorksheet).toBeCalledTimes(createAndActivateNewWorksheetCallNo);
    if (createAndActivateNewWorksheetCallNo === 1) {
      expect(officeApiWorksheetHelper.createAndActivateNewWorksheet).toBeCalledWith('excelContextTest');
    }

    expect(officeApiHelper.getSelectedCell).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedCell).toBeCalledWith('excelContextTest');
  });
});
