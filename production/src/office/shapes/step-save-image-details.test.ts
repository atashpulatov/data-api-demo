import { officeApiHelper } from '../api/office-api-helper';
import { officeShapeApiHelper } from './office-shape-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepSaveImageDetails from './step-save-image-details';

describe('StepSaveImageDetails', () => {
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
        height: 342,
      },
    },
    displayAttrFormNames: 'displayAttrFormNamesTest',
    objectWorkingId: 2137,
    importType: 'image',
    bindId: '{1234-5678-9012-3456}',
  } as unknown as ObjectData;

  const mockFn = jest.fn();

  const mockShape = {
    load: mockFn,
    delete: mockFn,
    isNullObject: false,
    id: '{1234-5678-9012-3456}',
    top: 123,
    left: 234,
    width: 345,
    height: 456,
  } as unknown as Excel.Shape;

  const excelContextMock = {
    workbook: {
      worksheets: [
        {
          load: mockFn,
          items: [
            {
              shapes: {
                getItemOrNullObject: jest.fn().mockImplementation(_id => mockShape),
              },
            },
          ],
          getActiveWorksheet: jest.fn().mockImplementation(() => ({
            shapes: {
              addImage: jest.fn().mockImplementation(_image =>
                Promise.resolve({
                  set: mockFn,
                  id: '{1234-5678-9012-3456}',
                })
              ),
            },
          })),
        },
      ],
      sync: mockFn,
    },
  } as unknown as Excel.RequestContext;

  const operationDataMock = {
    objectWorkingId: 2137,
    operationType: 'operationTypeTest',
    tableChanged: 'tableChangedTest',
    officeTable: 'officeTableTest',
    instanceDefinition: {
      columns: 42,
      rows: 'rowsTest',
      mstrTable: {},
    },
  } as unknown as OperationData;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('saveImageDetails should work as expected', async () => {
    // given
    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    jest
      .spyOn(officeShapeApiHelper, 'getShape')
      .mockImplementation(() => Promise.resolve(mockShape));
    jest
      .spyOn(officeApiHelper, 'getExcelContext')
      .mockImplementation(() => Promise.resolve(excelContextMock));
    jest.spyOn(operationStepDispatcher, 'completeSaveImageDetails').mockImplementation();

    // when
    await stepSaveImageDetails.saveImageDetails(objectDataMock, operationDataMock);

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(officeShapeApiHelper.getShape).toBeCalledWith(excelContextMock, '{1234-5678-9012-3456}');
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      objectWorkingId: 2137,
      shapeProps: {
        top: 123,
        left: 234,
        width: 345,
        height: 456,
      },
    });
    expect(operationStepDispatcher.completeSaveImageDetails).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('saveImageDetails should throw error', async () => {
    // given
    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    jest.spyOn(officeShapeApiHelper, 'getShape').mockImplementation(() => {
      throw new Error('errorTest');
    });
    jest
      .spyOn(officeApiHelper, 'getExcelContext')
      .mockImplementation(() => Promise.resolve(excelContextMock));
    jest.spyOn(operationStepDispatcher, 'completeSaveImageDetails').mockImplementation();

    // when
    await stepSaveImageDetails.saveImageDetails(objectDataMock, operationDataMock);

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(officeShapeApiHelper.getShape).toBeCalledWith(excelContextMock, '{1234-5678-9012-3456}');
    expect(operationStepDispatcher.updateObject).toBeCalledTimes(0);
    expect(operationStepDispatcher.completeSaveImageDetails).toBeCalledTimes(0);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
  });

  it('saveImageDetails should throw VISUALIZATION_REMOVED_FROM_EXCEL error', async () => {
    // given
    jest
      .spyOn(officeApiHelper, 'getExcelContext')
      .mockImplementation(() => Promise.resolve(excelContextMock));
    jest.spyOn(officeShapeApiHelper, 'getShape').mockImplementation(() => undefined);
    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepSaveImageDetails.saveImageDetails(objectDataMock, operationDataMock);

    // then
    expect(operationErrorHandler.handleOperationError).toHaveBeenCalled();
  });
});
