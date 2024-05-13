import { officeApiHelper } from '../api/office-api-helper';
import { pivotTableHelper } from '../pivot-table/pivot-table-helper';
import { officeShapeApiHelper } from '../shapes/office-shape-api-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepHighlightObject from './step-highlight-object';
import { ObjectImportType } from '../../mstr-object/constants';

describe('StepHighlightObject', () => {
  const operationData = {} as OperationData;
  let objectData: ObjectData;
  let activate: jest.Mock;
  let sync: jest.Mock;
  let getItem: jest.Mock;
  let getExcelContext: jest.SpyInstance;

  beforeEach(() => {
    activate = jest.fn();
    sync = jest.fn();

    getItem = jest.fn();
    getExcelContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockResolvedValue({
      workbook: {
        worksheets: { getItem },
        pivotTables: { getItem },
      },
      sync,
    } as any as Excel.RequestContext);

    jest.spyOn(operationStepDispatcher, 'completeHighlightObject').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call onBindingObjectClick properly when importType is ObjectImportType.TABLE', async () => {
    // given
    objectData = { importType: ObjectImportType.TABLE, objectWorkingId: 42 } as ObjectData;

    const onBindingObjectClick = jest
      .spyOn(officeApiHelper, 'onBindingObjectClick')
      .mockImplementation();

    // when
    await stepHighlightObject.highlightObject(objectData, operationData);

    // then
    expect(onBindingObjectClick).toHaveBeenCalledWith(objectData);
    expect(operationStepDispatcher.completeHighlightObject).toHaveBeenCalledWith(
      objectData.objectWorkingId
    );
  });

  it('should call proper handlers when importType is ObjectImportType.PIVOT_TABLE', async () => {
    // given
    objectData = {
      importType: ObjectImportType.PIVOT_TABLE,
      pivotTableId: 'pivotTableId',
      objectWorkingId: 42,
    } as ObjectData;

    jest.spyOn(pivotTableHelper, 'getPivotTable').mockResolvedValue({
      isNullObject: false,
      worksheet: { activate },
    } as any);

    // when
    await stepHighlightObject.highlightObject(objectData, operationData);

    // then
    expect(getExcelContext).toHaveBeenCalled();
    expect(activate).toHaveBeenCalled();
    expect(sync).toHaveBeenCalled();
    expect(operationStepDispatcher.completeHighlightObject).toHaveBeenCalledWith(
      objectData.objectWorkingId
    );
  });

  it('should call proper handlers when importType is ObjectImportType.IMAGE', async () => {
    // given
    objectData = {
      importType: ObjectImportType.IMAGE,
      bindId: 'bindId',
      objectWorkingId: 42,
    } as ObjectData;
    const shapeWorksheetId = 'someWorksheetId';

    const getShape = jest
      .spyOn(officeShapeApiHelper, 'getShape')
      .mockResolvedValue({ worksheetId: shapeWorksheetId } as any);
    getItem.mockReturnValue({ activate });

    // when
    await stepHighlightObject.highlightObject(objectData, operationData);

    // then
    expect(getExcelContext).toHaveBeenCalled();
    expect(getShape).toHaveBeenCalled();
    expect(getItem).toHaveBeenCalledWith(shapeWorksheetId);
    expect(activate).toHaveBeenCalled();
    expect(sync).toHaveBeenCalled();
    expect(operationStepDispatcher.completeHighlightObject).toHaveBeenCalledWith(
      objectData.objectWorkingId
    );
  });

  it('should handle error properly', async () => {
    // given
    objectData = { bindId: 'bindId', objectWorkingId: 42 } as ObjectData;

    const error = new Error('error');

    getExcelContext.mockRejectedValue(error);
    const handleOperationError = jest
      .spyOn(operationErrorHandler, 'handleOperationError')
      .mockImplementation();

    // when
    await stepHighlightObject.highlightObject(objectData, operationData);

    // then
    expect(handleOperationError).toHaveBeenCalledWith(objectData, operationData, error);
  });
});
