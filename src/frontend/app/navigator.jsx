import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import navigationService from './navigation-service.js';

class Main extends Component {
    constructor(props) {
        super(props);
        console.log('test');
        this.pushHistory = this.pushHistory.bind(this);
    }

    pushHistory(historyObject) {
        this.props.history.push(historyObject);
    }

    async componentDidMount() {
        let historyObject = await navigationService.getNavigationRoute();
        historyObject.state.origin = this.props.location;
        this.pushHistory(historyObject);
    }

    render() {
        return (
            <p></p>
        );
    };
}

export default Main;

