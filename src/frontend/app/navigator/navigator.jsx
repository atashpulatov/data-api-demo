import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import navigationService from './navigation-service.js';

class Navigator extends Component {
    constructor(props) {
        super(props);
        this.pushHistory = this.pushHistory.bind(this);
    }

    pushHistory(routeObject) {
        this.props.history.push(routeObject);
    }

    async componentDidMount() {
        let routeObject = await navigationService.getNavigationRoute();
        routeObject.state.origin = this.props.location;
        this.pushHistory(routeObject);
    }

    render() {
        return (
            <p></p>
        );
    };
}

export default Navigator;

