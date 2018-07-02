import React from 'react'; // eslint-disable-line no-unused-vars
import BaseComponent from '../base-component.jsx';
import authService from './auth-rest-service';
import propertiesEnum from '../storage/properties-enum';
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
            sessionObject[propertiesEnum.envUrl] = this.state.envUrl;
            sessionObject[propertiesEnum.authToken] = authToken;
            this.state.origin.sessionObject = sessionObject;
        }
        this.props.history.push(this.state.origin);
    }


    render() {
        return (
            <div>
                <h2 className='authenticate-message'>
                    Connect to MicroStrategy Environment
                </h2>
                <form onSubmit={this.onLoginUser}>
                    <div className='grid-container padding'>
                        <label className='grid-item grid-item-label'>
                            Username
                    </label>
                        <input className='grid-item grid-item-input' type='text'
                            value={this.state.username}
                            onChange={this.handleUsernameChange} name='username' />

                    <label className='grid-item grid-item-label'>
                        Password
                    </label>
                        <input className='grid-item grid-item-input' type='password'
                            value={this.state.password}
                            onChange={this.handlePasswordChange} name='password' />

                    <label className='grid-item grid-item-label'>
                        Environment URL
                    </label>
                        <input className='grid-item grid-item-input' type='text'
                            value={this.state.envUrl}
                            onChange={this.handleEnvURLChange} name='envUrl' />

                        {/* <label className='grid-item grid-item-label'>
                        Auth Mode
                    </label>
                        <input className='grid-item grid-item-input' type='number'
                            value={this.state.authMode}
                            onChange={this.handleAuthModeChange} name='envUrl' /> */}

                        <input className='grid-item-2 button-submit'
                            type='submit' value='Submit' />
                    </div>
                </form>
            </div>
        );
    }
}

export default Authenticate;
