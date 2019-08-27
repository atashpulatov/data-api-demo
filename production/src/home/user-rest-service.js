import request from 'superagent';

class UserRestService {
  getUserInfo = async (authToken, envUrl) => {
    return request
      .get(`${envUrl}/sessions/userInfo`)
      .set('x-mstr-authToken', authToken)
      .withCredentials()
      .then((res) => {
        return res.body;
      });
  }
}

export const userRestService = new UserRestService();

