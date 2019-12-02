import { moduleProxy } from '../module-proxy';

const OFFICE_PRIVILEGE_ID = '273';

class AuthenticationService {
  constructor(proxy) {
    this.moduleProxy = proxy;
  }

  async authenticate(username, password, envUrl, loginMode = 1) {
    return this.moduleProxy.request
      .post(`${envUrl}/auth/login`)
      .send({ username, password, loginMode })
      .withCredentials()
      .then((res) => res.headers['x-mstr-authtoken']);
  }

  async logout(envUrl, authToken) {
    return this.moduleProxy.request
      .post(`${envUrl}/auth/logout`)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then(() => true);
  }

  async getSessions(envUrl, authToken) {
    return this.moduleProxy.request
      .get(`${envUrl}/sessions/userInfo`)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then((res) => res);
  }

  async putSessions(envUrl, authToken) {
    return this.moduleProxy.request
      .put(`${envUrl}/sessions`)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then((res) => res);
  }

  async getOfficePrivilege(envUrl, iSession) {
    try {
      const response = await this.fetchPrivilegeById(OFFICE_PRIVILEGE_ID, envUrl, iSession);
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

  fetchPrivilegeById(id, envUrl, authToken) {
    return this.moduleProxy.request
      .get(`${envUrl}/sessions/privileges/${id}`)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then((res) => res.body);
  }
}
export const authenticationService = new AuthenticationService(moduleProxy);
