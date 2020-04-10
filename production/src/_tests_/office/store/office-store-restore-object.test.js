import officeStoreRestoreObject from '../../../office/store/office-store-restore-object';
import { reduxStore } from '../../../store';
import * as objectActions from '../../../redux-reducer/object-reducer/object-actions';
import { officeProperties } from '../../../redux-reducer/office-reducer/office-properties';
import { errorService } from '../../../error/error-handler';
import officeStoreHelper from '../../../office/store/office-store-helper';

const internalData = {};

const settingsMock = {
  set: (key, value) => {
    internalData[key] = value;
  },
  get: (key) => internalData[key],
  remove: (key) => {
    delete internalData[key];
  },
};

describe('OfficeStoreRestoreObject init', () => {
  it('init work as expected', () => {
    // given
    // when
    officeStoreRestoreObject.init('initTest');

    // then
    expect(officeStoreRestoreObject.reduxStore).toEqual('initTest');
  });
});

describe.each`
expectedDispatchCallNo | expectedObjectsFromProperties | storedObjectParam     | restoredFromExcelObject

${0}                   | ${[]}                         | ${undefined}          | ${undefined}
${0}                   | ${'storedObjectTest'}         | ${'storedObjectTest'} | ${undefined}

${1}                   | ${[]}                         | ${undefined}          | ${'restoredObjectFromExcelTest'}
${1}                   | ${'storedObjectTest'}         | ${'storedObjectTest'} | ${'restoredObjectFromExcelTest'}

`('OfficeStoreRestoreObject restoreObjectsFromExcelStore', ({
  expectedDispatchCallNo,
  expectedObjectsFromProperties,
  storedObjectParam,
  restoredFromExcelObject
}) => {
  let consoleLogOriginal;
  beforeAll(() => {
    objectActions.restoreAllObjects = jest.fn().mockReturnValue('restoreAllObjectsTest');

    consoleLogOriginal = console.log;
    console.log = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    internalData[officeProperties.storedObjects] = storedObjectParam;

    settingsMock.saveAsync = jest.fn()
      .mockImplementation((func) => {
        func({ status: 'saveAsyncTest' });
      });

    officeStoreRestoreObject.init(reduxStore);
  });

  afterAll(() => {
    console.log = consoleLogOriginal;

    jest.restoreAllMocks();

    delete internalData[officeProperties.storedObjects];
    delete settingsMock.saveAsync;
  });

  it('restoreObjectsFromExcelStore should work as expected', () => {
    // given
    const getOfficeSettingsMock = jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);
    const restoreLegacyObjectsFromExcelStoreMock = jest.spyOn(officeStoreRestoreObject, 'restoreLegacyObjectsFromExcelStore')
      .mockReturnValue(restoredFromExcelObject);

    const dispatchMock = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    officeStoreRestoreObject.restoreObjectsFromExcelStore();

    // then
    expect(getOfficeSettingsMock).toBeCalledTimes(1);
    expect(getOfficeSettingsMock).toBeCalledWith();

    expect(restoreLegacyObjectsFromExcelStoreMock).toBeCalledTimes(1);
    expect(restoreLegacyObjectsFromExcelStoreMock).toBeCalledWith(expectedObjectsFromProperties);

    expect(dispatchMock).toBeCalledTimes(expectedDispatchCallNo);
    if (expectedDispatchCallNo === 1) {
      expect(dispatchMock).toBeCalledWith('restoreAllObjectsTest');
    }

    expect(objectActions.restoreAllObjects).toBeCalledTimes(expectedDispatchCallNo);
    if (expectedDispatchCallNo === 1) {
      expect(objectActions.restoreAllObjects).toBeCalledWith('restoredObjectFromExcelTest');
    }

    expect(settingsMock.get(officeProperties.loadedReportProperties)).toEqual([]);
    expect(settingsMock.get(officeProperties.storedObjects)).toEqual(restoredFromExcelObject);

    expect(settingsMock.saveAsync).toBeCalledTimes(1);

    expect(console.log).toBeCalledWith('Clearing report Array in settings saveAsyncTest');
  });
});

