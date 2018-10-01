import React, { Component } from 'react';

import MainContainer from './components/MainContainer';
import Header from './components/Header';
import Footer from './components/Footer';
import Content from './components/Content';
import Parameters from './components/Parameters';
import MSTRFetch, { msrtFetch } from './utilities/MSTRFetch';
import { message } from 'antd';
import { reduxStore } from '../store';
import './Bootstrap.css';
import { historyHelper } from '../history/history-helper';

export class Bootstrap extends Component {
    constructor(props) {
        super(props);
        this.api = msrtFetch;
        this.state = {
            loading: false,
            disabledSubmit: true,
            disabledConnect: false,
        };
        this.content = React.createRef();
    }


    goBack = () => {
        this.api.logout();
        this.setState({ loading: false });
    }

    onConnect = () => {
        const getAuthForm = this.content.current.validateForm();
        getAuthForm((err, credentials) => {
            if (!err) {
                credentials.url = this.urlChecker(credentials.url);
                this.setState({ loading: true, credentials });
                this.api.createConnection(credentials);
                this.api.getToken().then((token) => {
                    if (token) {
                        this.tokenChecker();
                    }
                    this.setState({ loading: false });
                });
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const getAuthForm = this.content.current.validateForm();
        getAuthForm((err, credentials) => {
            if (!err) {
                credentials.url = this.urlChecker(credentials.url);
                this.setState({ loading: true, credentials });
                this.api.createConnection(credentials);
                this.api.getToken().then((token) => {
                    if (token) {
                        this.tokenChecker();
                    }
                    this.setState({ loading: false });
                });
            }
        });
    }

    onSubmit = () => {
        this.content.current.submit();
    }

    tokenChecker = () => {
        const authToken = setInterval(() => {
            if (!this.api.isAuthenticated) {
                message.info('The users session has expired, please reauthenticate.');
                clearInterval(authToken);
                this.forceUpdate();
            }
        }, 2000);
    }

    urlChecker = (url) => {
        return url.slice(-1) === '/' ? url : url + '/';
    }

    onChangeDisabledSubmit = (newState) => {
        if (newState !== this.state.disabledSubmit) {
            this.setState({ disabledSubmit: newState });
        }
    }

    onChangeDisabledConnect = (newState) => {
        if (newState !== this.state.disabledConnect) {
            this.setState({ disabledConnect: newState });
        }
    }

    render() {
        const currentStore = reduxStore.getState();
        const projectId = currentStore.historyReducer.project
            ? currentStore.historyReducer.project.projectId
            : undefined;
        const session = {
            url: currentStore.sessionReducer.envUrl,
            authToken: currentStore.sessionReducer.authToken,
            projectId,
        };
        return (
            <MainContainer>
                <Parameters
                    key={'sumKey'}
                    changeDisabledSubmit={this.props.changeDisabledSubmit}
                    session={session}
                    ref={this.parameters} />
            </MainContainer>
        );
    }
}
