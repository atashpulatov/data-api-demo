import { officeShapeApiHelper } from '../../../office/shapes/office-shape-api-helper';
import stepRemoveVisualizationImage from '../../../office/shapes/step-remove-visualization-image';
import { officeApiHelper } from '../../../office/api/office-api-helper';
import operationErrorHandler from '../../../operation/operation-error-handler';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import officeStoreObject from '../../../office/store/office-store-object';

describe('StepRemoveVisualizationImage', () => {
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
                  id: '{1234-5678-9012-3456}'
                }))
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

  it('removeVisualizationImage should work as expected', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => excelContextMock);

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    jest.spyOn(officeShapeApiHelper, 'deleteImage').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'updateObject').mockImplementation();

    jest.spyOn(officeStoreObject, 'removeObjectInExcelStore').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeRemoveVisualizationImage').mockImplementation();

    // when
    await stepRemoveVisualizationImage.removeVisualizationImage(objectDataMock, operationDataMock);

    // then
    expect(officeApiHelper.getExcelContext).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeRemoveVisualizationImage).toBeCalledTimes(1);
    expect(officeShapeApiHelper.deleteImage).toBeCalledWith(excelContextMock, '{1234-5678-9012-3456}');
    expect(operationStepDispatcher.updateObject).toBeCalledWith({ objectWorkingId: 'objectWorkingIdTest', doNotPersist: true });
    expect(officeStoreObject.removeObjectInExcelStore).toBeCalledWith('objectWorkingIdTest');
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });
});
