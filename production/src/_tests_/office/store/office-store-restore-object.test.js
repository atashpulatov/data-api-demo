import officeStoreRestoreObject from '../../../office/store/office-store-restore-object';
import { reduxStore } from '../../../store';
import * as objectActions from '../../../redux-reducer/object-reducer/object-actions';
import * as answersActions from '../../../redux-reducer/answers-reducer/answers-actions';
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
  let objectActionsOriginal;
  beforeAll(() => {
    objectActionsOriginal = objectActions.restoreAllObjects;
    objectActions.restoreAllObjects = jest.fn().mockReturnValue('restoreAllObjectsTest');
  });

  beforeEach(() => {
    jest.clearAllMocks();

    internalData[officeProperties.storedObjects] = storedObjectParam;

    officeStoreRestoreObject.init(reduxStore);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    delete internalData[officeProperties.storedObjects];

    objectActions.restoreAllObjects = objectActionsOriginal;
  });

  it('restoreObjectsFromExcelStore should work as expected', () => {
    // given
    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);
    jest.spyOn(officeStoreRestoreObject, 'restoreLegacyObjectsFromExcelStore').mockReturnValue(restoredFromExcelObject);

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    officeStoreRestoreObject.restoreObjectsFromExcelStore();

    // then
    expect(officeStoreHelper.getOfficeSettings).toBeCalledTimes(1);
    expect(officeStoreHelper.getOfficeSettings).toBeCalledWith();

    expect(officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore).toBeCalledTimes(1);
    expect(officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore).toBeCalledWith(
      expectedObjectsFromProperties, settingsMock
    );

    expect(reduxStore.dispatch).toBeCalledTimes(expectedDispatchCallNo);
    if (expectedDispatchCallNo === 1) {
      expect(reduxStore.dispatch).toBeCalledWith('restoreAllObjectsTest');
    }

    expect(objectActions.restoreAllObjects).toBeCalledTimes(expectedDispatchCallNo);
    if (expectedDispatchCallNo === 1) {
      expect(objectActions.restoreAllObjects).toBeCalledWith('restoredObjectFromExcelTest');
    }

    expect(settingsMock.get(officeProperties.storedObjects)).toEqual(restoredFromExcelObject);
  });
});

describe('OfficeStoreRestoreObject restoreAnswersFromExcelStore', () => {
  let answersActionsOriginal;
  beforeAll(() => {
    answersActionsOriginal = answersActions.restoreAllAnswers;
    answersActionsOriginal.restoreAllAnswers = jest.fn().mockReturnValue('restoreAllAnswersTest');
  });

  beforeEach(() => {
    jest.clearAllMocks();
    internalData[officeProperties.storedAnswers] = 'restoredAnswerFromExcelTest';
    officeStoreRestoreObject.init(reduxStore);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    delete internalData[officeProperties.storedAnswers];

    answersActions.restoreAllAnswers = answersActionsOriginal;
  });

  it('restoreAnswersFromExcelStore should work as expected', () => {
    // given
    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    officeStoreRestoreObject.restoreAnswersFromExcelStore();

    // then
    expect(officeStoreHelper.getOfficeSettings).toBeCalledTimes(1);
    expect(officeStoreHelper.getOfficeSettings).toBeCalledWith();

    expect(reduxStore.dispatch).toBeCalledTimes(1);
  });
});

