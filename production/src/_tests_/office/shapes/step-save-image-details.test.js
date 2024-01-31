import { officeShapeApiHelper } from '../../../office/shapes/office-shape-api-helper';
import stepSaveImageDetails from '../../../office/shapes/step-save-image-details';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import operationErrorHandler from '../../../operation/operation-error-handler';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';

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
        height: 342
      }
    },
    displayAttrFormNames: 'displayAttrFormNamesTest',
    objectWorkingId: 'objectWorkingIdTest',
    importType: 'image',
    bindId: '{1234-5678-9012-3456}'
  };

  const mockFn = jest.fn();

  const mockShape = {
    load: mockFn,
    delete: mockFn,
    isNullObject: false,
    id: '{1234-5678-9012-3456}',
    top: 123,
    left: 234,
    width: 345,
    height: 456
  };

  const excelContextMock = {
    workbook: {
      worksheets: [
        {
          load: mockFn,
          items: [
            {
              shapes: {
                getItemOrNullObject: jest.fn().mockImplementation((id) => mockShape)
              }
            }
          ],
          getActiveWorksheet: jest.fn().mockImplementation(() => ({
            shapes: {
              addImage: jest.fn().mockImplementation((image) => Promise.resolve({
                set: mockFn,
                id: '{1234-5678-9012-3456}'
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
    instanceDefinition: {
      columns: 42,
      rows: 'rowsTest',
      mstrTable: {},
    },
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('saveImageDetails should work as expected', async () => {
    // given
    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    jest.spyOn(officeShapeApiHelper, 'getShape').mockImplementation(() => Promise.resolve(mockShape));
    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => Promise.resolve(excelContextMock));
    jest.spyOn(operationStepDispatcher, 'completeSaveImageDetails').mockImplementation();

    // when
    await stepSaveImageDetails.saveImageDetails(objectDataMock, operationDataMock);

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(officeShapeApiHelper.getShape).toBeCalledWith(excelContextMock, '{1234-5678-9012-3456}');
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      objectWorkingId: 'objectWorkingIdTest',
      shapeProps: {
        top: 123,
        left: 234,
        width: 345,
        height: 456
      }
    });
    expect(operationStepDispatcher.completeSaveImageDetails).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });

  it('saveImageDetails should throw error', async () => {
    // given
    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();
    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();
    jest.spyOn(officeShapeApiHelper, 'getShape').mockImplementation(() => { throw new Error('errorTest'); });
    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => Promise.resolve(excelContextMock));
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
});
