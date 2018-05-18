import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import ProjectRow from './project-row.jsx'; // eslint-disable-line no-unused-vars

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let testResult = this.props.location.state.projects;
        let rows = testResult.map(((element) => {
            return <ProjectRow key={element.id} projectRow={element} />;
        }));
        return (
            <div>
                {rows}
            </div>
        );
    }
}

export default Projects;
