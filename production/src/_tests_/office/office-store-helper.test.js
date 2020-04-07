import { RunOutsideOfficeError } from '../../error/run-outside-office-error';
import officeStoreHelper from '../../office/store/office-store-helper';
import { errorService } from '../../error/error-handler';

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

describe('OfficeStoreHelper', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('setFileSecuredFlag should handle exception', () => {
    // given
    const getOfficeSettingsMock = jest.spyOn(officeStoreHelper, 'getOfficeSettings')
      .mockImplementation(() => { throw new Error('errorTest'); });

    const handleErrorMock = jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    officeStoreHelper.setFileSecuredFlag();

    // then
    expect(getOfficeSettingsMock).toThrowError(Error);
    expect(getOfficeSettingsMock).toThrowError('errorTest');

    expect(handleErrorMock).toBeCalledTimes(1);
    expect(handleErrorMock).toBeCalledWith(new Error('errorTest'));
  });

  it('setFileSecuredFlag should work as expected', () => {
    // given
    const settingsMock = {
      set: jest.fn(),
      saveAsync: jest.fn(),
    };
    const getOfficeSettingsMock = jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    // when
    officeStoreHelper.setFileSecuredFlag('valueTest');

    // then
    expect(getOfficeSettingsMock).toBeCalledTimes(1);

    expect(settingsMock.set).toBeCalledTimes(1);
    expect(settingsMock.set).toBeCalledWith('isSecured', 'valueTest');

    expect(settingsMock.saveAsync).toBeCalledTimes(1);
  });

  it('isFileSecured should handle exception', () => {
    // given
    const getOfficeSettingsMock = jest.spyOn(officeStoreHelper, 'getOfficeSettings')
      .mockImplementation(() => { throw new Error('errorTest'); });

    const handleErrorMock = jest.spyOn(errorService, 'handleError').mockImplementation();

    // when
    officeStoreHelper.isFileSecured();

    // then
    expect(getOfficeSettingsMock).toThrowError(Error);
    expect(getOfficeSettingsMock).toThrowError('errorTest');

    expect(handleErrorMock).toBeCalledTimes(1);
    expect(handleErrorMock).toBeCalledWith(new Error('errorTest'));
  });

  it('isFileSecured should work as expected', () => {
    // given
    /* eslint-disable object-curly-newline */
    const settingsMock = {
      get: jest.fn().mockReturnValue('isFileSecuredTest'),
    };
    /* eslint-enable object-curly-newline */

    const getOfficeSettingsMock = jest.spyOn(officeStoreHelper, 'getOfficeSettings').mockReturnValue(settingsMock);

    // when
    const result = officeStoreHelper.isFileSecured();

    // then
    expect(getOfficeSettingsMock).toBeCalledTimes(1);

    expect(settingsMock.get).toBeCalledTimes(1);
    expect(settingsMock.get).toBeCalledWith('isSecured');

    expect(result).toEqual('isFileSecuredTest');
  });
});
