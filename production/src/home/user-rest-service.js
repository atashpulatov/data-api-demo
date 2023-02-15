import request from 'superagent';

class UserRestService {
  getUserInfo = (authToken, envUrl) => request
    .get(`${envUrl}/sessions/userInfo`)
    .set('x-mstr-authToken', authToken)
    .withCredentials()
    .then((res) => res.body);
}

export const userRestService = new UserRestService();
