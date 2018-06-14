import di from './auth-di.js';

async function _authenticate(username, password, envUrl, loginMode = 1) {
    return await di.request.post(envUrl + '/auth/login')
        .send({ username, password, loginMode })
        .withCredentials()
        .then((res) => {
            return res.headers['x-mstr-authtoken'];
        })
        .catch((err) => {
            console.error(`Error: ${err.response.status}`
                + ` (${err.response.statusMessage})`);
        });
}

export default {
    'authenticate': _authenticate,
};
