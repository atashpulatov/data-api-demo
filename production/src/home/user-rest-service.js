import request from 'superagent';

class UserRestService {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  getUserInfo = (authToken, envUrl) => request
    .get(`${envUrl}/sessions/userInfo`)
    .set('x-mstr-authToken', authToken)
    .withCredentials()
    .then((res) => res.body);

  getUserPreference = (preferenceName) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/preferences/user/${preferenceName}`;

    return request
      .get(fullPath)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then((res) => res.body);
  };

  setUserPreference = (preferenceName, preferenceValue) => {
    const storeState = this.reduxStore.getState();
    const { envUrl, authToken } = storeState.sessionReducer;
    const fullPath = `${envUrl}/preferences/user/${preferenceName}?value=${preferenceValue}`;

    return request
      .put(fullPath)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then((res) => res.body);
  };
}

export const userRestService = new UserRestService();
