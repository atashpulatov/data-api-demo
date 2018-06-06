import React from 'react'; // eslint-disable-line no-unused-vars
import BaseComponent from '../BaseComponent.jsx';
import authService from './auth-di.js';
const authenticate = authService.authRestService.authenticate;

class Login extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            envUrl: '',
            authMode: '',
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

        await this.authenticate(this.state.username, this.state.password, this.state.envUrl, this.state.authMode);
        console.log(sessionStorage.getItem('x-mstr-authtoken'));
        this.props.history.push(this.state.origin);
    }


    render() {
        return (
            <form onSubmit={this.onLoginUser}>
                <div className='grid-container padding'>
                    <label className='grid-item'>
                        Username:
                    </label>
                    <input className='grid-item' type='text'
                        value={this.state.username}
                        onChange={this.handleUsernameChange} name='username' />

                    <label className='grid-item'>
                        Password:
                    </label>
                    <input className='grid-item' type='password'
                        value={this.state.password}
                        onChange={this.handlePasswordChange} name='password' />

                    <label className='grid-item'>
                        Environment URL:
                    </label>
                    <input className='grid-item' type='text'
                        value={this.state.envUrl}
                        onChange={this.handleEnvURLChange} name='envUrl' />

                    <label className='grid-item'>
                        Auth Mode:
                    </label>
                    <input className='grid-item' type='number'
                        value={this.state.authMode}
                        onChange={this.handleAuthModeChange} name='envUrl' />

                    <input className='grid-item-2 button-submit'
                        type='submit' value='Submit' />
                </div>
            </form>
        );
    }
}

export default Login;
