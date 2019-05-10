import {errorService} from '../error/error-handler.js';
import {moduleProxy} from '../module-proxy.js';

const OFFICE_PRIVILEGE_ID = '273';

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
    return await moduleProxy.request
        .get(`${envUrl}/sessions/userInfo`)
        .set('x-mstr-authtoken', authToken)
        .withCredentials()
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw errorService.errorRestFactory(err);
        });
  }

  getOfficePrivilege = async (envUrl, iSession) => {
    try {
      const response = await this._fetchPrivilegeById(OFFICE_PRIVILEGE_ID, envUrl, iSession);
      return response && response.isUserLevelAllowed;
    } catch (error) {
      console.error(error);
      // In case of errors skip privilege check (not supported environments)
      return true;
    }
  }

  _fetchPrivilegeById = (id, envUrl, authToken) => {
    return moduleProxy.request
        .get(`${envUrl}/sessions/privileges/${id}`)
        .set('x-mstr-authtoken', authToken)
        .withCredentials()
        .then((res) => {
          return res.body;
        });
  }
}

export const authenticationService = new AuthenticationService();
