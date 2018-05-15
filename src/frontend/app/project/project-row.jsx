import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
// import './project.css';
import di from './project-di';

class ProjectRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.projectRow,
        };
    }
    render() {
        return (
        <div className='projectRowContainer'>
            <h1>Name: {this.state.data.name}</h1>
            {/* <h2>ID: {this.state.data.id}</h2> */}
            <h2>Alias: {this.state.data.alias}</h2>
            {/* <h2>Description: {this.state.data.description}</h2>
            <h2>Status: {this.state.data.status}</h2> */}
            <hr />
        </div>
        );
    }
}

export default ProjectRow;
