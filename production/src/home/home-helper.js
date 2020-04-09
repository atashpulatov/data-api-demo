export class HomeHelper {
  init = (reduxStore, sessionHelper) => {
    this.reduxStore = reduxStore;
    this.sessionHelper = sessionHelper;
  }

  saveLoginValues = () => {
    const { authToken } = this.reduxStore.getState().sessionReducer;
    const location = this.getWindowLocation();
    if (this.sessionHelper.isDevelopment()) {
      if (!authToken) {
        this.sessionHelper.logOut();
      }
    } else {
      const currentPath = location.pathname;
      const pathBeginning = currentPath.split('/apps/')[0];
      const envUrl = `${location.origin}${pathBeginning}/api`;
      const values = { envUrl, };
      this.sessionHelper.saveLoginValues(values);
      return values.envUrl;
    }
  };

  getParsedCookies = () => {
    const cookieJar = this.getDocumentCookie();
    return cookieJar.split(';')
      .reduce((res, c) => {
        const [key, val] = c.trim().split('=').map(decodeURIComponent);
        const allNumbers = (str) => /^\d+$/.test(str);
        try {
          return Object.assign(res, { [key]: allNumbers(val) ? val : JSON.parse(val) });
        } catch (e) {
          return Object.assign(res, { [key]: val });
        }
      }, {});
  };

  saveTokenFromCookies = () => {
    const splittedCookiesJar = this.getParsedCookies();
    if (splittedCookiesJar.iSession) {
      this.sessionHelper.logIn(splittedCookiesJar.iSession);
      return splittedCookiesJar.iSession;
    }
  };

  getWindowLocation = () => window.location

  getDocumentCookie = () => document.cookie
}

export const homeHelper = new HomeHelper();
