import { reduxStore } from '../../store';
import officeStoreObject from './office-store-object';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import stepSaveObjectInExcel from './step-save-object-in-excel';

describe('StepSaveObjectInExcel', () => {
  let dateOriginal: any;
  beforeAll(() => {
    dateOriginal = global.Date;
    // @ts-expect-error
    global.Date = { now: () => 'nowTest' };
  });

  afterAll(() => {
    global.Date = dateOriginal;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('saveObject should handle an error', async () => {
    // given
    const objectDataMock = {
      objectWorkingId: 2137,
      preparedInstanceId: 'preparedInstanceIdTest',
      details: {},
      importType: 'table',
    } as unknown as ObjectData;
    const instanceDefinition = {
      rows: 5,
      columns: 'columnsTest',
      mstrTable: {},
    };

    jest.spyOn(console, 'error');
    jest.spyOn(officeStoreObject, 'saveObjectsInExcelStore').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    await stepSaveObjectInExcel.saveObject(objectDataMock, {
      instanceDefinition,
    } as unknown as OperationData);

    // then
    expect(reduxStore.dispatch).toHaveBeenCalled();
    expect(officeStoreObject.saveObjectsInExcelStore).toBeCalledTimes(1);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(new Error('errorTest'));
  });

  it('saveObject should work as expected', async () => {
    // given
    const objectDataMock = {
      objectWorkingId: 2137,
      preparedInstanceId: 'preparedInstanceIdTest',
      details: {},
      importType: 'table',
    } as unknown as ObjectData;

    jest.spyOn(officeStoreObject, 'saveObjectsInExcelStore').mockImplementation();

    jest.spyOn(operationStepDispatcher, 'completeSaveObjectInExcel').mockImplementation();

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // mock redux dispatch

    // when
    await stepSaveObjectInExcel.saveObject(objectDataMock, {
      instanceDefinition: {
        rows: 5,
        columns: 'columnsTest',
        mstrTable: {},
      },
    } as unknown as OperationData);

    // then
    expect(objectDataMock.previousTableDimensions).toEqual({
      rows: 5,
      columns: 'columnsTest',
    });
    expect(objectDataMock.details.excelTableSize).toEqual({
      rows: 6,
      columns: 'columnsTest',
    });
    expect(objectDataMock.refreshDate).toEqual('nowTest');
    expect(objectDataMock).not.toHaveProperty('preparedInstanceId');

    expect(officeStoreObject.saveObjectsInExcelStore).toBeCalledTimes(1);
    expect(officeStoreObject.saveObjectsInExcelStore).toBeCalledWith();
  });
});
