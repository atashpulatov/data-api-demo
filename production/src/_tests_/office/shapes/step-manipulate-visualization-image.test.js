import { officeShapeApiHelper } from '../../../office/shapes/office-shape-api-helper';
import stepManipulateVisualizationImage from '../../../office/shapes/step-manipulate-visualization-image';
import { mstrObjectRestService } from '../../../mstr-object/mstr-object-rest-service';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import operationErrorHandler from '../../../operation/operation-error-handler';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';

describe('stepManipulateVisualizationImage', () => {
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
    objectWorkingId: 'objectWorkingIdTest',
    importType: 'image'
  };

  const mockFn = jest.fn();

  const mockAddImage = jest.fn().mockImplementation((image) => Promise.resolve({
    set: jest.fn(),
    id: '1234-5678-9012-3456'
  }));

  const mockSheet = {
    shapes: {
      addImage: jest.fn().mockImplementation((image) => Promise.resolve({
        set: mockFn,
        id: '1234-5678-9012-3456'
      }))
    }
  };

  const excelContextMock = {
    workbook: {
      worksheets: {
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
        getActiveWorksheet: jest.fn().mockImplementation(() => mockSheet),
        getItem: jest.fn().mockImplementation((id) => mockSheet)
      },
      sync: mockFn
    }
  };

  const operationDataMock = {
    objectWorkingId: 'objectWorkingIdTest',
    operationType: 'IMPORT_OPERATION',
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

  it('manipulateVisualizationImage should work for IMPORT_OPERATION', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => excelContextMock);

    const mockImageRes = { arrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8))) };

    jest.spyOn(mstrObjectRestService, 'getVisualizationImage').mockImplementation(() => mockImageRes);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest.spyOn(officeApiHelper, 'getSelectedRangePosition').mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest.spyOn(officeShapeApiHelper, 'addImage').mockImplementation(() => Promise.resolve('1234-5678-9012-3456'));

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeManipulateVisualizationImage').mockImplementation();

    // when
    await stepManipulateVisualizationImage.manipulateVisualizationImage(objectDataMock, operationDataMock);

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(officeShapeApiHelper.addImage).toBeCalledWith(excelContextMock, 'AAAAAAAAAAA=', 233, 454, mockSheet);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({ objectWorkingId: 'objectWorkingIdTest', bindId: '1234-5678-9012-3456', shapeProps: undefined });
    expect(operationStepDispatcher.completeManipulateVisualizationImage).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('manipulateVisualizationImage should work for REFRESH_OPERATION triggered by View Data', async () => {
    operationDataMock.operationType = 'REFRESH_OPERATION';
    objectDataMock.shapeProps = {
      top: 123,
      left: 234,
      width: 345,
      height: 456,
      worksheetId: '1234-5678-9012-3456'
    };
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => excelContextMock);

    const mockImageRes = { arrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8))) };

    jest.spyOn(mstrObjectRestService, 'getVisualizationImage').mockImplementation(() => mockImageRes);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest.spyOn(officeApiHelper, 'getSelectedRangePosition').mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest.spyOn(officeShapeApiHelper, 'addImage').mockImplementation(() => Promise.resolve('1234-5678-9012-3456'));

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeManipulateVisualizationImage').mockImplementation();

    // when
    await stepManipulateVisualizationImage.manipulateVisualizationImage(objectDataMock, operationDataMock);

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(officeShapeApiHelper.addImage).toBeCalledWith(excelContextMock, 'AAAAAAAAAAA=', 123, 234, mockSheet);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({ objectWorkingId: 'objectWorkingIdTest', bindId: '1234-5678-9012-3456', shapeProps: undefined });
    expect(operationStepDispatcher.completeManipulateVisualizationImage).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('manipulateVisualizationImage should work for REFRESH_OPERATION', async () => {
    const refreshOperationMock = { ...operationDataMock, operationType: 'REFRESH_OPERATION' };

    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => excelContextMock);

    const mockImageRes = { arrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8))) };

    jest.spyOn(mstrObjectRestService, 'getVisualizationImage').mockImplementation(() => mockImageRes);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest.spyOn(officeApiHelper, 'getSelectedRangePosition').mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest.spyOn(officeShapeApiHelper, 'addImage').mockImplementation(() => Promise.resolve('1234-5678-9012-3456'));

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeManipulateVisualizationImage').mockImplementation();

    // when
    await stepManipulateVisualizationImage.manipulateVisualizationImage(objectDataMock, refreshOperationMock);

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(officeShapeApiHelper.addImage).toBeCalledWith(excelContextMock, 'AAAAAAAAAAA=', 123, 234, mockSheet);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({ objectWorkingId: 'objectWorkingIdTest', bindId: '1234-5678-9012-3456', shapeProps: undefined });
    expect(operationStepDispatcher.completeManipulateVisualizationImage).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('manipulateVisualizationImage should work for EDIT_OPERATION', async () => {
    operationDataMock.operationType = 'EDIT_OPERATION';
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => excelContextMock);

    const mockImageRes = { arrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8))) };

    jest.spyOn(mstrObjectRestService, 'getVisualizationImage').mockImplementation(() => mockImageRes);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest.spyOn(officeApiHelper, 'getSelectedRangePosition').mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest.spyOn(officeShapeApiHelper, 'addImage').mockImplementation(() => Promise.resolve('1234-5678-9012-3456'));

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeManipulateVisualizationImage').mockImplementation();

    // when
    await stepManipulateVisualizationImage.manipulateVisualizationImage(objectDataMock, operationDataMock);

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(officeShapeApiHelper.addImage).toBeCalledWith(excelContextMock, 'AAAAAAAAAAA=', 233, 454, mockSheet);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({ objectWorkingId: 'objectWorkingIdTest', bindId: '1234-5678-9012-3456', shapeProps: undefined });
    expect(operationStepDispatcher.completeManipulateVisualizationImage).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('manipulateVisualizationImage should work for DUPLICATE_OPERATION', async () => {
    const dupOperationDataMock = { ...operationDataMock, operationType: 'DUPLICATE_OPERATION' };
    const dupObjectDataMock = { ...objectDataMock, bindIdToBeDuplicated: '1234-5678-9012-3456' };
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => excelContextMock);

    const mockImageRes = { arrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8))) };

    jest.spyOn(mstrObjectRestService, 'getVisualizationImage').mockImplementation(() => mockImageRes);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest.spyOn(officeApiHelper, 'getSelectedRangePosition').mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest.spyOn(officeShapeApiHelper, 'addImage').mockImplementation(() => Promise.resolve('1234-5678-9012-3456'));

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(stepManipulateVisualizationImage, 'getDuplicatedShapeDimensions').mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest.spyOn(operationStepDispatcher, 'completeManipulateVisualizationImage').mockImplementation();

    // when
    await stepManipulateVisualizationImage.manipulateVisualizationImage(dupObjectDataMock, dupOperationDataMock);

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(stepManipulateVisualizationImage.getDuplicatedShapeDimensions).toBeCalledWith('1234-5678-9012-3456', excelContextMock);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);
    expect(officeShapeApiHelper.addImage).toBeCalledWith(excelContextMock, 'AAAAAAAAAAA=', 233, 454, mockSheet);
    expect(operationStepDispatcher.updateObject).toBeCalledWith({ objectWorkingId: 'objectWorkingIdTest', bindId: '1234-5678-9012-3456', shapeProps: undefined });
    expect(operationStepDispatcher.completeManipulateVisualizationImage).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('refreshVisualization should handle an error', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => excelContextMock);

    jest.spyOn(officeApiHelper, 'getSelectedRangePosition').mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest.spyOn(stepManipulateVisualizationImage, 'getDuplicatedShapeDimensions').mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest.spyOn(mstrObjectRestService, 'getVisualizationImage').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepManipulateVisualizationImage.manipulateVisualizationImage(objectDataMock, operationDataMock);

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith(objectDataMock, operationDataMock, new Error('errorTest'));

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));
  });

  describe('getDuplicatedShapeDimensions', () => {
    it('should work as expected', async () => {
      // given
      const mockShape = {
        height: 123,
        width: 234
      };
      jest.spyOn(officeShapeApiHelper, 'getShape').mockImplementation(() => Promise.resolve(mockShape));

      // when
      const result = await stepManipulateVisualizationImage.getDuplicatedShapeDimensions('1234-5678-9012-3456', excelContextMock);

      // then
      expect(officeShapeApiHelper.getShape).toBeCalledWith(excelContextMock, '1234-5678-9012-3456');
      expect(result).toEqual({ height: 123, width: 234 });
    });
  });
});
