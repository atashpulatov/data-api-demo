import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import navigationService from './navigation-service.js';

class Main extends Component {
    constructor(props) {
        super(props);
        console.log('test');
        this.navigationDispatcher = navigationService.navigationDispatcher.bind(this);
    }

    componentDidMount() {
        let navigate = this.navigationDispatcher();
        navigate(this);
    }

    render() {
        return (
            <p></p>
        );
    };
}

export default Main;

