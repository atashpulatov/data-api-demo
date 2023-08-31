import { sessionHelper } from '../../storage/session-helper';
import { homeHelper } from '../../home/home-helper';
import { reduxStore } from '../../store';
import { sessionActions } from '../../redux-reducer/session-reducer/session-actions';
import officeStoreRestoreObject from '../../office/store/office-store-restore-object';
import { configActions } from '../../redux-reducer/config-reducer/config-actions';

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
});
