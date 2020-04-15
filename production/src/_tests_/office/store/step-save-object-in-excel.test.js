import stepSaveObjectInExcel from '../../../office/store/step-save-object-in-excel';
import officeStoreObject from '../../../office/store/office-store-object';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../../operation/operation-error-handler';

describe('StepSaveObjectInExcel', () => {
  let dateOriginal;
  beforeAll(() => {
    dateOriginal = global.Date;
    global.Date = { now: () => 'nowTest' };
  });

  afterAll(() => {
    global.Date = dateOriginal;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('init work as expected', () => {
    // given
    // when
    stepSaveObjectInExcel.init('initTest');

    // then
    expect(stepSaveObjectInExcel.reduxStore).toEqual('initTest');
  });

  it('saveObject should handle an error', async () => {
    // given
    jest.spyOn(console, 'error');

    jest.spyOn(officeStoreObject, 'saveObjectsInExcelStore').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(operationErrorHandler, 'handleOperationError').mockImplementation();

    // when
    await stepSaveObjectInExcel.saveObject({}, { instanceDefinition: { columns: 'columnsTest' } });

    // then
    expect(officeStoreObject.saveObjectsInExcelStore).toBeCalledTimes(1);

    expect(operationErrorHandler.handleOperationError).toBeCalledTimes(1);
    expect(operationErrorHandler.handleOperationError).toBeCalledWith(
      { previousTableDimensions: { columns: 'columnsTest' }, refreshDate: 'nowTest' },
      { instanceDefinition: { columns: 'columnsTest' } },
      new Error('errorTest')
    );

    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));
  });

  it('saveObject should work as expected', async () => {
    // given
    const objectDataMock = {
      objectWorkingId: 'objectWorkingIdTest',
      preparedInstanceId: 'preparedInstanceIdTest',
    };

    jest.spyOn(officeStoreObject, 'saveObjectsInExcelStore').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeSaveObjectInExcel').mockImplementation();

    // when
    await stepSaveObjectInExcel.saveObject(objectDataMock, { instanceDefinition: { columns: 'columnsTest' } });

    // then
    expect(objectDataMock.previousTableDimensions).toEqual({ columns: 'columnsTest' });
    expect(objectDataMock.refreshDate).toEqual('nowTest');
    expect(objectDataMock).not.toHaveProperty('preparedInstanceId');

    expect(officeStoreObject.saveObjectsInExcelStore).toBeCalledTimes(1);
    expect(officeStoreObject.saveObjectsInExcelStore).toBeCalledWith();

    expect(operationStepDispatcher.completeSaveObjectInExcel).toBeCalledTimes(1);
    expect(operationStepDispatcher.completeSaveObjectInExcel).toBeCalledWith('objectWorkingIdTest');
  });
});
