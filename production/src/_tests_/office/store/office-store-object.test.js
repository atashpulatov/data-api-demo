import officeStoreObject from '../../../office/store/office-store-object';
import * as objectActions from '../../../redux-reducer/object-reducer/object-actions';
import { reduxStore } from '../../../store';
import officeStoreHelper from '../../../office/store/office-store-helper';
import { errorService } from '../../../error/error-handler';

const internalData = {};

const settingsMock = {
  set: (key, value) => {
    internalData[key] = value;
  },
  get: (key) => internalData[key],
  remove: (key) => {
    delete internalData[key];
  },
  saveAsync: jest.fn(),
};

describe('OfficeStoreObject', () => {
  let removeObjectObject;
  beforeAll(() => {
    removeObjectObject = objectActions.removeObject;
    objectActions.removeObject = jest.fn().mockReturnValue('removeObjectTest');
  });

  beforeEach(() => {
    officeStoreObject.init(reduxStore);
  });

  afterEach(() => {
    jest.restoreAllMocks();

    settingsMock.remove('storedObjects');
    settingsMock.saveAsync.mockReset();
  });

  afterAll(() => {
    objectActions.removeObject = removeObjectObject;
  });

  it('init work as expected', () => {
    // given
    // when
    officeStoreObject.init('initTest');

    // then
    expect(officeStoreObject.reduxStore).toEqual('initTest');
  });

  it('removeObjectInExcelStore should handle exception', () => {
    // given
    jest.spyOn(officeStoreHelper, 'getOfficeSettings')
      .mockImplementation(() => {
        throw new Error('errorTest');
      });

    jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    officeStoreObject.removeObjectInExcelStore('objectWorkingIdTest');

    // then
    expect(officeStoreHelper.getOfficeSettings).toBeCalledTimes(1);

    expect(errorService.handleError).toBeCalledTimes(1);
    expect(errorService.handleError).toBeCalledWith(new Error('errorTest'));
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

    expect(settingsMock.saveAsync).toBeCalledTimes(1);
  });

  it.each`
  expectedStoredObjects                                 | storedObjectsParam                                      | objectWorkingIdParam
  
  ${[]}                                                 | ${[]}                                                   | ${'42'}
  ${[]}                                                 | ${[{ objectWorkingId: 42 }]}                            | ${42}
  ${[{ objectWorkingId: 4242 }]}                        | ${[{ objectWorkingId: 42 }, { objectWorkingId: 4242 }]} | ${42}
  ${[{ objectWorkingId: 42 }]}                          | ${[{ objectWorkingId: 42 }]}                            | ${4242}
  ${[{ objectWorkingId: 42 }, { objectWorkingId: 43 }]} | ${[{ objectWorkingId: 42 }, { objectWorkingId: 43 }]}   | ${4242}
  
  `('removeObjectInExcelStore should work as expected when objectWorkingId specified',
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

    expect(settingsMock.saveAsync).toBeCalledTimes(1);
  });

  it('removeObjectFromStore should work as expected', () => {
    // given
    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    jest.spyOn(officeStoreObject, 'removeObjectInExcelStore').mockImplementation();

    // when
    officeStoreObject.removeObjectFromStore('objectWorkingIdTest');

    // then
    expect(objectActions.removeObject).toBeCalledTimes(1);
    expect(objectActions.removeObject).toBeCalledWith('objectWorkingIdTest');

    expect(reduxStore.dispatch).toBeCalledTimes(1);
    expect(reduxStore.dispatch).toBeCalledWith('removeObjectTest');

    expect(officeStoreObject.removeObjectInExcelStore).toBeCalledTimes(1);
    expect(officeStoreObject.removeObjectInExcelStore).toBeCalledWith('objectWorkingIdTest');
  });

  it('saveObjectsInExcelStore should work as expected', async () => {
    // given
    jest.spyOn(reduxStore, 'getState').mockReturnValue({ objectReducer: { objects: 'objectsTest' } });

    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    // when
    await officeStoreObject.saveObjectsInExcelStore();

    // then
    expect(officeStoreHelper.getOfficeSettings).toBeCalledTimes(1);

    expect(settingsMock.get('storedObjects')).toEqual('objectsTest');

    expect(settingsMock.saveAsync).toBeCalledTimes(1);
  });
});
