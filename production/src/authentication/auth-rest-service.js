import {errorService} from '../error/error-handler.js';
import {moduleProxy} from '../module-proxy.js';

class AuthenticationService {
  async authenticate(username, password, envUrl, loginMode = 1) {
    return await moduleProxy.request
        .post(envUrl + '/auth/login')
        .send({username, password, loginMode})
        .withCredentials()
        .then((res) => {
          return res.headers['x-mstr-authtoken'];
        })
        .catch((err) => {
          throw errorService.errorRestFactory(err);
        });
  }
  logout = async (envUrl, authToken) => {
    return await moduleProxy.request
        .post(envUrl + '/auth/logout')
        .set('x-mstr-authtoken', authToken)
        .withCredentials()
        .then((res) => {
          return;
        })
        .catch((err) => {
          throw errorService.errorRestFactory(err);
        });
  }
  getSessions = async (envUrl, authToken) => {
    console.log(envUrl);
    console.log(authToken);
    return await moduleProxy.request
        .get(`${envUrl}/sessions/userInfo`)
        .set('x-mstr-authtoken', authToken)
        .withCredentials()
        .then((res) => {
          return;
        })
        .catch((err) => {
          throw errorService.errorRestFactory(err);
        });
  }
}

export const authenticationService = new AuthenticationService();
