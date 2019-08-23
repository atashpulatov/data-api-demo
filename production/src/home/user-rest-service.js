import request from 'superagent';
import {errorService} from '../error/error-handler';

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

