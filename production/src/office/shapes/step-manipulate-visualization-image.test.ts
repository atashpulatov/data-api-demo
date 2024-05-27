import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { officeApiHelper } from '../api/office-api-helper';
import { officeShapeApiHelper } from './office-shape-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { OperationTypes } from '../../operation/operation-type-names';
import stepManipulateVisualizationImage from './step-manipulate-visualization-image';

describe('stepManipulateVisualizationImage', () => {
  const objectDataMock = {
    objectId: 'objectIdTest',
    bindId: '1234-5678-9012-3456',
    projectId: 'projectIdTest',
    dossierData: 'dossierDataTest',
    mstrObjectType: 'mstrObjectTypeTest',
    body: 'bodyTest',
    preparedInstanceId: 'preparedInstanceIdTest',
    manipulationsXML: 'manipulationsXMLTest',
    promptsAnswers: 'promptsAnswersTest',
    name: 'Visualization1',
    visualizationInfo: {
      visualizationKey: 'visualizationKeyTest',
      vizDimensions: {
        width: 123,
        height: 342,
      },
    },
    objectWorkingId: 2137,
    importType: 'image',
  } as unknown as ObjectData;

  const mockFn = jest.fn();

  const mockShapeObject = {
    delete: mockFn,
    top: 233,
    left: 454,
    width: 123,
    height: 342,
  } as unknown as Excel.Shape;

  const mockSheet = {
    id: 'mockedSheetId',
    name: 'mockedSheetName',
    position: 0,
    shapes: {
      addImage: jest.fn().mockImplementation(_image =>
        Promise.resolve({
          set: mockFn,
          id: '1234-5678-9012-3456',
        })
      ),
    },
    load: mockFn,
  } as unknown as Excel.Worksheet;

  const excelContextMock = {
    workbook: {
      worksheets: {
        load: mockFn,
        items: [
          {
            shapes: {
              getItemOrNullObject: jest.fn().mockImplementation(_id => ({
                load: mockFn,
                delete: mockFn,
                isNullObject: false,
                id: '1234-5678-9012-3456',
              })),
            },
          },
        ],
        getActiveWorksheet: jest.fn().mockImplementation(() => mockSheet),
        getItem: jest.fn().mockImplementation(_id => mockSheet),
      },
      sync: mockFn,
    },
    sync: mockFn,
  } as unknown as Excel.RequestContext;

  const operationDataMock = {
    objectWorkingId: 2137,
    operationType: 'IMPORT_OPERATION',
    tableChanged: 'tableChangedTest',
    officeTable: 'officeTableTest',
    excelContext: excelContextMock,
    instanceDefinition: {
      columns: 42,
      rows: 'rowsTest',
      mstrTable: {},
    },
  } as unknown as OperationData;

  const mockedUpdateObject = {
    objectWorkingId: 2137,
    bindId: '1234-5678-9012-3456',
    shapeProps: undefined,
    worksheet: {
      id: 'mockedSheetId',
      name: 'mockedSheetName',
      index: 0,
    },
    groupData: {
      key: 'mockedSheetId',
      title: 'mockedSheetName',
      index: 0,
    },
  } as unknown as ObjectData;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('manipulateVisualizationImage should work for IMPORT_OPERATION', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(async () => excelContextMock);

    const mockImageRes = {
      arrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8))),
    };

    jest
      .spyOn(mstrObjectRestService, 'getVisualizationImage')
      .mockImplementation(async () => mockImageRes as any);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest
      .spyOn(officeApiHelper, 'getSelectedRangePosition')
      .mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest
      .spyOn(officeShapeApiHelper, 'addImage')
      .mockImplementation(() => Promise.resolve('1234-5678-9012-3456'));

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest
      .spyOn(operationStepDispatcher, 'completeManipulateVisualizationImage')
      .mockImplementation();

    // when
    await stepManipulateVisualizationImage.manipulateVisualizationImage(
      objectDataMock,
      operationDataMock
    );

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(officeShapeApiHelper.addImage).toBeCalledWith(
      excelContextMock,
      'AAAAAAAAAAA=',
      objectDataMock.name,
      { left: 454, top: 233 },
      { height: 342, width: 123 },
      mockSheet
    );
    expect(operationStepDispatcher.updateObject).toBeCalledWith(mockedUpdateObject);
    expect(operationStepDispatcher.completeManipulateVisualizationImage).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('manipulateVisualizationImage should work for REFRESH_OPERATION triggered by View Data', async () => {
    operationDataMock.operationType = OperationTypes.REFRESH_OPERATION;
    objectDataMock.shapeProps = {
      top: 123,
      left: 234,
      width: 345,
      height: 456,
      worksheetId: '1234-5678-9012-3456',
    };
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(async () => excelContextMock);

    const mockImageRes = {
      arrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8))),
    };

    jest
      .spyOn(mstrObjectRestService, 'getVisualizationImage')
      .mockImplementation(async () => mockImageRes as any);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest
      .spyOn(officeApiHelper, 'getSelectedRangePosition')
      .mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest
      .spyOn(officeShapeApiHelper, 'getShape')
      .mockImplementation(() => Promise.resolve(mockShapeObject));

    jest
      .spyOn(officeShapeApiHelper, 'addImage')
      .mockImplementation(() => Promise.resolve('1234-5678-9012-3456'));

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest
      .spyOn(operationStepDispatcher, 'completeManipulateVisualizationImage')
      .mockImplementation();

    // when
    await stepManipulateVisualizationImage.manipulateVisualizationImage(
      objectDataMock,
      operationDataMock
    );

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(officeShapeApiHelper.addImage).toBeCalledWith(
      excelContextMock,
      'AAAAAAAAAAA=',
      objectDataMock.name,
      { left: 234, top: 123 },
      { height: 456, width: 345 },
      mockSheet
    );
    expect(operationStepDispatcher.updateObject).toBeCalledWith(mockedUpdateObject);
    expect(operationStepDispatcher.completeManipulateVisualizationImage).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('manipulateVisualizationImage should work for REFRESH_OPERATION', async () => {
    const refreshOperationMock = {
      ...operationDataMock,
      operationType: OperationTypes.REFRESH_OPERATION,
    };

    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(async () => excelContextMock);

    const mockImageRes = {
      arrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8))),
    };

    jest
      .spyOn(mstrObjectRestService, 'getVisualizationImage')
      .mockImplementation(() => mockImageRes as any);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest
      .spyOn(officeApiHelper, 'getSelectedRangePosition')
      .mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest
      .spyOn(officeShapeApiHelper, 'addImage')
      .mockImplementation(() => Promise.resolve('1234-5678-9012-3456'));

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest
      .spyOn(operationStepDispatcher, 'completeManipulateVisualizationImage')
      .mockImplementation();

    // when
    await stepManipulateVisualizationImage.manipulateVisualizationImage(
      objectDataMock,
      refreshOperationMock
    );

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(officeShapeApiHelper.addImage).toBeCalledWith(
      excelContextMock,
      'AAAAAAAAAAA=',
      objectDataMock.name,
      { left: 234, top: 123 },
      { height: 456, width: 345 },
      mockSheet
    );
    expect(operationStepDispatcher.updateObject).toBeCalledWith(mockedUpdateObject);
    expect(operationStepDispatcher.completeManipulateVisualizationImage).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('manipulateVisualizationImage should work for EDIT_OPERATION', async () => {
    operationDataMock.operationType = OperationTypes.EDIT_OPERATION;
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(async () => excelContextMock);

    const mockImageRes = {
      arrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8))),
    };

    jest
      .spyOn(mstrObjectRestService, 'getVisualizationImage')
      .mockImplementation(() => mockImageRes as any);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest
      .spyOn(officeApiHelper, 'getSelectedRangePosition')
      .mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest
      .spyOn(officeShapeApiHelper, 'getShape')
      .mockImplementation(() => Promise.resolve(mockShapeObject));

    jest
      .spyOn(officeShapeApiHelper, 'addImage')
      .mockImplementation(() => Promise.resolve('1234-5678-9012-3456'));

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest
      .spyOn(operationStepDispatcher, 'completeManipulateVisualizationImage')
      .mockImplementation();

    // when
    await stepManipulateVisualizationImage.manipulateVisualizationImage(
      objectDataMock,
      operationDataMock
    );

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(officeShapeApiHelper.addImage).toBeCalledWith(
      excelContextMock,
      'AAAAAAAAAAA=',
      objectDataMock.name,
      { left: 454, top: 233 },
      { height: 342, width: 123 },
      mockSheet
    );
    expect(operationStepDispatcher.updateObject).toBeCalledWith(mockedUpdateObject);
    expect(operationStepDispatcher.completeManipulateVisualizationImage).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('manipulateVisualizationImage should work for DUPLICATE_OPERATION', async () => {
    const dupOperationDataMock = {
      ...operationDataMock,
      operationType: OperationTypes.DUPLICATE_OPERATION,
    };
    const dupObjectDataMock = {
      ...objectDataMock,
      bindIdToBeDuplicated: '1234-5678-9012-3456',
    };
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(async () => excelContextMock);

    const mockImageRes = {
      arrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8))),
    };

    jest
      .spyOn(mstrObjectRestService, 'getVisualizationImage')
      .mockImplementation(() => mockImageRes as any);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest
      .spyOn(officeApiHelper, 'getSelectedRangePosition')
      .mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest
      .spyOn(officeShapeApiHelper, 'getShape')
      .mockImplementation(() => Promise.resolve(mockShapeObject));

    jest
      .spyOn(officeShapeApiHelper, 'addImage')
      .mockImplementation(() => Promise.resolve('1234-5678-9012-3456'));

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest
      .spyOn(operationStepDispatcher, 'completeManipulateVisualizationImage')
      .mockImplementation();

    // when
    await stepManipulateVisualizationImage.manipulateVisualizationImage(
      dupObjectDataMock,
      dupOperationDataMock
    );

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);
    expect(officeShapeApiHelper.addImage).toBeCalledWith(
      excelContextMock,
      'AAAAAAAAAAA=',
      objectDataMock.name,
      { top: 233, left: 454 },
      { width: 123, height: 342 },
      mockSheet
    );
    expect(operationStepDispatcher.updateObject).toBeCalledWith(mockedUpdateObject);
    expect(operationStepDispatcher.completeManipulateVisualizationImage).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('refreshVisualization should handle an error', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(async () => excelContextMock);

    jest
      .spyOn(officeApiHelper, 'getSelectedRangePosition')
      .mockImplementation(() => Promise.resolve({ top: 233, left: 454 }));

    jest.spyOn(mstrObjectRestService, 'getVisualizationImage').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepManipulateVisualizationImage.manipulateVisualizationImage(
      objectDataMock,
      operationDataMock
    );

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(officeApiHelper.getSelectedRangePosition).toBeCalledTimes(1);
    expect(mstrObjectRestService.getVisualizationImage).toBeCalledTimes(1);

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith(
      objectDataMock,
      operationDataMock,
      new Error('errorTest')
    );

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));
  });
});
