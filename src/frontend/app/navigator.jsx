import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import {projects} from './mockData';

class Main extends Component {
    constructor(props) {
        super(props);

        this.navigateToProjects.call(this);
    }

    navigateToProjects() {
        console.log('this: ' + this);
        this.props.history.push({
            pathname: '/projects',
            state: {
                tarray: projects.projectsArray,
            },
        });
    }

    render() {
        return (
            <p></p>
        );
    };
}

export default Main;

