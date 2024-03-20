import request from 'superagent';

class UserRestService {
  reduxStore: any;

  init(reduxStore: any): void {
    this.reduxStore = reduxStore;
  }

  getUserInfo(authToken: string, envUrl: string): any {
    return request
      .get(`${envUrl}/sessions/userInfo`)
      .set('x-mstr-authToken', authToken)
      .withCredentials()
      .then(res => res.body);
  }

  getUserPreference(preferenceName: string): any {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/preferences/user/${preferenceName}`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then(res => res.body);
  }

  setUserPreference(preferenceName: string, preferenceValue: any): any {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/preferences/user/${preferenceName}?value=${preferenceValue}`;

    return request
      .put(fullPath)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then(res => res.body);
  }
}

export const userRestService = new UserRestService();
