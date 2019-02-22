import {reduxStore} from '../store';
import {sessionHelper} from '../storage/session-helper';

class HomeHelper {
  saveLoginValues = () => {
    const token = reduxStore.getState().sessionReducer.authToken;
    const location = this.getWindowLocation();
    if (location.origin.search('localhost') !== -1) {
      if (!token) {
        sessionHelper.logOut();
        return;
      }
    } else {
      const envUrl = `${location.origin}/MicroStrategyLibrary/api`;
      const values = {
        envUrl,
      };
      sessionHelper.saveLoginValues(values);
    }
  };

  getParsedCookies = () => {
    const cookieJar = this.getDocumentCookie();
    return cookieJar.split(';')
        .reduce((res, c) => {
          const [key, val] = c.trim().split('=').map(decodeURIComponent);
          const allNumbers = (str) => /^\d+$/.test(str);
          try {
            return Object.assign(res, {[key]: allNumbers(val) ? val : JSON.parse(val)});
          } catch (e) {
            return Object.assign(res, {[key]: val});
          }
        }, {});
  };

  saveTokenFromCookies = () => {
    const splittedCookiesJar = this.getParsedCookies();
    if (splittedCookiesJar.iSession) {
      sessionHelper.logIn(splittedCookiesJar.iSession);
    }
  };

  getWindowLocation = () => {
    return window.location;
  }

  getDocumentCookie = () => {
    return document.cookie;
  }
}

export const homeHelper = new HomeHelper();
