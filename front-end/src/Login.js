import React, {  Component } from 'react';
const request = require('superagent');


class Login extends Component{
    constructor(props){
        super(props);
        this.state = {  username: '',
                        password: '',
                        envUrl: '',
                        authMode: ''};

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEnvURLChange = this.handleEnvURLChange.bind(this);
        this.handleAuthModeChange = this.handleAuthModeChange.bind(this);

        this.onLoginUser = this.onLoginUser.bind(this);
    }

    handleUsernameChange(event){
        this.setState({username: event.currentTarget.value});
    }
    handlePasswordChange(event){
        this.setState({password: event.target.value});
    }
    handleEnvURLChange(event){
        this.setState({envUrl: event.target.value});
    }
    handleAuthModeChange(event){
        this.setState({authMode: event.target.value});
    }

    onLoginUser(event){
        console.log('hello');
        event.preventDefault();
        const envUrl = this.state.envUrl;
        request.get(envUrl + '/status').withCredentials()
        .then(() => {
            console.log(`+ Able to connect to the Admin REST Server: ${envUrl}`);
        })
        .then(() => {
            // Now try to login using the specified authMode, username and password
            //const {username, password} = program,
            const username = this.state.username; 
            const password = this.state.password;
            const envUrl = this.state.envUrl;
            const loginMode = this.state.authMode.toString();
        
            return request.post(envUrl + '/auth/login').send({username, password, loginMode});
        })
        .then(res => {
            const authToken = res.headers['x-mstr-authtoken'];
            const cookie = 'JSESSIONID=' + res.header["set-cookie"][0].split("=")[1].split(";")[0];
            //console.log(`+ Logged in successfully: username=${program.username}, authMode=${program.authMode}`);
            document.cookie = cookie;
            sessionStorage.setItem('x-mstr-authtoken', authToken);
            return [authToken, cookie];
        })
        .catch(err => {
            console.error(`Error: ${err.response.res.statusCode} (${err.response.res.statusMessage})`);
        });
    }

    render(){
        return(
        <form onSubmit={this.onLoginUser}>
            <label>
                Username: 
                <input type='text' value={this.state.username} onChange={this.handleUsernameChange} name='username'/>
            </label>
            <br/>
            <label>
                Password: 
                <input type='password' value={this.state.password} onChange={this.handlePasswordChange} name='password'/>
            </label>
            <br/>
            <label>
                Environment URL: 
                <input type='text' value={this.state.envUrl} onChange={this.handleEnvURLChange} name='envUrl'/>
            </label>
            <br/>
            <label>
                Auth Mode: 
                <input type='number' value={this.state.authMode} onChange={this.handleAuthModeChange} name='envUrl'/>
            </label>
            <br/>
            <input type='submit' value='Submit' />
        </form>
        )
    }


}

export default Login;