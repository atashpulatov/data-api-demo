import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import ProjectRow from './project-row.jsx'; // eslint-disable-line no-unused-vars

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let projects = this.props.location.state.projects;
        let projectRows = projects.map(((project) => {
            return <ProjectRow key={project.id} projectRow={project} />;
        }));
        return (
            <div>
                {projectRows}
            </div>
        );
    }
}

export default Projects;