describe('OfficeStoreRestoreObject restoreLegacyObjectsFromExcelStore', () => {
  let dateOriginal;
  beforeAll(() => {
    dateOriginal = global.Date;
    global.Date = { now: () => 'nowTest' };
  });

  beforeEach(() => {
    settingsMock.saveAsync = jest.fn().mockImplementation((func) => {
      func({ status: 'saveAsyncTest' });
    });
    jest.spyOn(console, 'log');
  });

  afterAll(() => {
    global.Date = dateOriginal;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
  expectedResult | objectsParam
  
  ${[]}          | ${undefined}
  ${[]}          | ${[]}
  ${[1, 2]}      | ${[1, 2]}
  `('restoreLegacyObjectsFromExcelStore should work as expected when reportArray is empty',
    ({ expectedResult, objectsParam }) => {
    // given
      jest.spyOn(officeStoreRestoreObject, 'getLegacyObjectsList').mockReturnValue(undefined);

      jest.spyOn(officeStoreRestoreObject, 'mapLegacyObjectValue').mockImplementation();

      // when
      const result = officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore(objectsParam, settingsMock);

      // then
      expect(officeStoreRestoreObject.getLegacyObjectsList).toBeCalledTimes(1);
      expect(officeStoreRestoreObject.getLegacyObjectsList).toBeCalledWith();

      expect(officeStoreRestoreObject.mapLegacyObjectValue).not.toBeCalled();
      expect(settingsMock.saveAsync).not.toBeCalled();

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
      jest.spyOn(officeStoreRestoreObject, 'getLegacyObjectsList').mockReturnValue([
        { objectWorkingId: 'objectWorkingIdTest', bindId: 'otherBindId' }
      ]);

      jest.spyOn(officeStoreRestoreObject, 'mapLegacyObjectValue').mockImplementation();

      // when
      const result = officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore(objectsParam, settingsMock);

      // then
      expect(officeStoreRestoreObject.getLegacyObjectsList).toBeCalledTimes(1);
      expect(officeStoreRestoreObject.getLegacyObjectsList).toBeCalledWith();

      expect(officeStoreRestoreObject.mapLegacyObjectValue).toBeCalledTimes(4);
      expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(1, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'objectId', 'id');
      expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(2, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'mstrObjectType', 'objectType');
      expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(3, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'previousTableDimensions', 'tableDimensions');
      expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(4, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'subtotalsInfo', 'subtotalInfo');

      expect(settingsMock.saveAsync).toBeCalledTimes(1);
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('Clearing report Array in settings saveAsyncTest');

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
      jest.spyOn(officeStoreRestoreObject, 'getLegacyObjectsList').mockReturnValue([
        { objectWorkingId: 'objectWorkingIdTest', bindId: 'otherBindId' },
        { objectWorkingId: 'objectWorkingIdTest', bindId: 'otherBindId' }
      ]);

      jest.spyOn(officeStoreRestoreObject, 'mapLegacyObjectValue').mockImplementation();

      // when
      const result = officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore(objectsParam, settingsMock);

      // then
      expect(officeStoreRestoreObject.getLegacyObjectsList).toBeCalledTimes(1);
      expect(officeStoreRestoreObject.getLegacyObjectsList).toBeCalledWith();

      expect(officeStoreRestoreObject.mapLegacyObjectValue).toBeCalledTimes(8);
      expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(1, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'objectId', 'id');
      expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(2, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'mstrObjectType', 'objectType');
      expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(3, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'previousTableDimensions', 'tableDimensions');
      expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(4, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'subtotalsInfo', 'subtotalInfo');

      expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(5, { bindId: 'otherBindId', objectWorkingId: 'nowTest2' }, 'objectId', 'id');
      expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(6, { bindId: 'otherBindId', objectWorkingId: 'nowTest2' }, 'mstrObjectType', 'objectType');
      expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(7, { bindId: 'otherBindId', objectWorkingId: 'nowTest2' }, 'previousTableDimensions', 'tableDimensions');
      expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(8, { bindId: 'otherBindId', objectWorkingId: 'nowTest2' }, 'subtotalsInfo', 'subtotalInfo');

      expect(settingsMock.saveAsync).toBeCalledTimes(1);
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('Clearing report Array in settings saveAsyncTest');

      expect(result).toEqual(expectedResult);
    });

  it('restoreLegacyObjectsFromExcelStore should work as expected when 1 object, 1 existing bindId', () => {
    // given
    jest.spyOn(officeStoreRestoreObject, 'getLegacyObjectsList').mockReturnValue([
      { objectWorkingId: 'objectWorkingIdTest', bindId: 'sameBindId' }
    ]);

    jest.spyOn(officeStoreRestoreObject, 'mapLegacyObjectValue').mockImplementation();

    // when
    const result = officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore([{ bindId: 'sameBindId' }], settingsMock);

    // then
    expect(officeStoreRestoreObject.getLegacyObjectsList).toBeCalledTimes(1);
    expect(officeStoreRestoreObject.getLegacyObjectsList).toBeCalledWith();

    expect(officeStoreRestoreObject.mapLegacyObjectValue).not.toBeCalled();

    expect(settingsMock.saveAsync).toBeCalledTimes(1);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith('Clearing report Array in settings saveAsyncTest');

    expect(result).toEqual([{ bindId: 'sameBindId' }]);
  });

  it('restoreLegacyObjectsFromExcelStore should work as expected when many objects, 1 existing bindId', () => {
    // given
    jest.spyOn(officeStoreRestoreObject, 'getLegacyObjectsList').mockReturnValue([
      { objectWorkingId: 'objectWorkingIdOtherTest', bindId: 'otherBindId' },
      { objectWorkingId: 'objectWorkingIdSameTest', bindId: 'sameBindId' },
    ]);

    jest.spyOn(officeStoreRestoreObject, 'mapLegacyObjectValue').mockImplementation();

    // when
    const result = officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore(
      [{ bindId: 'paramBindId' }, { bindId: 'sameBindId' }],
      settingsMock
    );

    // then
    expect(officeStoreRestoreObject.getLegacyObjectsList).toBeCalledTimes(1);
    expect(officeStoreRestoreObject.getLegacyObjectsList).toBeCalledWith();

    expect(officeStoreRestoreObject.mapLegacyObjectValue).toBeCalledTimes(4);
    expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(1, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'objectId', 'id');
    expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(2, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'mstrObjectType', 'objectType');
    expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(3, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'previousTableDimensions', 'tableDimensions');
    expect(officeStoreRestoreObject.mapLegacyObjectValue).toHaveBeenNthCalledWith(4, { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }, 'subtotalsInfo', 'subtotalInfo');

    expect(settingsMock.saveAsync).toBeCalledTimes(1);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith('Clearing report Array in settings saveAsyncTest');

    expect(result).toEqual([
      { bindId: 'paramBindId' },
      { bindId: 'sameBindId' },
      { bindId: 'otherBindId', objectWorkingId: 'nowTest0' }
    ]);
  });

  it('restoreLegacyObjectsFromExcelStore should work as expected when 2 objects, 2 existing bindId', () => {
    // given
    jest.spyOn(officeStoreRestoreObject, 'getLegacyObjectsList').mockReturnValue([
      { objectWorkingId: 'objectWorkingIdOneTest', bindId: 'oneExistingBindId' },
      { objectWorkingId: 'objectWorkingIdTwoTest', bindId: 'twoExistingBindId' },
    ]);

    jest.spyOn(officeStoreRestoreObject, 'mapLegacyObjectValue').mockImplementation();

    // when
    const result = officeStoreRestoreObject.restoreLegacyObjectsFromExcelStore(
      [{ bindId: 'oneExistingBindId' }, { bindId: 'twoExistingBindId' }],
      settingsMock
    );

    // then
    expect(officeStoreRestoreObject.getLegacyObjectsList).toBeCalledTimes(1);
    expect(officeStoreRestoreObject.getLegacyObjectsList).toBeCalledWith();

    expect(officeStoreRestoreObject.mapLegacyObjectValue).toBeCalledTimes(0);

    expect(settingsMock.saveAsync).toBeCalledTimes(1);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith('Clearing report Array in settings saveAsyncTest');

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
    jest.spyOn(officeStoreHelper, 'getOfficeSettings')
      .mockImplementation(() => {
        throw new Error('errorTest');
      });

    jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    const result = officeStoreRestoreObject.getLegacyObjectsList();

    // then
    expect(officeStoreHelper.getOfficeSettings).toBeCalledTimes(1);

    expect(errorService.handleError).toBeCalledTimes(1);
    expect(errorService.handleError).toBeCalledWith(new Error('errorTest'));

    expect(result).toBe(undefined);
  });

  it('getLegacyObjectsList works as expected when officeProperties.loadedReportProperties not exists', () => {
    // given
    settingsMock.saveAsync = jest.fn();
    settingsMock.remove(officeProperties.loadedReportProperties);

    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    const result = officeStoreRestoreObject.getLegacyObjectsList();

    // then
    expect(officeStoreHelper.getOfficeSettings).toBeCalledTimes(1);
    expect(settingsMock.saveAsync).toBeCalledTimes(1);

    expect(errorService.handleError).not.toBeCalled();

    expect(result).toStrictEqual([]);
  });

  it('getLegacyObjectsList works as expected when officeProperties.loadedReportProperties exists', () => {
    // given
    settingsMock.saveAsync = jest.fn();
    settingsMock.set(officeProperties.loadedReportProperties, [42]);

    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    const result = officeStoreRestoreObject.getLegacyObjectsList();

    // then
    expect(officeStoreHelper.getOfficeSettings).toBeCalledTimes(1);
    expect(settingsMock.saveAsync).not.toBeCalled();

    expect(errorService.handleError).not.toBeCalled();

    expect(result).toEqual([42]);
  });
  it('getExcelSettingValue works as expected', () => {
    // given
    const key = 'settingsKey';
    const value = 'value';
    settingsMock.saveAsync = jest.fn();
    settingsMock.set(key, value);
    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    // when
    const result = officeStoreRestoreObject.getExcelSettingValue(key);

    // then
    expect(officeStoreHelper.getOfficeSettings).toBeCalledTimes(1);
    expect(result).toEqual(value);
  });
});
