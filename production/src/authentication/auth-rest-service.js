import { moduleProxy } from '../module-proxy.js';

const OFFICE_PRIVILEGE_ID = '273';

class AuthenticationService {
  async authenticate(username, password, envUrl, loginMode = 1) {
    return await moduleProxy.request
      .post(`${envUrl}/auth/login`)
      .send({ username, password, loginMode })
      .withCredentials()
      .then((res) => res.headers['x-mstr-authtoken']);
  }

  logout = async (envUrl, authToken) => await moduleProxy.request
    .post(`${envUrl}/auth/logout`)
    .set('x-mstr-authtoken', authToken)
    .withCredentials()
    .then((res) => true)

  getSessions = async (envUrl, authToken) => await moduleProxy.request
    .put(`${envUrl}/sessions`)
    .set('x-mstr-authtoken', authToken)
    .withCredentials()
    .then((res) => res)

  getOfficePrivilege = async (envUrl, iSession) => {
    try {
      const response = await this._fetchPrivilegeById(OFFICE_PRIVILEGE_ID, envUrl, iSession);
      // Only return false if isUserLevelAllowed exists and is false
      if (!response) return true;
      if (response.isUserLevelAllowed === false) {
        if (response.projects.find((project) => project.isAllowed === true)) return true;
      }
      return response.isUserLevelAllowed === true;
    } catch (error) {
      console.error(error);
      // In case of errors skip privilege check (not supported environments)
      return true;
    }
  }

  _fetchPrivilegeById = (id, envUrl, authToken) => moduleProxy.request
    .get(`${envUrl}/sessions/privileges/${id}`)
    .set('x-mstr-authtoken', authToken)
    .withCredentials()
    .then((res) => res.body)
}

export const authenticationService = new AuthenticationService();
