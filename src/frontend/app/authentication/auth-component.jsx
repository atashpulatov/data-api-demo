import React from 'react'; // eslint-disable-line no-unused-vars
import BaseComponent from '../base-component.jsx';
import './auth-component.css';
import authService from './auth-rest-service';
import { sessionProperties } from '../storage/session-properties';
const authenticate = authService.authenticate;

class Authenticate extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            envUrl: '',
            authMode: undefined,
            origin: this.state.origin,
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEnvURLChange = this.handleEnvURLChange.bind(this);
        this.handleAuthModeChange = this.handleAuthModeChange.bind(this);

        this.onLoginUser = this.onLoginUser.bind(this);
        this.authenticate = authenticate.bind(this);
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

    async onLoginUser(event) {
        event.preventDefault();
        let authToken = await this.authenticate(
            this.state.username, this.state.password,
            this.state.envUrl, this.state.authMode);
        if (authToken !== undefined) {
            const sessionObject = {};
            sessionObject[sessionProperties.envUrl] = this.state.envUrl;
            sessionObject[sessionProperties.authToken] = authToken;
            this.state.origin.sessionObject = sessionObject;
        }
        this.props.history.push(this.state.origin);
    }


    render() {
        return (
            <div>
                <header>
                    <h1 id='authenticate-message'>Connect to MicroStrategy Environment</h1>
                </header>
                <form onSubmit={this.onLoginUser} className='grid-container padding'>
                    <label className='grid-item'>
                        Username
                        </label>
                    <input className='grid-item' type='text'
                        value={this.state.username}
                        onChange={this.handleUsernameChange} name='username' />

                    <label className='grid-item'>
                        Password
                        </label>
                    <input className='grid-item' type='password'
                        value={this.state.password}
                        onChange={this.handlePasswordChange} name='password' />

                    <label className='grid-item'>
                        Environment URL
                        </label>
                    <input className='grid-item' type='text'
                        value={this.state.envUrl}
                        onChange={this.handleEnvURLChange} name='envUrl' />
                    <input className='grid-item-2 button-submit'
                        type='submit' value='Submit' />
                </form>
            </div>
        );
    }
}

export default Authenticate;
