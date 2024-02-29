import stepAddVisualizationPlaceholder from '../../../office/shapes/step-add-visualization-placeholder';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import operationErrorHandler from '../../../operation/operation-error-handler';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';

describe('StepRemoveVisualizationImage', () => {
  const objectDataMock = {
    shapeProps: {
      left: 350,
      top: 45,
      height: 480,
      width: 960,
      worksheetId: 'worksheetIdTest'
    },
    objectId: 'objectIdTest',
    projectId: 'projectIdTest',
    dossierData: 'dossierDataTest',
    mstrObjectType: 'mstrObjectTypeTest',
    body: 'bodyTest',
    preparedInstanceId: 'preparedInstanceIdTest',
    manipulationsXML: 'manipulationsXMLTest',
    promptsAnswers: 'promptsAnswersTest',
    visualizationInfo: {
      visualizationKey: 'visualizationKeyTest',
      vizDimensions: {
        width: 123,
        height: 342
      }
    },
    displayAttrFormNames: 'displayAttrFormNamesTest',
    objectWorkingId: 'objectWorkingIdTest',
    importType: 'image',
    bindId: '{1234-5678-9012-3456}'
  };

  const mockFn = jest.fn();

  const error = new Error('error');

  const excelContextMock = {
    workbook: {
      worksheets: {
        getItem: jest.fn().mockImplementation((worksheetId) => ({
          shapes: {
            addGeometricShape: jest.fn().mockImplementation((geometricShapeType) => { throw error; })
          },
        })),
      }
    },
    sync: mockFn,
  };

  const operationDataMock = {
    objectWorkingId: 'objectWorkingIdTest',
    operationType: 'operationTypeTest',
    tableChanged: 'tableChangedTest',
    officeTable: 'officeTableTest',
    excelContext: excelContextMock,
    instanceDefinition: {
      columns: 42,
      rows: 'rowsTest',
      mstrTable: {},
    },
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('removeVisualizationImage should work as expected1', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => excelContextMock);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeRemoveVisualizationImage').mockImplementation();

    // when
    await stepAddVisualizationPlaceholder.addVisualizationPlaceholder(objectDataMock, operationDataMock);

    // then
    expect(officeApiHelper.getExcelContext).toHaveBeenCalledTimes(1);
    expect(operationStepDispatcher.completeRemoveVisualizationImage).toHaveBeenCalledTimes(0);
    expect(operationStepDispatcher.updateObject).toHaveBeenCalledTimes(0);
    expect(operationErrorHandler.handleOperationError).toHaveBeenCalledTimes(1);
  });
});
