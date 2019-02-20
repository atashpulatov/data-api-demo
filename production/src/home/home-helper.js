import { reduxStore } from '../store';
import { sessionHelper } from '../storage/session-helper';

class HomeHelper {
  saveLoginValues = () => {
    const token = reduxStore.getState().sessionReducer.authToken;
    if (window.location.origin.search('localhost') !== -1) {
      if (!token) {
        sessionHelper.logOut();
        return;
      }
    } else {
      const envUrl = `${window.location.origin}/MicroStrategyLibrary/api`;
      const values = {
        envUrl,
      };
      sessionHelper.saveLoginValues(values);
    }
  };

  getCookiesToArray = () => {
    const cookieJar = document.cookie;
    const splittedCookies = cookieJar.split(';');
    return splittedCookies.map((cookie) => {
      const slicedCookie = cookie.split('=');
      return {
        name: slicedCookie[0],
        value: slicedCookie[1],
      };
    });
  };

  saveTokenFromCookies = () => {
    const splittedCookiesJar = this.getCookiesToArray();
    const authToken = splittedCookiesJar.filter((cookie) => {
      return cookie.name === ' iSession';
    });
    if (authToken[0]) {
      sessionHelper.logIn(authToken[0].value);
    }
  };
}

export const homeHelper = new HomeHelper();
