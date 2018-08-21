import di from './auth-di.js';
import { errorHandler } from '../error/error-service.js';

async function _authenticate(username, password, envUrl, loginMode = 1) {
    return await di.request.post(envUrl + '/auth/login')
        .send({ username, password, loginMode })
        .withCredentials()
        .then((res) => {
            return res.headers['x-mstr-authtoken'];
        })
        .catch((err) => {
            errorHandler(err);
        });
}

export default {
    'authenticate': _authenticate,
};
