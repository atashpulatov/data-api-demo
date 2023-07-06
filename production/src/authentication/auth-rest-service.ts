import { moduleProxy } from '../module-proxy';

const OFFICE_PRIVILEGE_ID = '273';
const ATTRIBUTE_FORM_PRIVILEGE_ID = '81';

class AuthenticationService {
  moduleProxy: {
      request: any;
      moduleProxy: any;
};

  constructor(proxy: any) {
    this.moduleProxy = proxy;
  }

  authenticate(username: string, password: string, envUrl: string, loginMode = 1) {
    const params = new URLSearchParams({
      loginMode: '1',
      username,
      password,
      applicationType: '47'
    });
    return this.moduleProxy.request
      .post(`${envUrl}/auth/login`)
      .send(params)
      .withCredentials()
      .then((res: any) => res.headers['x-mstr-authtoken']);
  }

  logout(envUrl: string, authToken: string) {
    return this.moduleProxy.request
      .post(`${envUrl}/auth/logout`)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then(() => true);
  }

  getSessions(envUrl: string, authToken: string) {
    return this.moduleProxy.request
      .get(`${envUrl}/sessions/userInfo`)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then((res: any) => res);
  }

  putSessions(envUrl: string, authToken: string) {
    return this.moduleProxy.request
      .put(`${envUrl}/sessions`)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then((res: any) => res);
  }

  async getOfficePrivilege(envUrl: string, iSession: any) {
    try {
      let response;
      if (iSession) { response = await this.fetchPrivilegeById(OFFICE_PRIVILEGE_ID, envUrl, iSession); }
      // Only return false if isUserLevelAllowed exists and is false
      if (!response) { return true; }
      const { isUserLevelAllowed, projects } = response;
      if (isUserLevelAllowed === false) {
        if (projects.find((project: any) => project.isAllowed === true)) { return true; }
      }
      return isUserLevelAllowed === true;
    } catch (error) {
      console.error(error);
      // In case of errors skip privilege check (not supported environments)
      return true;
    }
  }

  async getAttributeFormPrivilege(envUrl: string, iSession: any) {
    try {
      const response = await this.fetchPrivilegeById(ATTRIBUTE_FORM_PRIVILEGE_ID, envUrl, iSession);
      // Only return false if isUserLevelAllowed exists and is false
      if (!response) {
        return false;
      }
      const { isUserLevelAllowed, projects } = response;
      if (isUserLevelAllowed === false) {
        if (projects.find((project: any) => project.isAllowed === true)) { return true; }
      }
      return isUserLevelAllowed === true;
    } catch (error) {
      console.error(error);
      // In case of errors skip privilege check (not supported environments)
      return false;
    }
  }

  fetchPrivilegeById(id: string, envUrl: string, authToken: string) {
    return this.moduleProxy.request
      .get(`${envUrl}/sessions/privileges/${id}`)
      .set('x-mstr-authtoken', authToken)
      .withCredentials()
      .then((res: any) => res.body);
  }
}
export const authenticationService = new AuthenticationService(moduleProxy);
