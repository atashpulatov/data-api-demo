import di from './auth-di';


function authenticate(envUrl, username, password, loginMode = 1) {
    return request.post(envUrl + '/auth/login')
        .send({ username, password, loginMode })
        .withCredentials()
        .then((res) => {
            console.log(res);
            const authToken = res.headers['x-mstr-authtoken'];
            sessionStorage.setItem('x-mstr-authtoken', authToken);
        })
        .catch((err) => {
            console.error(`Error: ${err.response.status}`
                + ` (${err.response.statusMessage})`);
        });
}