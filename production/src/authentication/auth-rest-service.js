import { moduleProxy } from '../module-proxy';

const OFFICE_PRIVILEGE_ID = '273';
const ATTRIBUTE_FORM_PRIVILEGE_ID = '81';

class AuthenticationService {
  constructor(proxy) {
    this.moduleProxy = proxy;
  }

  authenticate(username, password, envUrl, loginMode = 1) {
    return this.moduleProxy.request
      .post(`${envUrl}/auth/login`)
      .send({ username, password, loginMode })
      .withCredentials()
      .then((res) => res.headers['x-mstr-authtoken']);
  }

  logout(envUrl, authToken) {
    return this.moduleProxy.request
      .post(`${envUrl}/auth/logout`)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then(() => true);
  }

  getSessions(envUrl, authToken) {
    return this.moduleProxy.request
      .get(`${envUrl}/sessions/userInfo`)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then((res) => res);
  }

  putSessions(envUrl, authToken) {
    return this.moduleProxy.request
      .put(`${envUrl}/sessions`)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then((res) => res);
  }

  async getOfficePrivilege(envUrl, iSession) {
    try {
      let response;
      if (iSession) { response = await this.fetchPrivilegeById(OFFICE_PRIVILEGE_ID, envUrl, iSession); }
      // Only return false if isUserLevelAllowed exists and is false
      if (!response) { return true; }
      const { isUserLevelAllowed, projects } = response;
      if (isUserLevelAllowed === false) {
        if (projects.find((project) => project.isAllowed === true)) { return true; }
      }
      return isUserLevelAllowed === true;
    } catch (error) {
      console.error(error);
      // In case of errors skip privilege check (not supported environments)
      return true;
    }
  }

  async getAttributeFormPrivilege(envUrl, iSession) {
    try {
      const response = await this.fetchPrivilegeById(ATTRIBUTE_FORM_PRIVILEGE_ID, envUrl, iSession);
      // Only return false if isUserLevelAllowed exists and is false
      if (!response) {
        return false;
      }
      const { isUserLevelAllowed, projects } = response;
      if (isUserLevelAllowed === false) {
        if (projects.find((project) => project.isAllowed === true)) { return true; }
      }
      return isUserLevelAllowed === true;
    } catch (error) {
      console.error(error);
      // In case of errors skip privilege check (not supported environments)
      return false;
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
