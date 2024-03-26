/* eslint-disable no-import-assign */
import officeStoreHelper from './office-store-helper';

import { reduxStore } from '../../store';
import officeStoreObject from './office-store-object';

import { errorService } from '../../error/error-handler';
import * as objectActions from '../../redux-reducer/object-reducer/object-actions';

const internalData = {} as any;

const settingsMock = {
  set: (key: string, value: any) => {
    internalData[key] = value;
  },
  get: (key: string) => internalData[key],
  remove: (key: string) => {
    delete internalData[key];
  },
  saveAsync: jest.fn(),
} as unknown as Office.Settings;

describe('OfficeStoreObject', () => {
  let removeObjectObject: any;

  beforeAll(() => {
    removeObjectObject = objectActions.removeObject;
    // @ts-expect-error
    objectActions.removeObject = jest.fn().mockReturnValue('removeObjectTest');
  });

  beforeEach(() => {
    // @ts-expect-error
    officeStoreObject.init(reduxStore);
  });

  afterEach(() => {
    jest.restoreAllMocks();

    settingsMock.remove('storedObjects');
    // @ts-expect-error
    settingsMock.saveAsync.mockReset();
  });

  afterAll(() => {
    // @ts-expect-error
    objectActions.removeObject = removeObjectObject;
  });

  it('init work as expected', () => {
    // given
    // when
    // @ts-expect-error
    officeStoreObject.init('initTest');

    // then
    expect(officeStoreObject.reduxStore).toEqual('initTest');
  });

  it('removeObjectInExcelStore should handle exception', () => {
    // given
    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockImplementation(() => {
      throw new Error('errorTest');
    });

    jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    officeStoreObject.removeObjectInExcelStore(2137);

    // then
    expect(officeStoreHelper.getOfficeSettings).toHaveBeenCalledTimes(1);

    expect(errorService.handleError).toHaveBeenCalledTimes(1);
    expect(errorService.handleError).toHaveBeenCalledWith(new Error('errorTest'));
  });

  it('removeObjectInExcelStore should work as expected when no objectWorkingId specified', () => {
    // given
    const storedObjectMock = { findIndex: jest.fn(), splice: jest.fn() };
    settingsMock.set('storedObjects', storedObjectMock);

    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    // when
    officeStoreObject.removeObjectInExcelStore();

    // then
    expect(storedObjectMock.findIndex).not.toBeCalled();

    expect(settingsMock.saveAsync).toHaveBeenCalledTimes(1);
  });

  it.each`
    expectedStoredObjects                                 | storedObjectsParam                                      | objectWorkingIdParam
    ${[]}                                                 | ${[]}                                                   | ${'42'}
    ${[]}                                                 | ${[{ objectWorkingId: 42 }]}                            | ${42}
    ${[{ objectWorkingId: 4242 }]}                        | ${[{ objectWorkingId: 42 }, { objectWorkingId: 4242 }]} | ${42}
    ${[{ objectWorkingId: 42 }]}                          | ${[{ objectWorkingId: 42 }]}                            | ${4242}
    ${[{ objectWorkingId: 42 }, { objectWorkingId: 43 }]} | ${[{ objectWorkingId: 42 }, { objectWorkingId: 43 }]}   | ${4242}
  `(
    'removeObjectInExcelStore should work as expected when objectWorkingId specified',
    ({ expectedStoredObjects, storedObjectsParam, objectWorkingIdParam }) => {
      /*

     */
      // given
      settingsMock.set('storedObjects', storedObjectsParam);

      jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

      // when
      officeStoreObject.removeObjectInExcelStore(objectWorkingIdParam);

      // then
      expect(settingsMock.get('storedObjects')).toEqual(expectedStoredObjects);

      expect(settingsMock.saveAsync).toHaveBeenCalledTimes(1);
    }
  );

  it('removeObjectFromStore should work as expected', () => {
    // given
    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    jest.spyOn(officeStoreObject, 'removeObjectInExcelStore').mockImplementation();

    // when
    officeStoreObject.removeObjectFromStore(2137);

    // then
    expect(objectActions.removeObject).toHaveBeenCalledTimes(1);
    expect(objectActions.removeObject).toHaveBeenCalledWith(2137);

    expect(reduxStore.dispatch).toHaveBeenCalledTimes(1);
    expect(reduxStore.dispatch).toHaveBeenCalledWith('removeObjectTest');

    expect(officeStoreObject.removeObjectInExcelStore).toHaveBeenCalledTimes(1);
    expect(officeStoreObject.removeObjectInExcelStore).toHaveBeenCalledWith(2137);
  });

  it('saveObjectsInExcelStore should work as expected', async () => {
    // given

    // @ts-expect-error
    jest.spyOn(reduxStore, 'getState').mockReturnValue({ objectReducer: { objects: 'objectsTest' } });

    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    // when
    await officeStoreObject.saveObjectsInExcelStore();

    // then
    expect(officeStoreHelper.getOfficeSettings).toHaveBeenCalledTimes(2);

    expect(settingsMock.get('storedObjects')).toEqual('objectsTest');

    expect(settingsMock.saveAsync).toHaveBeenCalledTimes(1);
  });
});
