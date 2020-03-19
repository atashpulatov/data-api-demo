/* eslint-disable object-curly-newline, indent */
import officeApiDataLoader from '../../office/api/office-api-data-loader';

describe('OfficeApiDataLoader', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each`
  excelContext | object       | key          | msg
  
  ${undefined} | ${undefined} | ${undefined} | ${'Cannot load data from Excel, excel context is [undefined]'}
  ${{}}        | ${undefined} | ${undefined} | ${'Cannot load data from Excel, item.object is [undefined]'}
  ${{}}        | ${{}}        | ${undefined} | ${'Cannot load data from Excel, item.key is [undefined]'}
  
  `('should throw an Error on invalid data - loadExcelDataSingle', async ({ excelContext, object, key, msg }) => {
    // when
    let result;
    try {
      result = await officeApiDataLoader.loadExcelDataSingle(excelContext, object, key);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(msg);
      expect(result).toBeUndefined();
    }
  });

  it('should call loadExcelData and return mock value', async () => {
    // given
    const mockLoadExcelData = jest.spyOn(officeApiDataLoader, 'loadExcelData').mockImplementation(
      () => ({ testKey: 'testValue' })
    );

    // when
    const result = await officeApiDataLoader.loadExcelDataSingle(undefined, undefined, 'testKey');

    // then
    expect(mockLoadExcelData).toBeCalledTimes(1);
    expect(result).toEqual('testValue');
  });

  it.each`
  excelContext | items                     | msg
  
  ${undefined} | ${undefined}              | ${'Cannot load data from Excel, excel context is [undefined]'}
  ${{}}        | ${[undefined]}            | ${'Cannot load data from Excel, item is [undefined]'}
  ${{}}        | ${[{}]}                   | ${'Cannot load data from Excel, item.object is [undefined]'}
  ${{}}        | ${[{ key: 'key' }]}       | ${'Cannot load data from Excel, item.object is [undefined]'}
  ${{}}        | ${[{ object: 'object' }]} | ${'Cannot load data from Excel, item.key is [undefined]'}
  
  `('should throw an Error on invalid data - loadExcelData', async ({ excelContext, items, msg }) => {
    // when
    let result;
    try {
      result = await officeApiDataLoader.loadExcelData(excelContext, items);
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(msg);
      expect(result).toBeUndefined();
    }
  });

  it('should return empty map when empty items given', async () => {
    // when
    const result = await officeApiDataLoader.loadExcelData({}, []);

    // then
    expect(result).toEqual({});
  });

  it('should work correctly for 1 item, 1 object', async () => {
    // given
    const mockValidateExcelContext = jest.spyOn(officeApiDataLoader, 'validateExcelContext');
    const mockValidateItem = jest.spyOn(officeApiDataLoader, 'validateItem');
    const mockSync = jest.fn();
    const mockExcelContext = {
      sync: mockSync,
    };
    const mockLoad = jest.fn();
    const mockObject = {
      load: mockLoad,
      testKey: 'testValue',
    };

    // when
    const result = await officeApiDataLoader.loadExcelData(mockExcelContext, [{ object: mockObject, key: 'testKey' }]);

    // then
    expect(result).toEqual({ testKey: 'testValue' });
    expect(mockValidateExcelContext).toHaveBeenCalledTimes(1);
    expect(mockValidateItem).toHaveBeenCalledTimes(1);
    expect(mockSync).toHaveBeenCalledTimes(1);
    expect(mockLoad).toHaveBeenCalledTimes(1);
  });

  it('should work correctly for many items, 1 object', async () => {
    // given
    const mockValidateExcelContext = jest.spyOn(officeApiDataLoader, 'validateExcelContext');
    const mockValidateItem = jest.spyOn(officeApiDataLoader, 'validateItem');
    const mockSync = jest.fn();
    const mockExcelContext = {
      sync: mockSync,
    };
    const mockLoad = jest.fn();
    const mockObject = {
      load: mockLoad,
      testKeyOne: 'testValueOne',
      testKeyTwo: 'testValueTwo',
    };

    // when
    const result = await officeApiDataLoader.loadExcelData(mockExcelContext, [
      {
        object: mockObject,
        key: 'testKeyOne'
      },
      {
        object: mockObject,
        key: 'testKeyTwo'
      }
    ]);

    // then
    expect(result).toEqual(
      {
        testKeyOne: 'testValueOne',
        testKeyTwo: 'testValueTwo'
      },
    );
    expect(mockValidateExcelContext).toHaveBeenCalledTimes(1);
    expect(mockValidateItem).toHaveBeenCalledTimes(2);
    expect(mockSync).toHaveBeenCalledTimes(1);
    expect(mockLoad).toHaveBeenCalledTimes(2);
  });

  it('should work correctly for many items, many object', async () => {
    // given
    const mockValidateExcelContext = jest.spyOn(officeApiDataLoader, 'validateExcelContext');
    const mockValidateItem = jest.spyOn(officeApiDataLoader, 'validateItem');
    const mockSync = jest.fn();
    const mockExcelContext = { sync: mockSync, };
    const mockLoadOne = jest.fn();
    const mockLoadTwo = jest.fn();
    const mockObjectOne = {
      load: mockLoadOne,
      testKeyOne: 'testValueOne',
    };
    const mockObjectTwo = {
      load: mockLoadTwo,
      testKeyTwo: 'testValueTwo',
    };

    // when
    const result = await officeApiDataLoader.loadExcelData(mockExcelContext, [
      {
        object: mockObjectOne,
        key: 'testKeyOne'
      },
      {
        object: mockObjectTwo,
        key: 'testKeyTwo'
      }
    ]);

    // then
    expect(result).toEqual(
      {
        testKeyOne: 'testValueOne',
        testKeyTwo: 'testValueTwo'
      },
    );
    expect(mockValidateExcelContext).toHaveBeenCalledTimes(1);
    expect(mockValidateItem).toHaveBeenCalledTimes(2);
    expect(mockSync).toHaveBeenCalledTimes(1);
    expect(mockLoadOne).toHaveBeenCalledTimes(1);
    expect(mockLoadTwo).toHaveBeenCalledTimes(1);
  });
});
