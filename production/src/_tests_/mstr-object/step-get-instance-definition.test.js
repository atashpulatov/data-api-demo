/* eslint-disable object-curly-newline */
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { officeApiHelper } from '../../office/api/office-api-helper';
import stepGetInstanceDefinition from '../../mstr-object/step-get-instance-definition';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import dossierInstanceDefinition from '../../mstr-object/dossier-instance-definition';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { officeApiCrosstabHelper } from '../../office/api/office-api-crosstab-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import { GET_OFFICE_TABLE_IMPORT } from '../../operation/operation-steps';

describe('StepGetInstanceDefinition', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('applyFormatting should log exceptions', async () => {
    // given
    console.error = jest.fn();

    const answerPromptsMock = jest.spyOn(mstrObjectRestService, 'answerPrompts')
      .mockImplementation(() => {
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
    expect(answerPromptsMock).toBeCalledTimes(1);
    expect(answerPromptsMock).toThrowError(Error);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));
  });

  it.each`
  expectedVisualizationInfo         | visualizationInfoParam

  ${false}                          | ${undefined}
  ${false}                          | ${false}
  ${'visualizationInfoDossierTest'} | ${'visualizationInfoDossierTest'}

  `('getInstanceDefinition should work as expected for visualization',
  async ({ expectedVisualizationInfo, visualizationInfoParam }) => {
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
        name: mstrObjectEnum.mstrObjectType.visualization.name
      },
      visualizationInfo: 'visualizationInfoTest',
      body: 'bodyTest',
    };

    const getExcelContextMock = jest.spyOn(officeApiHelper, 'getExcelContext').mockReturnValue('excelContextTest');

    const getCurrentMstrContextMock = jest.spyOn(officeApiHelper, 'getCurrentMstrContext')
      .mockReturnValue({
        envUrl: 'envUrlTest',
        username: 'usernameTest',
      });

    const setupBodyTemplateMock = jest.spyOn(stepGetInstanceDefinition, 'setupBodyTemplate').mockImplementation();

    const getDossierInstanceDefinitionMock = jest.spyOn(dossierInstanceDefinition, 'getDossierInstanceDefinition')
      .mockReturnValue({
        body: 'bodyDossierTest',
        visualizationInfo: visualizationInfoParam,
        instanceDefinition: {
          mstrTable: {
            name: 'mstrTableNameDossierTest'
          }
        },
      });

    const createInstanceMock = jest.spyOn(mstrObjectRestService, 'createInstance').mockImplementation();

    const modifyInstanceWithPromptMock = jest.spyOn(stepGetInstanceDefinition, 'modifyInstanceWithPrompt')
      .mockReturnValue({
        mstrTable: {
          name: 'nameModifyInstanceWithPromptTest',
          rows: 'rowsModifyInstanceWithPromptTest',
          insertNewWorksheet: 'insertNewWorksheetTest',
          crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
          isCrosstab: 'isCrossTabTest',
        },
        rows: 'rowsModifyInstanceWithPromptTest',
      });

    const savePreviousObjectDataMock = jest.spyOn(stepGetInstanceDefinition, 'savePreviousObjectData')
      .mockImplementation();

    const getStartCellMock = jest.spyOn(stepGetInstanceDefinition, 'getStartCell').mockReturnValue('startCellTest');

    const updateOperationMock = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const updateObjectMock = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const completeGetInstanceDefinitionMock = jest.spyOn(
      operationStepDispatcher, 'completeGetInstanceDefinition'
    ).mockImplementation();

    // when
    await stepGetInstanceDefinition.getInstanceDefinition(objectData, {
      operationType: 'operationTypeTest',
      stepsQueue: ['step_0', GET_OFFICE_TABLE_IMPORT],
    });

    // then
    expect(getExcelContextMock).toBeCalledTimes(1);

    expect(setupBodyTemplateMock).toBeCalledTimes(1);
    expect(setupBodyTemplateMock).toBeCalledWith('bodyTest');

    expect(getDossierInstanceDefinitionMock).toBeCalledTimes(1);
    expect(getDossierInstanceDefinitionMock).toBeCalledWith({
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
    });

    expect(createInstanceMock).not.toBeCalled();

    expect(modifyInstanceWithPromptMock).toBeCalledTimes(1);
    expect(modifyInstanceWithPromptMock).toBeCalledWith({
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
    });

    expect(savePreviousObjectDataMock).toBeCalledTimes(1);
    expect(savePreviousObjectDataMock).toBeCalledWith(
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

    expect(getStartCellMock).toBeCalledTimes(1);
    expect(getStartCellMock).toBeCalledWith(
      'insertNewWorksheetTest',
      'excelContextTest',
    );

    expect(getCurrentMstrContextMock).toBeCalledTimes(1);

    expect(updateOperationMock).toBeCalledTimes(1);
    expect(updateOperationMock).toBeCalledWith({
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
      objectWorkingId: 'objectWorkingIdTest',
      startCell: 'startCellTest',
      totalRows: 'rowsModifyInstanceWithPromptTest',
    });

    expect(updateObjectMock).toBeCalledTimes(1);
    expect(updateObjectMock).toBeCalledWith({
      body: 'bodyDossierTest',
      crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
      envUrl: {
        envUrl: 'envUrlTest',
        username: 'usernameTest',
      },
      isCrosstab: 'isCrossTabTest',
      name: 'nameModifyInstanceWithPromptTest',
      objectWorkingId: 'objectWorkingIdTest',
      oldBindId: 'bindIdTest',
      visualizationInfo: expectedVisualizationInfo,
    });

    expect(completeGetInstanceDefinitionMock).toBeCalledTimes(1);
    expect(completeGetInstanceDefinitionMock).toBeCalledWith('objectWorkingIdTest');
  });

  it.each`
  expectedVisualizationInfo           | visualizationInfoParam

  ${false}                            | ${undefined}
  ${false}                            | ${false}
  ${'visualizationInfoNoDossierTest'} | ${'visualizationInfoNoDossierTest'}

  `('getInstanceDefinition should work as expected for NO visualization',
  async ({ expectedVisualizationInfo, visualizationInfoParam }) => {
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

    const getExcelContextMock = jest.spyOn(officeApiHelper, 'getExcelContext').mockReturnValue('excelContextTest');

    const getCurrentMstrContextMock = jest.spyOn(officeApiHelper, 'getCurrentMstrContext')
      .mockReturnValue({
        envUrl: 'envUrlTest',
        username: 'usernameTest',
      });

    const setupBodyTemplateMock = jest.spyOn(stepGetInstanceDefinition, 'setupBodyTemplate').mockImplementation();

    const getDossierInstanceDefinitionMock = jest.spyOn(dossierInstanceDefinition, 'getDossierInstanceDefinition')
      .mockImplementation();

    const createInstanceMock = jest.spyOn(mstrObjectRestService, 'createInstance').mockReturnValue({
      body: 'bodyNoDossierTest',
      visualizationInfo: visualizationInfoParam,
      instanceDefinition: {
        mstrTable: {
          name: 'mstrTableNameNoDossierTest'
        }
      },
    });

    const modifyInstanceWithPromptMock = jest.spyOn(stepGetInstanceDefinition, 'modifyInstanceWithPrompt')
      .mockReturnValue({
        mstrTable: {
          name: 'nameModifyInstanceWithPromptTest',
          rows: 'rowsModifyInstanceWithPromptTest',
          insertNewWorksheet: 'insertNewWorksheetTest',
          crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
          isCrosstab: 'isCrossTabTest',
        },
        rows: 'rowsModifyInstanceWithPromptTest',
      });

    const savePreviousObjectDataMock = jest.spyOn(stepGetInstanceDefinition, 'savePreviousObjectData')
      .mockImplementation();

    const getStartCellMock = jest.spyOn(stepGetInstanceDefinition, 'getStartCell').mockReturnValue('startCellTest');

    const updateOperationMock = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();

    const updateObjectMock = jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    const completeGetInstanceDefinitionMock = jest.spyOn(
      operationStepDispatcher, 'completeGetInstanceDefinition'
    ).mockImplementation();

    // when
    await stepGetInstanceDefinition.getInstanceDefinition(objectData, {
      operationType: 'operationTypeTest',
      stepsQueue: ['step_0', GET_OFFICE_TABLE_IMPORT],
    });

    // then
    expect(getExcelContextMock).toBeCalledTimes(1);

    expect(setupBodyTemplateMock).toBeCalledTimes(1);
    expect(setupBodyTemplateMock).toBeCalledWith('bodyTest');

    expect(getDossierInstanceDefinitionMock).not.toBeCalled();

    expect(createInstanceMock).toBeCalledTimes(1);

    expect(modifyInstanceWithPromptMock).toBeCalledTimes(1);
    expect(modifyInstanceWithPromptMock).toBeCalledWith({
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

    expect(savePreviousObjectDataMock).toBeCalledTimes(1);
    expect(savePreviousObjectDataMock).toBeCalledWith(
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

    expect(getStartCellMock).toBeCalledTimes(1);
    expect(getStartCellMock).toBeCalledWith(
      'insertNewWorksheetTest',
      'excelContextTest',
    );

    expect(getCurrentMstrContextMock).toBeCalledTimes(1);

    expect(updateOperationMock).toBeCalledTimes(1);
    expect(updateOperationMock).toBeCalledWith({
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
      objectWorkingId: 'objectWorkingIdTest',
      startCell: 'startCellTest',
      totalRows: 'rowsModifyInstanceWithPromptTest',
    });

    expect(updateObjectMock).toBeCalledTimes(1);
    expect(updateObjectMock).toBeCalledWith({
      body: 'bodyTest',
      crosstabHeaderDimensions: 'crosstabHeaderDimensionsTest',
      envUrl: {
        envUrl: 'envUrlTest',
        username: 'usernameTest',
      },
      isCrosstab: 'isCrossTabTest',
      name: 'nameModifyInstanceWithPromptTest',
      objectWorkingId: 'objectWorkingIdTest',
      oldBindId: 'bindIdTest',
      visualizationInfo: expectedVisualizationInfo,
    });

    expect(completeGetInstanceDefinitionMock).toBeCalledTimes(1);
    expect(completeGetInstanceDefinitionMock).toBeCalledWith('objectWorkingIdTest');
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

    const answerPromptsMock = jest.spyOn(mstrObjectRestService, 'answerPrompts').mockImplementation();

    // when
    const result = await stepGetInstanceDefinition.modifyInstanceWithPrompt(
      { instanceDefinition: instanceDefinitionMock }
    );

    // then
    expect(answerPromptsMock).not.toBeCalled();

    expect(result).toEqual(instanceDefinitionMock);
  });

  it('modifyInstanceWithPrompt should work as expected - status 2, no prompt answers', async () => {
    // given
    const instanceDefinitionMock = { status: 2 };

    const answerPromptsMock = jest.spyOn(mstrObjectRestService, 'answerPrompts').mockImplementation();

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
    expect(answerPromptsMock).not.toBeCalled();

    expect(result).toEqual(instanceDefinitionMock);
  });

  it('modifyInstanceWithPrompt should work as expected - status 2, with 1 prompt answer', async () => {
    // given
    const answerPromptsMock = jest.spyOn(mstrObjectRestService, 'answerPrompts').mockImplementation();

    const modifyInstanceMock = jest.spyOn(mstrObjectRestService, 'modifyInstance').mockReturnValue({
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
    expect(answerPromptsMock).toBeCalledTimes(1);
    expect(answerPromptsMock).toBeCalledWith({
      instanceId: 'instanceIdTest',
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: 'answer1',
    });

    expect(modifyInstanceMock).toBeCalledTimes(1);
    expect(modifyInstanceMock).toHaveBeenNthCalledWith(1, {
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
    const answerPromptsMock = jest.spyOn(mstrObjectRestService, 'answerPrompts').mockImplementation();

    const modifyInstanceMock = jest.spyOn(mstrObjectRestService, 'modifyInstance').mockReturnValue({
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
    expect(answerPromptsMock).toBeCalledTimes(2);
    expect(answerPromptsMock).toHaveBeenNthCalledWith(1, {
      instanceId: 'instanceIdTest',
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: 'answer1',
    });
    expect(answerPromptsMock).toHaveBeenNthCalledWith(2, {
      instanceId: 'instanceIdTest',
      objectId: 'objectIdTest',
      projectId: 'projectIdTest',
      promptsAnswers: 'answer2',
    });

    expect(modifyInstanceMock).toBeCalledTimes(1);
    expect(modifyInstanceMock).toHaveBeenNthCalledWith(1, {
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

    const getCrosstabHeaderDimensionsMock = jest.spyOn(officeApiCrosstabHelper, 'getCrosstabHeaderDimensions')
      .mockReturnValue('crosstabHeaderDimensionsTest');

    // when
    stepGetInstanceDefinition.savePreviousObjectData(
      instanceDefinition,
      crosstabHeaderDimensions,
      'subtotalsAddressesTest',
    );

    // then
    expect(getCrosstabHeaderDimensionsMock).toBeCalledTimes(callNo);
    if (callNo === 1) {
      expect(getCrosstabHeaderDimensionsMock).toBeCalledWith(instanceDefinition);
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
    const createAndActivateNewWorksheetMock = jest.spyOn(officeApiWorksheetHelper, 'createAndActivateNewWorksheet')
      .mockImplementation();

    const getSelectedCellMock = jest.spyOn(officeApiHelper, 'getSelectedCell').mockReturnValue(42);

    // when
    const result = await stepGetInstanceDefinition.getStartCell(
      insertNewWorksheet,
      'excelContextTest',
    );

    // then
    expect(result).toEqual(expectedStartCell);

    expect(createAndActivateNewWorksheetMock).toBeCalledTimes(createAndActivateNewWorksheetCallNo);
    if (createAndActivateNewWorksheetCallNo === 1) {
      expect(createAndActivateNewWorksheetMock).toBeCalledWith('excelContextTest');
    }

    expect(getSelectedCellMock).toBeCalledTimes(1);
    expect(getSelectedCellMock).toBeCalledWith('excelContextTest');
  });
});
