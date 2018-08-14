import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import navigationService from './navigation-service';
import { historyManager } from '../history/history-manager';

class Navigator extends Component {
    constructor(props) {
        super(props);
        window.mstr = { history: this.props.history };
        this.pushHistory = this.pushHistory.bind(this);
        // this.getNavigationRoute = this.getNavigationRoute.bind(this);
    }

    pushHistory(routeObject) {
        this.props.history.push(routeObject);
    }

    async componentDidMount() {
        const sessionObject = this.props.location.sessionObject;
        if (sessionObject) {
            navigationService.saveSessionData(sessionObject);
        }
        const histObj = this.props.location.historyObject;
        if (histObj
            && (Object.keys(histObj).length !== 0
                || histObj.constructor !== Object)) {
            historyManager.handleHistoryData(this.props.location.historyObject);
        }
        let routeObject = await navigationService.getNavigationRoute();
        routeObject.state.origin = this.props.location;
        this.pushHistory(routeObject);
    }

    render() {
        return null;
    };
}

export default Navigator;
