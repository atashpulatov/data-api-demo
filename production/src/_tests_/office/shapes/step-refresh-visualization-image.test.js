import { officeShapeApiHelper } from '../../../office/shapes/office-shape-api-helper';
import stepRefreshVisualizationImage from '../../../office/shapes/step-refresh-visualization-image';
import { mstrObjectRestService } from '../../../mstr-object/mstr-object-rest-service';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import operationErrorHandler from '../../../operation/operation-error-handler';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';

describe('StepRefreshVisualizationImage', () => {
  const objectDataMock = {
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
    importType: 'image'
  };

  const mockFn = jest.fn();

  const excelContextMock = {
    workbook: {
      worksheets: [
        {
          load: mockFn,
          items: [
            {
              shapes: {
                getItemOrNullObject: jest.fn().mockImplementation((id) => ({
                  load: mockFn,
                  delete: mockFn,
                  isNullObject: false,
                  id: '1234-5678-9012-3456'
                }))
              }
            }
          ],
          getActiveWorksheet: jest.fn().mockImplementation(() => ({
            shapes: {
              addImage: jest.fn().mockImplementation((image) => Promise.resolve({
                set: mockFn,
                id: '1234-5678-9012-3456'
              }))
            }
          }))
        }
      ],
      sync: mockFn
    }
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

  it('refreshVisualizationImage should work as expected', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => excelContextMock);

    const mockImageRes = { arrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8))) };

    jest.spyOn(mstrObjectRestService, 'getVisualizationImage').mockImplementation(() => mockImageRes);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest.spyOn(officeApiHelper, 'getSelectedRangePosition').mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest.spyOn(officeShapeApiHelper, 'addImage').mockImplementation(() => Promise.resolve('1234-5678-9012-3456'));

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeRefreshVisualizationImage').mockImplementation();

    // when
    await stepRefreshVisualizationImage.refreshVisualizationImage(objectDataMock, operationDataMock);

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(officeShapeApiHelper.addImage).toBeCalledWith(excelContextMock, 'AAAAAAAAAAA=', 233, 454);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({ objectWorkingId: 'objectWorkingIdTest', bindId: '1234-5678-9012-3456', shapePosition: undefined });
    expect(operationStepDispatcher.completeRefreshVisualizationImage).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('refreshVisualization should handle an error', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => excelContextMock);

    jest.spyOn(mstrObjectRestService, 'getVisualizationImage').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepRefreshVisualizationImage.refreshVisualizationImage(objectDataMock, operationDataMock);

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith(objectDataMock, operationDataMock, new Error('errorTest'));

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));
  });
});
