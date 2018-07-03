import di from './auth-di.js';
import { UnauthorizedError } from './unauthorized-error.js';
import { EnvironmentNotFoundError } from './environment-not-found-error.js';

async function _authenticate(username, password, envUrl, loginMode = 1) {
    return await di.request.post(envUrl + '/auth/login')
        .send({ username, password, loginMode })
        .withCredentials()
        .then((res) => {
            return res.headers['x-mstr-authtoken'];
        })
        .catch((err) => {
            if (err.response.status === 401) {
                throw new UnauthorizedError();
            }
            if (err.response.status === 404) {
                throw new EnvironmentNotFoundError();
            }
            console.error(`Error: ${err.response.status}`
                + ` (${err.response.statusMessage})`);
        });
}

export default {
    'authenticate': _authenticate,
};
