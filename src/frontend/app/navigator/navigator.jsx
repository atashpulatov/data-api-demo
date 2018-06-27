import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import navigationService from './navigation-service';
import StorageService from '../storage/storage-service';
import propertiesEnum from '../storage/properties-enum';

class Navigator extends Component {
    constructor(props) {
        super(props);
        window.mstr = {history: this.props.history};
        this.pushHistory = this.pushHistory.bind(this);
        this.getNavigationRoute = this.getNavigationRoute.bind(this);
    }

    pushHistory(routeObject) {
        this.props.history.push(routeObject);
    }

    async getNavigationRoute() {
        const envUrl = sessionStorage.getItem(propertiesEnum.envUrl);
        const authToken = sessionStorage.getItem(propertiesEnum.authToken);
        if ((envUrl === null) || (authToken === null)) {
            return navigationService.getLoginRoute();
        }
        const projectId = sessionStorage.getItem(propertiesEnum.projectId);
        if (projectId === null) {
            return await navigationService.getProjectsRoute(envUrl, authToken);
        }
        const folderId = sessionStorage.getItem(propertiesEnum.folderId);
        if (folderId === null) {
            return await navigationService.getRootObjectsRoute(envUrl,
                authToken, projectId);
        }
        return await navigationService.getObjectsRoute(envUrl, authToken,
            projectId, folderId);
    }

    async componentDidMount() {
        this.saveSessionData(this.props.location.sessionObject);
    }

    saveSessionData(sessionProperties) {
        for (let prop in sessionProperties) {
            if (sessionProperties.hasOwnProperty(prop)) {
                StorageService.setProperty(prop, sessionProperties[prop]);
            }
        }
    }


    render() {
        return null;
    };
}

export default Navigator;
