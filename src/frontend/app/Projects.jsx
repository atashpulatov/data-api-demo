import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import ProjectRow from './ProjectRow.jsx'; // eslint-disable-line no-unused-vars

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        let rows = [];
        let testResult = this.props.location.state.tarray;
        let testResultLngt = testResult.length;
        for ( let i = 0; i < testResultLngt; i++) {
            rows.push(<ProjectRow projectRow={testResult[i]}/>);
        }
        return (
        <div>
            {rows}
        </div>
        );
    }
}

export default Projects;
