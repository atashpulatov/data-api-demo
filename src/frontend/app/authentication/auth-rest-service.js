import di from './auth-di.js';

async function _authenticate(username, password, envUrl, loginMode = 1) {
    console.log(envUrl + username + password + loginMode);
    return await di.request.post(envUrl + '/auth/login')
        .send({ username, password, loginMode })
        .withCredentials()
        .then((res) => {
            console.log(res);
            const authToken = res.headers['x-mstr-authtoken'];
            sessionStorage.setItem('x-mstr-authtoken', authToken);
            sessionStorage.setItem('envUrl', envUrl);
        })
        .catch((err) => {
            console.error(`Error: ${err.response.status}`
                + ` (${err.response.statusMessage})`);
        });
}

export default {
    'authenticate': _authenticate,
};
