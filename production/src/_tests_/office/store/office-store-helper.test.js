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
    global.Office = {
      context: {
        document: {
          settings: 'settingsTest'
        }
      }
    };
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
    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockImplementation(() => { throw new Error('errorTest'); });

    jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    officeStoreHelper.setPropertyValue(undefined, undefined);

    // then
    expect(officeStoreHelper.getOfficeSettings).toThrowError(Error);
    expect(officeStoreHelper.getOfficeSettings).toThrowError('errorTest');

    expect(errorService.handleError).toBeCalledTimes(1);
    expect(errorService.handleError).toBeCalledWith(new Error('errorTest'));
  });

  it('setPropertyValue should work as expected', () => {
    // given
    const settingsMock = {
      set: jest.fn(),
      saveAsync: jest.fn(),
    };
    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    // when
    officeStoreHelper.setPropertyValue('propertyNameTest', 'valueTest');

    // then
    expect(officeStoreHelper.getOfficeSettings).toBeCalledTimes(1);

    expect(settingsMock.set).toBeCalledTimes(1);
    expect(settingsMock.set).toBeCalledWith('propertyNameTest', 'valueTest');

    expect(settingsMock.saveAsync).toBeCalledTimes(1);
  });

  it('getPropertyValue should handle exception', () => {
    // given
    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockImplementation(() => { throw new Error('errorTest'); });

    jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    officeStoreHelper.getPropertyValue();

    // then
    expect(officeStoreHelper.getOfficeSettings).toThrowError(Error);
    expect(officeStoreHelper.getOfficeSettings).toThrowError('errorTest');

    expect(errorService.handleError).toBeCalledTimes(1);
    expect(errorService.handleError).toBeCalledWith(new Error('errorTest'));
  });

  it('getPropertyValue should work as expected', () => {
    // given
    const settingsMock = {
      get: jest.fn().mockReturnValue('isFileSecuredTest'),
    };

    jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    // when
    const result = officeStoreHelper.getPropertyValue('propertyNameTest');

    // then
    expect(officeStoreHelper.getOfficeSettings).toBeCalledTimes(1);

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
    jest.spyOn(officeStoreHelper, 'setPropertyValue').mockImplementation();

    // when
    officeStoreHelper[setterNameParam]('valueTest');

    // then
    expect(officeStoreHelper.setPropertyValue).toBeCalledTimes(1);
    expect(officeStoreHelper.setPropertyValue).toBeCalledWith(expectedPropertyName, 'valueTest');
  });

  it.each`
  propertyNameParam      | getterNameParam
  
  ${'isSecured'}         | ${'isFileSecured'}
  ${'isClearDataFailed'} | ${'isClearDataFailed'}
  
  `('getters should work as expected',
  ({ propertyNameParam, getterNameParam }) => {
    // given
    jest.spyOn(officeStoreHelper, 'getPropertyValue').mockReturnValue('valueTest');

    // when
    const result = officeStoreHelper[getterNameParam](propertyNameParam);

    // then
    expect(officeStoreHelper.getPropertyValue).toBeCalledTimes(1);
    expect(officeStoreHelper.getPropertyValue).toBeCalledWith(propertyNameParam);

    expect(result).toEqual('valueTest');
  });
});