describe('OfficeStoreRestoreObject restoreLegacyObjectsFromExcelStore', () => {
  let dateOriginal;
  beforeAll(() => {
    dateOriginal = global.Date;
    global.Date = { now: () => 'nowTest' };
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    global.Date = dateOriginal;
  });

  afterEach(() => {
    delete settingsMock.saveAsync;
  });

  it.each`
  expectedResult | objectsParam
  
  ${[]}          | ${undefined}
  ${[]}          | ${[]}
  ${[1, 2]}      | ${[1, 2]}
  `('restoreLegacyObjectsFromExcelStore should work as expected when reportArray is empty',
  ({ expectedResult, objectsParam }) => {
    // given
    const getLegacyObjectsListMock = jest.spyOn(officeStoreRestoreObject, 'getLegacyObjectsList').mockReturnValue(undefined);

    const mapLegacyObjectValueMock = jest.spyOn(officeStoreRestoreObject, 'mapLegacyObjectValue').mockImplementation();

    // when
    const result = officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore(objectsParam);

    // then
    expect(getLegacyObjectsListMock).toBeCalledTimes(1);
    expect(getLegacyObjectsListMock).toBeCalledWith();

    expect(mapLegacyObjectValueMock).not.toBeCalled();

    expect(result).toEqual(expectedResult);
  });

  it.each`
  expectedResult                                                                         | objectsParam
  
  ${[{ bindId: 'otherBindId', objectWorkingId: 'nowTest0' }]}                            | ${undefined}
  ${[{ bindId: 'otherBindId', objectWorkingId: 'nowTest0' }]}                            | ${[]}
  ${[{ bindId: 'paramBindId' }, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }]} | ${[{ bindId: 'paramBindId' }]}
  `('restoreLegacyObjectsFromExcelStore should work as expected when 1 object, empty objects or bindId not found',
  ({ expectedResult, objectsParam }) => {
    // given
    const getLegacyObjectsListMock = jest.spyOn(officeStoreRestoreObject, 'getLegacyObjectsList').mockReturnValue([
      { objectWorkingId: 'objectWorkingIdTest', bindId: 'otherBindId' }
    ]);

    const mapLegacyObjectValueMock = jest.spyOn(officeStoreRestoreObject, 'mapLegacyObjectValue').mockImplementation();

    // when
    const result = officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore(objectsParam);

    // then
    expect(getLegacyObjectsListMock).toBeCalledTimes(1);
    expect(getLegacyObjectsListMock).toBeCalledWith();

    expect(mapLegacyObjectValueMock).toBeCalledTimes(4);
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(1, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'objectId', 'id');
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(2, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'mstrObjectType', 'objectType');
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(3, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'previousTableDimensions', 'tableDimensions');
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(4, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'subtotalsInfo', 'subtotalInfo');

    expect(result).toEqual(expectedResult);
  });

  it.each`
  expectedResult                                                                                                                                 | objectsParam
  
  ${[{ bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, { bindId: 'otherBindId', objectWorkingId: 'nowTest2' }]}                            | ${undefined}
  ${[{ bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, { bindId: 'otherBindId', objectWorkingId: 'nowTest2' }]}                            | ${[]}
  ${[{ bindId: 'paramBindId' }, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, { bindId: 'otherBindId', objectWorkingId: 'nowTest2' }]} | ${[{ bindId: 'paramBindId' }]}
  `('restoreLegacyObjectsFromExcelStore should work as expected when many objects, empty objects or bindId not found',
  ({ expectedResult, objectsParam }) => {
    // given
    const getLegacyObjectsListMock = jest.spyOn(officeStoreRestoreObject, 'getLegacyObjectsList').mockReturnValue([
      { objectWorkingId: 'objectWorkingIdTest', bindId: 'otherBindId' },
      { objectWorkingId: 'objectWorkingIdTest', bindId: 'otherBindId' }
    ]);

    const mapLegacyObjectValueMock = jest.spyOn(officeStoreRestoreObject, 'mapLegacyObjectValue').mockImplementation();

    // when
    const result = officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore(objectsParam);

    // then
    expect(getLegacyObjectsListMock).toBeCalledTimes(1);
    expect(getLegacyObjectsListMock).toBeCalledWith();

    expect(mapLegacyObjectValueMock).toBeCalledTimes(8);
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(1, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'objectId', 'id');
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(2, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'mstrObjectType', 'objectType');
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(3, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'previousTableDimensions', 'tableDimensions');
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(4, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'subtotalsInfo', 'subtotalInfo');

    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(5, { bindId: 'otherBindId', objectWorkingId: 'nowTest2' }, 'objectId', 'id');
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(6, { bindId: 'otherBindId', objectWorkingId: 'nowTest2' }, 'mstrObjectType', 'objectType');
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(7, { bindId: 'otherBindId', objectWorkingId: 'nowTest2' }, 'previousTableDimensions', 'tableDimensions');
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(8, { bindId: 'otherBindId', objectWorkingId: 'nowTest2' }, 'subtotalsInfo', 'subtotalInfo');

    expect(result).toEqual(expectedResult);
  });

  it('restoreLegacyObjectsFromExcelStore should work as expected when 1 object, 1 existing bindId', () => {
    // given
    const getLegacyObjectsListMock = jest.spyOn(officeStoreRestoreObject, 'getLegacyObjectsList').mockReturnValue([
      { objectWorkingId: 'objectWorkingIdTest', bindId: 'sameBindId' }
    ]);

    const mapLegacyObjectValueMock = jest.spyOn(officeStoreRestoreObject, 'mapLegacyObjectValue').mockImplementation();

    // when
    const result = officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore([{ bindId: 'sameBindId' }]);

    // then
    expect(getLegacyObjectsListMock).toBeCalledTimes(1);
    expect(getLegacyObjectsListMock).toBeCalledWith();

    expect(mapLegacyObjectValueMock).not.toBeCalled();

    expect(result).toEqual([{ bindId: 'sameBindId' }]);
  });

  it('restoreLegacyObjectsFromExcelStore should work as expected when many objects, 1 existing bindId', () => {
    // given
    const getLegacyObjectsListMock = jest.spyOn(officeStoreRestoreObject, 'getLegacyObjectsList').mockReturnValue([
      { objectWorkingId: 'objectWorkingIdOtherTest', bindId: 'otherBindId' },
      { objectWorkingId: 'objectWorkingIdSameTest', bindId: 'sameBindId' },
    ]);

    const mapLegacyObjectValueMock = jest.spyOn(officeStoreRestoreObject, 'mapLegacyObjectValue').mockImplementation();

    // when
    const result = officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore([{ bindId: 'paramBindId' }, { bindId: 'sameBindId' }]);

    // then
    expect(getLegacyObjectsListMock).toBeCalledTimes(1);
    expect(getLegacyObjectsListMock).toBeCalledWith();

    expect(mapLegacyObjectValueMock).toBeCalledTimes(4);
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(1, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'objectId', 'id');
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(2, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'mstrObjectType', 'objectType');
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(3, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'previousTableDimensions', 'tableDimensions');
    expect(mapLegacyObjectValueMock).toHaveBeenNthCalledWith(4, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'subtotalsInfo', 'subtotalInfo');

    expect(result).toEqual([
      { bindId: 'paramBindId' },
      { bindId: 'sameBindId' },
      { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }
    ]);
  });

  it('restoreLegacyObjectsFromExcelStore should work as expected when 2 objects, 2 existing bindId', () => {
    // given
    const getLegacyObjectsListMock = jest.spyOn(officeStoreRestoreObject, 'getLegacyObjectsList').mockReturnValue([
      { objectWorkingId: 'objectWorkingIdOneTest', bindId: 'oneExistingBindId' },
      { objectWorkingId: 'objectWorkingIdTwoTest', bindId: 'twoExistingBindId' },
    ]);

    const mapLegacyObjectValueMock = jest.spyOn(officeStoreRestoreObject, 'mapLegacyObjectValue').mockImplementation();

    // when
    const result = officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore([{ bindId: 'oneExistingBindId' }, { bindId: 'twoExistingBindId' }]);

    // then
    expect(getLegacyObjectsListMock).toBeCalledTimes(1);
    expect(getLegacyObjectsListMock).toBeCalledWith();

    expect(mapLegacyObjectValueMock).toBeCalledTimes(0);

    expect(result).toEqual([
      { bindId: 'oneExistingBindId' },
      { bindId: 'twoExistingBindId' },
    ]);
  });

  it.each`
  expectedObject     | objectParam        | newKey       | oldKey
  
  ${{}}              | ${{}}              | ${undefined} | ${undefined}
  ${{ someKey: 42 }} | ${{ someKey: 42 }} | ${'newKey'}  | ${'notExistingKey'}
  ${{ newKey: 42 }}  | ${{ oldKey: 42 }}  | ${'newKey'}  | ${'oldKey'} 
  
  `('mapLegacyObjectValue should work as expected',
  async ({
    expectedObject,
    objectParam,
    newKey,
    oldKey
  }) => {
    // given
    const object = { ...objectParam };

    // when
    officeStoreRestoreObject.mapLegacyObjectValue(object, newKey, oldKey);

    // then
    expect(object).toEqual(expectedObject);
  });

  it('getLegacyObjectsList handles exception', () => {
    // given
    const getOfficeSettingsMock = jest.spyOn(officeStoreHelper, 'getOfficeSettings')
      .mockImplementation(() => {
        throw new Error('errorTest');
      });

    const handleErrorMock = jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    const result = officeStoreRestoreObject.getLegacyObjectsList();

    // then
    expect(getOfficeSettingsMock).toBeCalledTimes(1);

    expect(handleErrorMock).toBeCalledTimes(1);
    expect(handleErrorMock).toBeCalledWith(new Error('errorTest'));

    expect(result).toBe(undefined);
  });

  it('getLegacyObjectsList works as expected when officeProperties.loadedReportProperties not exists', () => {
    // given
    settingsMock.saveAsync = jest.fn();
    settingsMock.remove(officeProperties.loadedReportProperties);

    const getOfficeSettingsMock = jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    const handleErrorMock = jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    const result = officeStoreRestoreObject.getLegacyObjectsList();

    // then
    expect(getOfficeSettingsMock).toBeCalledTimes(1);
    expect(settingsMock.saveAsync).toBeCalledTimes(1);

    expect(handleErrorMock).not.toBeCalled();

    expect(result).toStrictEqual([]);
  });

  it('getLegacyObjectsList works as expected when officeProperties.loadedReportProperties exists', () => {
    // given
    settingsMock.saveAsync = jest.fn();
    settingsMock.set(officeProperties.loadedReportProperties, [42]);

    const getOfficeSettingsMock = jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    const handleErrorMock = jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    const result = officeStoreRestoreObject.getLegacyObjectsList();

    // then
    expect(getOfficeSettingsMock).toBeCalledTimes(1);
    expect(settingsMock.saveAsync).not.toBeCalled();

    expect(handleErrorMock).not.toBeCalled();

    expect(result).toEqual([42]);
  });
});
