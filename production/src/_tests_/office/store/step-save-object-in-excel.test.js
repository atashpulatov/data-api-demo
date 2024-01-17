import stepSaveObjectInExcel from '../../../office/store/step-save-object-in-excel';
import officeStoreObject from '../../../office/store/office-store-object';
import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import operationErrorHandler from '../../../operation/operation-error-handler';
import { reduxStore } from '../../../store';

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
    const objectDataMock = {
      objectWorkingId: 'objectWorkingIdTest',
      preparedInstanceId: 'preparedInstanceIdTest',
      details: {},
      importType: 'table'
    };
    const instanceDefinition = {
      rows: 5,
      columns: 'columnsTest',
      mstrTable: {},
    };

    jest.spyOn(console, 'error');
    jest.spyOn(officeStoreObject, 'saveObjectsInExcelStore').mockImplementation(() => {
      throw new Error('errorTest');
    });

    stepSaveObjectInExcel.init({ dispatch: jest.fn() });

    // when
    await stepSaveObjectInExcel.saveObject(objectDataMock, {
      instanceDefinition
    });

    // then
    expect(stepSaveObjectInExcel.reduxStore.dispatch).toHaveBeenCalled();
    expect(officeStoreObject.saveObjectsInExcelStore).toBeCalledTimes(1);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));
  });

  it('saveObject should work as expected', async () => {
    // given
    const objectDataMock = {
      objectWorkingId: 'objectWorkingIdTest',
      preparedInstanceId: 'preparedInstanceIdTest',
      details: {},
      importType: 'table'
    };

    jest.spyOn(officeStoreObject, 'saveObjectsInExcelStore').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeSaveObjectInExcel').mockImplementation();

    stepSaveObjectInExcel.init({ dispatch: jest.fn() });
    // when
    await stepSaveObjectInExcel.saveObject(objectDataMock, {
      instanceDefinition: {
        rows: 5,
        columns: 'columnsTest',
        mstrTable: {},
      }
    });

    // then
    expect(objectDataMock.previousTableDimensions).toEqual(
      {
        rows: 5,
        columns: 'columnsTest'
      }
    );
    expect(objectDataMock.details.excelTableSize).toEqual(
      {
        rows: 6,
        columns: 'columnsTest'
      }
    );
    expect(objectDataMock.refreshDate).toEqual('nowTest');
    expect(objectDataMock).not.toHaveProperty('preparedInstanceId');

    expect(officeStoreObject.saveObjectsInExcelStore).toBeCalledTimes(1);
    expect(officeStoreObject.saveObjectsInExcelStore).toBeCalledWith();
  });
});
