import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import navigationService from './navigation-service.js';
import StorageService from '../storage/storage-service';
import propertiesEnum from '../storage/properties-enum';

class Navigator extends Component {
    constructor(props) {
        super(props);
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
            return {
                pathname: '/auth',
                state: {
                },
            };
            return navigationService.loginRoute();
        }
        const projectId = sessionStorage.getItem(propertiesEnum.projectId);
        if (projectId === null) {
            return await navigationService.projectsRoute();
        }
        const folderId = sessionStorage.getItem(propertiesEnum.folderId);
        if (folderId === null) {
            return await navigationService.rootObjectsRoute();
        }
        return await navigationService.objectsRoute();
    }

    async componentDidMount() {
        const sessionProperties = this.props.location.sessionObject;
        for (let prop in sessionProperties) {
            if (sessionProperties.hasOwnProperty(prop)) {
                StorageService.setProperty(prop, sessionProperties[prop]);
            }
        }
        let routeObject = await this.getNavigationRoute();
        routeObject.state.origin = this.props.location;
        this.pushHistory(routeObject);
    }

    render() {
        return null;
    };
}

export default Navigator;

