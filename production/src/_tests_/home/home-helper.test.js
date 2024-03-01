import { sessionHelper } from '../../storage/session-helper';
import { homeHelper } from '../../home/home-helper';
import { reduxStore } from '../../store';
import { sessionActions } from '../../redux-reducer/session-reducer/session-actions';
import officeStoreRestoreObject from '../../office/store/office-store-restore-object';
import { configActions } from '../../redux-reducer/config-reducer/config-actions';
import { officeContext } from '../../office/office-context';
import { officeShapeApiHelper } from '../../office/shapes/office-shape-api-helper';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import { objectImportType } from '../../mstr-object/constants';

jest.mock('../../storage/session-helper');
jest.mock('../../redux-reducer/session-reducer/session-actions');

describe('HomeHelper', () => {
  beforeAll(() => {
    homeHelper.init(reduxStore, sessionActions, sessionHelper);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('saveLoginValues', () => {
    it('should trigger logout because of missing authToken and running on localhost', () => {
      // given
      jest.spyOn(sessionHelper, 'isDevelopment').mockReturnValueOnce(true);
      sessionActions.logOut = jest.fn();
      // when
      homeHelper.saveLoginValues();
      // then
      expect(sessionActions.logOut).toBeCalled();
    });
    it('should return', () => {
      // given
      sessionActions.logOut = jest.fn();
      jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({ sessionReducer: { authToken: 'someToken', }, });
      // when
      homeHelper.saveLoginValues();
      // then
      expect(sessionActions.logOut).not.toBeCalled();
    });
    it('prepare envUrl and save it to store', () => {
      // given
      jest.spyOn(homeHelper, 'getWindowLocation').mockReturnValueOnce({
        origin: 'https://some-env.microstrategy.com/',
        pathname: 'MicroStrategyLibrary/apps/addin-mstr-office/index.html?source=addin-mstr-office',
      });
      sessionActions.logOut = jest.fn();
      jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({ sessionReducer: { authToken: 'someToken', }, });
      const expectedCalledUrl = { envUrl: 'https://some-env.microstrategy.com/MicroStrategyLibrary/api', };
      // when
      homeHelper.saveLoginValues();
      // then
      expect(sessionActions.logOut).not.toBeCalled();
      expect(sessionActions.saveLoginValues).toBeCalled();
      expect(sessionActions.saveLoginValues).toBeCalledWith(expectedCalledUrl);
    });
  });
  describe('getParsedCookies', () => {
    it('should cookie', () => {
      // given
      const exampleToken = 'someToken';
      const exampleCookies = `someCookie=1; otherCookie=1; iSession=${exampleToken}`;
      const expectedCookieArray = {
        someCookie: '1',
        otherCookie: '1',
        iSession: exampleToken,
      };
      jest.spyOn(homeHelper, 'getDocumentCookie').mockReturnValueOnce(exampleCookies);
      // when
      const resultCookieArray = homeHelper.getParsedCookies();
      // then
      expect(resultCookieArray).toEqual(expectedCookieArray);
    });
  });
  describe('getTokenFromStorage', () => {
    it('should not save when there is no iSession', () => {
      // given
      const iSession = null;
      jest.spyOn(homeHelper, 'getStorageItem')
        .mockReturnValueOnce(iSession);
      jest.spyOn(officeStoreRestoreObject, 'getExcelSettingValue')
        .mockReturnValueOnce(iSession);
      // when
      homeHelper.getTokenFromStorage();
      // then
      expect(sessionActions.logIn).not.toBeCalled();
    });
    it('should save authToken when there is iSession in Excel settings', () => {
      // given
      const iSession = 'token';
      jest.spyOn(homeHelper, 'getStorageItem')
        .mockReturnValueOnce(null);
      jest.spyOn(officeStoreRestoreObject, 'getExcelSettingValue')
        .mockReturnValueOnce(iSession);
      // when
      homeHelper.getTokenFromStorage();
      // then
      expect(sessionActions.logIn).toBeCalled();
      expect(sessionActions.logIn).toBeCalledWith(iSession);
    });
    it('should save authToken when there is iSession in storage', () => {
      // given
      const iSession = 'token';
      jest.spyOn(homeHelper, 'getStorageItem')
        .mockReturnValueOnce(iSession);
      // when
      homeHelper.getTokenFromStorage();
      // then
      expect(sessionActions.logIn).toBeCalled();
      expect(sessionActions.logIn).toBeCalledWith(iSession);
    });
    it('should return window location', () => {
      // given
      const locationHelper = jest.spyOn(homeHelper, 'getWindowLocation');
      // when
      const location = homeHelper.getWindowLocation();
      // then
      expect(locationHelper).toBeCalled();
      expect(location).toBeTruthy();
    });
    it('should return document cookie', () => {
      // given
      const cookieHelper = jest.spyOn(homeHelper, 'getDocumentCookie');
      // when
      homeHelper.getDocumentCookie();
      // then
      expect(cookieHelper).toBeCalled();
    });
  });

  describe('storeShowHidden', () => {
    it.each`
    excelSettingValue | localStorageValue | expectedShowHiddenPayload
    ${true}           | ${'true'}         | ${true}
    ${false}          | ${'false'}        | ${false}
    ${undefined}      | ${'true'}         | ${true}
    ${true}           | ${''}             | ${true}
    ${undefined}      | ${''}             | ${true}
    `('should dispatch setSHowHidden action with correct payload', ({ excelSettingValue, localStorageValue, expectedShowHiddenPayload }) => {
      // given
      jest.spyOn(officeStoreRestoreObject, 'getExcelSettingValue').mockReturnValue(excelSettingValue);
      jest.spyOn(homeHelper, 'getStorageItem').mockReturnValue(localStorageValue);
      const actionPayloadSpy = jest.spyOn(configActions, 'setShowHidden');
      const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

      // when
      homeHelper.storeShowHidden();

      // then
      expect(actionPayloadSpy).toHaveBeenCalledWith(expectedShowHiddenPayload);
      expect(mockedDispatch).toBeCalledTimes(1);
    });
  });

  describe('initIsShapeAPISupported', () => {
    it('should return true if shape API is supported', () => {
      // given
      const windowSpy = jest.spyOn(global, 'window', 'get');
      windowSpy.mockImplementation(() => ({
        Office: {
          context: {
            requirements: {
              isSetSupported: () => true
            }
          }
        }
      }));

      jest.spyOn(officeContext, 'isSetSupported').mockImplementation();

      jest.spyOn(homeHelper.reduxStore, 'dispatch').mockImplementation();

      homeHelper.init(reduxStore, {}, {});
      // when
      homeHelper.initIsShapeAPISupported();
      expect(officeContext.isSetSupported).toBeCalled();
      expect(homeHelper.reduxStore.dispatch).toBeCalled();
    });
  });

  describe('secureData()', () => {
    it('should skip clearDataRequested() dispatch for image object.', async () => {
      // given
      const excelContextMock = {
        workbook: {
          worksheets: [{}],
        }
      };

      const objects = [
        {
          importType: objectImportType.IMAGE,
          bindId: '{778543A2-0A92-DBB4-E471-1C55D2C48DFF}',
          objectWorkingId: 1709325494755,
        },
        {
          importType: objectImportType.TABLE,
          bindId: '{45E0499F-6C8A-4909-AF68-40C7A293ACA1}',
          objectWorkingId: 1709325744657
        }
      ];

      jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => Promise.resolve(excelContextMock));

      jest.spyOn(officeApiWorksheetHelper, 'checkIfAnySheetProtected').mockImplementation();

      jest.spyOn(officeShapeApiHelper, 'getShape').mockImplementation(() => undefined);

      jest.spyOn(homeHelper.reduxStore, 'dispatch').mockImplementation();

      homeHelper.init(reduxStore, {}, {});
      // when

      setTimeout(async () => {
        await homeHelper.secureData(objects);

        expect(officeApiHelper.getExcelContext).toHaveBeenCalled();
        expect(officeShapeApiHelper.getShape).toHaveBeenCalledWith(excelContextMock, '{778543A2-0A92-DBB4-E471-1C55D2C48DFF}');
        expect(homeHelper.reduxStore.dispatch).toHaveBeenCalledTimes(1);
      }, 0);
    });
  });
});
