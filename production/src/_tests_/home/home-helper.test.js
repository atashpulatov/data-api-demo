import { sessionHelper } from '../../storage/session-helper';
import { homeHelper } from '../../home/home-helper';
import { reduxStore } from '../../store';

jest.mock('../../storage/session-helper');

describe('HomeHelper', () => {
  beforeAll(() => {
    homeHelper.init(reduxStore, sessionHelper);
  });
  describe('saveLoginValues', () => {
    it('should trigger logout because of missing authToken and running on localhost', () => {
      // given
      jest.spyOn(sessionHelper, 'isDevelopment').mockReturnValueOnce(true);
      sessionHelper.logOut = jest.fn();
      // when
      homeHelper.saveLoginValues();
      // then
      expect(sessionHelper.logOut).toBeCalled();
    });
    it('should return', () => {
      // given
      sessionHelper.logOut = jest.fn();
      jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({ sessionReducer: { authToken: 'someToken', }, });
      // when
      homeHelper.saveLoginValues();
      // then
      expect(sessionHelper.logOut).not.toBeCalled();
    });
    it('prepare envUrl and save it to store', () => {
      // given
      jest.spyOn(homeHelper, 'getWindowLocation').mockReturnValueOnce({
        origin: 'https://some-env.microstrategy.com/',
        pathname: 'MicroStrategyLibrary/apps/addin-mstr-office/index.html?source=addin-mstr-office',
      });
      sessionHelper.logOut = jest.fn();
      jest.spyOn(reduxStore, 'getState').mockReturnValueOnce({ sessionReducer: { authToken: 'someToken', }, });
      const expectedCalledUrl = { envUrl: 'https://some-env.microstrategy.com/MicroStrategyLibrary/api', };
      // when
      homeHelper.saveLoginValues();
      // then
      expect(sessionHelper.logOut).not.toBeCalled();
      expect(sessionHelper.saveLoginValues).toBeCalled();
      expect(sessionHelper.saveLoginValues).toBeCalledWith(expectedCalledUrl);
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
  describe('saveTokenFromCookies', () => {
    it('should not save when there is no iSession cookie', () => {
      // given
      const cookieJarWithoutToken = {
        someCookie: 'someCookieValue',
        otherCookie: 'otherCookieValue',
      };
      jest.spyOn(homeHelper, 'getParsedCookies')
        .mockReturnValueOnce(cookieJarWithoutToken);
      // when
      homeHelper.saveTokenFromCookies();
      // then
      expect(sessionHelper.logIn).not.toBeCalled();
    });
    it('should save authToken when there is iSession cookie', () => {
      // given
      const cookieJarWithoutToken = {
        someCookie: 'someCookieValue',
        otherCookie: 'otherCookieValue',
        iSession: 'someAuthToken',
      };
      jest.spyOn(homeHelper, 'getParsedCookies')
        .mockReturnValueOnce(cookieJarWithoutToken);
      // when
      homeHelper.saveTokenFromCookies();
      // then
      expect(sessionHelper.logIn).toBeCalled();
      expect(sessionHelper.logIn).toBeCalledWith(cookieJarWithoutToken.iSession);
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
});
