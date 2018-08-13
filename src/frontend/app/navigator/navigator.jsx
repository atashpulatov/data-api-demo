import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import navigationService from './navigation-service';
import { sessionProperties } from '../storage/session-properties';
import { historyManager } from '../history/history-manager';
import { reduxStore } from '../store';
import { historyProperties } from '../history/history-properties';

class Navigator extends Component {
    constructor(props) {
        super(props);
        window.mstr = { history: this.props.history };
        this.pushHistory = this.pushHistory.bind(this);
        this.getNavigationRoute = this.getNavigationRoute.bind(this);
    }

    pushHistory(routeObject) {
        this.props.history.push(routeObject);
    }

    async getNavigationRoute() {
        const envUrl = reduxStore.getState()
            .sessionReducer.envUrl;
        const authToken = reduxStore.getState()
            .sessionReducer.authToken;
        if (!envUrl || !authToken) {
            return navigationService.getLoginRoute();
        }
        const projectId = reduxStore.getState()
            .historyReducer.projectId;
        if (!projectId) {
            return await navigationService.getProjectsRoute(envUrl, authToken);
        }
        try {
            const dirId = historyManager.getCurrentDirectory();
            return await navigationService.getObjectsRoute(envUrl, authToken,
                projectId, dirId);
        } catch (error) {
            return await navigationService.getRootObjectsRoute(envUrl,
                authToken, projectId);
        }
    }

    async componentDidMount() {
        const sessionObject = this.props.location.sessionObject;
        if (sessionObject) {
            this.saveSessionData(sessionObject);
        }
        const histObj = this.props.location.historyObject;
        if (histObj
            && (Object.keys(histObj).length !== 0
                || histObj.constructor !== Object)) {
            historyManager.handleHistoryData(this.props.location.historyObject);
        }
        let routeObject = await this.getNavigationRoute();
        routeObject.state.origin = this.props.location;
        this.pushHistory(routeObject);
    }

    saveSessionData(propertiesToSave) {
        if (propertiesToSave[sessionProperties.username]) {
            reduxStore.dispatch({
                type: sessionProperties.actions.logIn,
                username: propertiesToSave[sessionProperties.username],
                envUrl: propertiesToSave[sessionProperties.envUrl],
                isRememberMeOn: propertiesToSave[sessionProperties.isRememberMeOn],
            });
        }
        if (propertiesToSave[sessionProperties.authToken]) {
            reduxStore.dispatch({
                type: sessionProperties.actions.loggedIn,
                authToken: propertiesToSave[sessionProperties.authToken],
            });
        }
        if (propertiesToSave[historyProperties.projectId]) {
            reduxStore.dispatch({
                type: historyProperties.actions.goInsideProject,
                projectId: propertiesToSave[historyProperties.projectId],
            });
            return;
        }
        if (propertiesToSave[historyProperties.directoryId]) {
            reduxStore.dispatch({
                type: historyProperties.actions.goInside,
                dirId: propertiesToSave[historyProperties.directoryId],
            });
        }
    }

    render() {
        return null;
    };
}

export default Navigator;
