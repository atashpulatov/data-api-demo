import { officeApiHelper } from '../api/office-api-helper';
import { officeShapeApiHelper } from './office-shape-api-helper';

import officeStoreObject from '../store/office-store-object';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepRemoveVisualizationImage from './step-remove-visualization-image';

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
        height: 342,
      },
    },
    displayAttrFormNames: 'displayAttrFormNamesTest',
    objectWorkingId: 2137,
    importType: 'image',
    bindId: '{1234-5678-9012-3456}',
  } as unknown as ObjectData;

  const mockFn = jest.fn();

  const excelContextMock = {
    workbook: {
      worksheets: [
        {
          load: mockFn,
          items: [
            {
              shapes: {
                getItemOrNullObject: jest.fn().mockImplementation(_id => ({
                  load: mockFn,
                  delete: mockFn,
                  isNullObject: false,
                  id: '{1234-5678-9012-3456}',
                })),
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
    excelContext: excelContextMock,
    instanceDefinition: {
      columns: 42,
      rows: 'rowsTest',
      mstrTable: {},
    },
  } as unknown as OperationData;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('removeVisualizationImage should work as expected', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(async () => excelContextMock);

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
    expect(officeShapeApiHelper.deleteImage).toBeCalledWith(
      excelContextMock,
      '{1234-5678-9012-3456}'
    );
    expect(operationStepDispatcher.updateObject).toBeCalledWith({
      objectWorkingId: 2137,
      doNotPersist: true,
    });
    expect(officeStoreObject.removeObjectInExcelStore).toBeCalledWith(2137);
    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(0);
  });
});
