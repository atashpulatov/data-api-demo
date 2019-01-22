import { errorService } from '../error/error-handler.js';
import { moduleProxy } from '../module-proxy.js';

class AuthenticationService {
    async authenticate(username, password, envUrl, loginMode = 1) {
        return await moduleProxy.request
            .post(envUrl + '/auth/login')
            .send({ username, password, loginMode })
            .withCredentials()
            .then((res) => {
                return res.headers['x-mstr-authtoken'];
            })
            .catch((err) => {
                throw errorService.errorRestFactory(err);
            });
    }
}

export const authenticationService = new AuthenticationService();
