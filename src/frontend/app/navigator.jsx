import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import navigationService from './navigation-service.js';

class Main extends Component {
    constructor(props) {
        super(props);
        console.log('test');
        this.navigationService = navigationService.navigationDispatcher.bind(this);
    }

    componentDidMount() {
        let navigate = this.navigationService();
        navigate = navigate.bind(this);
        navigate();
    }

    render() {
        return (
            <p></p>
        );
    };
}

export default Main;

