import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
const axios = require('axios');
const request = require('superagent');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            envUrl: '',
            authMode: '',
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEnvURLChange = this.handleEnvURLChange.bind(this);
        this.handleAuthModeChange = this.handleAuthModeChange.bind(this);

        this.onLoginUser = this.onLoginUser.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({ username: event.currentTarget.value });
    }
    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }
    handleEnvURLChange(event) {
        this.setState({ envUrl: event.target.value });
    }
    handleAuthModeChange(event) {
        this.setState({ authMode: event.target.value });
    }

    onLoginUser(event) {
        console.log('hello');
        event.preventDefault();
        const credentials = require('./Credentials');
        const envUrl = credentials.envUrl;
        // const envUrl = this.state.envUrl;

        const username = credentials.username;
        const password = credentials.password;
        const loginMode = credentials.loginMode;

        let variant = 'fetch';
        switch (variant) {
            case 'superagent':
                request.post(envUrl + '/auth/login')
                    .send({ username, password, loginMode })
                    .withCredentials()
                    .then((res) => {
                        console.log(res);
                        const authToken = res.headers['x-mstr-authtoken'];
                        sessionStorage.setItem('x-mstr-authtoken', authToken);
                        console.log(sessionStorage.getItem('x-mstr-authtoken'));
                        return authToken;
                    })
                    .then((token) => {
                        return request.get(envUrl + '/projects')
                            .set('x-mstr-authtoken', token)
                            .withCredentials();
                    })
                    .then((res) => {
                        console.log(res.text);
                    })
                    .catch((err) => {
                        console.error(`Error: ${err.response.status}`
                            + ` (${err.response.statusMessage})`);
                    });
                break;
            case 'fetch':
                fetch(envUrl + '/status', {
                    method: 'GET',
                    credentials: 'include', // Including cookie
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        // 'X-Requested-With': 'XMLHttpRequest'
                    },
                })
                    .then((res) => {
                        return fetch(envUrl + '/auth/login', {
                            method: 'POST',
                            credentials: 'include', // Including cookie
                            mode: 'cors', // Setting as cors mode for cross origin
                            headers: {
                                'Content-Type': 'application/json',
                                // 'X-Requested-With': 'XMLHttpRequest'
                            },
                            body: JSON.stringify({
                                username: username,
                                password: password,
                                loginMode: loginMode,
                            }),
                        });
                    })
                    .then((res) => {
                        if (!res.ok) {
                            throw Error(res.statusText);
                        }
                        const authToken = res.headers.get('x-mstr-authtoken');
                        sessionStorage.setItem('x-mstr-authtoken', authToken);
                        console.log(sessionStorage.getItem('x-mstr-authtoken'));
                        return authToken;
                    })
                    .then((token) => {
                        return fetch(envUrl + '/projects', {
                            method: 'GET',
                            credentials: 'include', // Including cookie
                            mode: 'cors', // Setting as cors mode for cross origin
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                                'x-mstr-authtoken': token,
                                // 'X-Requested-With': 'XMLHttpRequest'
                            },
                        });
                    })
                    .then((res) => {
                        if (!res.ok) {
                            throw Error(res.statusText);
                        }
                        return res.json();
                    })
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                        // console.error(`Error: ${err.response.status}`
                        //     + ` (${err.response.statusMessage})`);
                    });
                break;
            case 'axios':
                axios.post(envUrl + '/auth/login',
                    { username, password, loginMode },
                    {
                        withCredentials: true, // Including cookie
                        headers: {
                            'Content-Type': 'application/json',
                            // 'X-Requested-With': 'XMLHttpRequest'
                        },
                    })
                    .then((res) => {
                        console.log(res);
                        const authToken = res.headers['x-mstr-authtoken'];
                        sessionStorage.setItem('x-mstr-authtoken', authToken);
                        console.log(sessionStorage.getItem('x-mstr-authtoken'));
                        return authToken;
                    })
                    .then((token) => {
                        return axios.get(envUrl + '/projects',
                            {
                                withCredentials: true, // Including cookie
                                headers: {
                                    'x-mstr-authtoken': token,
                                },
                            });
                    })
                    .then((res) => {
                        console.log(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                        // console.error(`Error: ${err.response.status}`
                        //     + ` (${err.response.statusMessage})`);
                    });
                break;
        }
    }

    render() {
        return (
            <form onSubmit={this.onLoginUser}>
                <div className='grid-container'>
                    <label className='grid-item'>
                        Username:
                    </label>
                    <input className='grid-item' type='text'
                        value={this.state.username}
                        onChange={this.handleUsernameChange} name='username' />

                    {/* <br /> */}
                    <label className='grid-item'>
                        Password:
                    </label>
                    <input className='grid-item' type='password'
                        value={this.state.password}
                        onChange={this.handlePasswordChange} name='password' />

                    {/* <br /> */}
                    <label className='grid-item'>
                        Environment URL:
                    </label>
                    <input className='grid-item' type='text'
                        value={this.state.envUrl}
                        onChange={this.handleEnvURLChange} name='envUrl' />

                    {/* <br /> */}
                    <label className='grid-item'>
                        Auth Mode:
                    </label>
                    <input className='grid-item' type='number'
                        value={this.state.authMode}
                        onChange={this.handleAuthModeChange} name='envUrl' />

                    {/* <br /> */}
                    <input className='grid-item-2 button-submit'
                        type='submit' value='Submit' />
                </div>
            </form>
        );
    }
}

export default Login;
