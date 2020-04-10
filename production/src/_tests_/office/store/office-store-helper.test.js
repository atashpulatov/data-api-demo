import { RunOutsideOfficeError } from '../../../error/run-outside-office-error';
import officeStoreHelper from '../../../office/store/office-store-helper';
import { errorService } from '../../../error/error-handler';

describe.each`
officeParam

${undefined}
${{}}
${{ context: undefined }}
${{ context: {} }}
${{ context: { document: undefined } }}
${{ context: { document: {} } }}

`('OfficeStoreHelper getOfficeSettings negative path', ({ officeParam }) => {
  const globalOfficeOriginal = global.Office;

  beforeEach(() => {
    global.Office = officeParam;
  });

  afterEach(() => {
    global.Office = globalOfficeOriginal;
  });

  it('getOfficeSettings should work as expected when Office initialized correctly', () => {
    // given
    let result;

    // when
    try {
      result = officeStoreHelper.getOfficeSettings();
    } catch (error) {
      // then
      expect(error).toBeInstanceOf(RunOutsideOfficeError);
    }

    expect(result).toBeUndefined();
  });
});

describe('OfficeStoreHelper getOfficeSettings positive path', () => {
  const globalOfficeOriginal = global.Office;

  beforeAll(() => {
    /* eslint-disable object-curly-newline */
    global.Office = {
      context: {
        document: {
          settings: 'settingsTest'
        }
      }
    };
    /* eslint-enable object-curly-newline */
  });

  afterAll(() => {
    global.Office = globalOfficeOriginal;
  });

  it('getOfficeSettings should work as expected when Office initialized correctly', () => {
    // given
    // when
    const result = officeStoreHelper.getOfficeSettings();

    // then
    expect(result).toEqual('settingsTest');
  });
});

describe('OfficeStoreHelper setters', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('setPropertyValue should handle exception', () => {
    // given
    const getOfficeSettingsMock = jest.spyOn(officeStoreHelper, 'getOfficeSettings')
      .mockImplementation(() => { throw new Error('errorTest'); });

    const handleErrorMock = jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    officeStoreHelper.setPropertyValue(undefined, undefined);

    // then
    expect(getOfficeSettingsMock).toThrowError(Error);
    expect(getOfficeSettingsMock).toThrowError('errorTest');

    expect(handleErrorMock).toBeCalledTimes(1);
    expect(handleErrorMock).toBeCalledWith(new Error('errorTest'));
  });

  it('setPropertyValue should work as expected', () => {
    // given
    const settingsMock = {
      set: jest.fn(),
      saveAsync: jest.fn(),
    };
    const getOfficeSettingsMock = jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    // when
    officeStoreHelper.setPropertyValue('propertyNameTest', 'valueTest');

    // then
    expect(getOfficeSettingsMock).toBeCalledTimes(1);

    expect(settingsMock.set).toBeCalledTimes(1);
    expect(settingsMock.set).toBeCalledWith('propertyNameTest', 'valueTest');

    expect(settingsMock.saveAsync).toBeCalledTimes(1);
  });

  it('getPropertyValue should handle exception', () => {
    // given
    const getOfficeSettingsMock = jest.spyOn(officeStoreHelper, 'getOfficeSettings')
      .mockImplementation(() => { throw new Error('errorTest'); });

    const handleErrorMock = jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    officeStoreHelper.getPropertyValue();

    // then
    expect(getOfficeSettingsMock).toThrowError(Error);
    expect(getOfficeSettingsMock).toThrowError('errorTest');

    expect(handleErrorMock).toBeCalledTimes(1);
    expect(handleErrorMock).toBeCalledWith(new Error('errorTest'));
  });

  it('getPropertyValue should work as expected', () => {
    // given
    /* eslint-disable object-curly-newline */
    const settingsMock = {
      get: jest.fn().mockReturnValue('isFileSecuredTest'),
    };
    /* eslint-enable object-curly-newline */

    const getOfficeSettingsMock = jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    // when
    const result = officeStoreHelper.getPropertyValue('propertyNameTest');

    // then
    expect(getOfficeSettingsMock).toBeCalledTimes(1);

    expect(settingsMock.get).toBeCalledTimes(1);
    expect(settingsMock.get).toBeCalledWith('propertyNameTest');

    expect(result).toEqual('isFileSecuredTest');
  });
});

describe('OfficeStoreHelper getters', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each`
  expectedPropertyName   | setterNameParam
  
  ${'isSecured'}         | ${'setFileSecuredFlag'}
  ${'isClearDataFailed'} | ${'setIsClearDataFailed'}
  
  `('setters should work as expected',
  ({ expectedPropertyName, setterNameParam }) => {
    // given
    const setPropertyValueMock = jest.spyOn(officeStoreHelper, 'setPropertyValue').mockImplementation();

    // when
    officeStoreHelper[setterNameParam]('valueTest');

    // then
    expect(setPropertyValueMock).toBeCalledTimes(1);
    expect(setPropertyValueMock).toBeCalledWith(expectedPropertyName, 'valueTest');
  });

  it.each`
  propertyNameParam      | getterNameParam
  
  ${'isSecured'}         | ${'isFileSecured'}
  ${'isClearDataFailed'} | ${'isClearDataFailed'}
  
  `('getters should work as expected',
  ({ propertyNameParam, getterNameParam }) => {
    // given
    const getPropertyValueMock = jest.spyOn(officeStoreHelper, 'getPropertyValue').mockReturnValue('valueTest');

    // when
    const result = officeStoreHelper[getterNameParam](propertyNameParam);

    // then
    expect(getPropertyValueMock).toBeCalledTimes(1);
    expect(getPropertyValueMock).toBeCalledWith(propertyNameParam);

    expect(result).toEqual('valueTest');
  });
});
