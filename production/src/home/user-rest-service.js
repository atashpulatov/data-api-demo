import request from 'superagent';

class UserRestService {
  getUserData = async (authToken, envUrl) => {
    if (authToken && envUrl) {
      return request
          .get(`${envUrl}/sessions/userInfo`)
          .set('x-mstr-authToken', authToken)
          .withCredentials()
          .then((res) => {
            return res.body;
          })
          .catch((err) => {
            console.error(err);
          });
    }
  }
}

export const userRestService = new UserRestService();

