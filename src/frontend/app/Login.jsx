import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
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

        this.props.history.push({
            pathname: '/projects',
            state: {
                tarray:  [
                    {
                        "id": "B7CA92F04B9FAE8D941C3E9B7E0CD754",
                        "name": "MicroStrategy Tutorial",
                        "alias": "",
                        "description": "MicroStrategy Tutorial project and application set designed to illustrate the platform's rich functionality. The theme is an Electronics, Books, Movies and Music store. Employees, Inventory, Finance, Product Sales and Suppliers are analyzed.",
                        "status": 0
                    },
                    {
                        "id": "163613BB4B34BD0B08CE8AB4828EBE97",
                        "name": "Usher Analytics Self Service",
                        "alias": "",
                        "description": "Usher Analytics Self Service (10.8.0)",
                        "status": 0
                    },
                    {
                        "id": "CE52831411E696C8BD2F0080EFD5AF44",
                        "name": "Consolidated Education Project",
                        "alias": "",
                        "description": "",
                        "status": 0
                    },
                    {
                        "id": "B3FEE61A11E696C8BD0F0080EFC58F44",
                        "name": "Hierarchies Project",
                        "alias": "",
                        "description": "",
                        "status": 0
                    },
                    {
                        "id": "4BAE16A340B995CAD24193AA3AC15D29",
                        "name": "Human Resources Analysis Module",
                        "alias": "",
                        "description": "The Human Resources Analysis Module analyses workforce headcount, trends and profiles, employee attrition and recruitment, compensation and benefit costs and employee qualifications, performance and satisfaction.",
                        "status": 0
                    },
                    {
                        "id": "4C09350211E69712BAEE0080EFB56D41",
                        "name": "Relationships Project",
                        "alias": "",
                        "description": "",
                        "status": 0
                    },
                    {
                        "id": "85C3FE7E11E7028A06660080EFB5E5D4",
                        "name": "Enterprise Manager",
                        "alias": "",
                        "description": "",
                        "status": 0
                    }
                ]
            }
        });

        // request.get(envUrl + '/status')
        //     .then(() => {
        //         console.log(`+ Able to connect to the Admin REST Server: `
        //             + `${envUrl}`);
        //     })
        //     .then(() => {

        //         // -------- only for debugging
        //         const credentials = require('./Credentials');
        //         const username = credentials.username;
        //         const password = credentials.password;
        //         const envUrl = credentials.envUrl;
        //         const loginMode = credentials.loginMode;
        //         // -------------------

        //         return request.post(envUrl + '/auth/login')
        //             .send({ username, password, loginMode })
        //             .withCredentials();
        //     })
        //     .then((res) => {
        //         console.log(res);
        //         const authToken = res.headers['x-mstr-authtoken'];
        //         sessionStorage.setItem('x-mstr-authtoken', authToken);
        //         console.log(sessionStorage.getItem('x-mstr-authtoken'));
        //         return authToken;
        //     })
        //     .then((token) => {
        //         return request.get(envUrl + '/projects')
        //             .set('x-mstr-authtoken', token)
        //             .withCredentials()
        //     })
        //     .then((res) => {
        //         console.log(res);
        //     })
        //     .catch((err) => {
        //         console.error(`Error: ${err.status}`
        //             + ` (${err.message})`);
        //     });
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
