import React, { Component } from 'react';
import credentials from './Credentials';
const request = require('superagent');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            envUrl: '',
            authMode: ''
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
        //const envUrl = this.state.envUrl;
        request.get(envUrl + '/status').withCredentials()
            .then(() => {
                console.log(`+ Able to connect to the Admin REST Server: ${envUrl}`);
            })
            .then(() => {

                //-------- only for debugging
                const credentials = require('./Credentials');
                const username = credentials.username;
                const password = credentials.password;
                const envUrl = credentials.envUrl;
                const loginMode = credentials.loginMode;
                //-------------------

                return request.post(envUrl + '/auth/login').send({ username, password, loginMode });
            })
            .then(res => {
                console.log(res);
                const authToken = res.headers['x-mstr-authtoken'];
                sessionStorage.setItem('x-mstr-authtoken', authToken);
                console.log(sessionStorage.getItem('x-mstr-authtoken'))
                return authToken;
            })
            .then(token => {
                return request.get(envUrl + '/folders').set('x-mstr-authtoken', token);
            })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.error(`Error: ${err.status} (${err.message})`);
            });
    }

    render() {
        return (
            <form onSubmit={this.onLoginUser}>
                <div className='grid-container'>
                    <label className='grid-item'>
                        Username:
                    </label>
                    <input className='grid-item' type='text' value={this.state.username} onChange={this.handleUsernameChange} name='username' />

                    {/* <br /> */}
                    <label className='grid-item'>
                        Password:
                    </label>
                    <input className='grid-item' type='password' value={this.state.password} onChange={this.handlePasswordChange} name='password' />

                    {/* <br /> */}
                    <label className='grid-item'>
                        Environment URL:
                    </label>
                    <input className='grid-item' type='text' value={this.state.envUrl} onChange={this.handleEnvURLChange} name='envUrl' />

                    {/* <br /> */}
                    <label className='grid-item'>
                        Auth Mode:
                    </label>
                    <input className='grid-item' type='number' value={this.state.authMode} onChange={this.handleAuthModeChange} name='envUrl' />

                    {/* <br /> */}
                    <input className='grid-item-2 button-submit' type='submit' value='Submit' />
                </div>
            </form>
        )
    }


}

export default Login;