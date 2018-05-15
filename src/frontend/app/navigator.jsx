import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import {projects} from './mockData';

class Main extends Component {
    constructor(props) {
        super(props);
        console.log('test');
        this.navigateToProjects = this.navigateToProjects.bind(this);
    }

    componentDidMount() {
        this.navigateToProjects();
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

