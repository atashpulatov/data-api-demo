import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import ProjectRow from './project-row.jsx'; // eslint-disable-line no-unused-vars
import BaseComponent from '../BaseComponent.jsx';

class Projects extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            projects: props.location.state.projects,
        };
        console.log(this.props.route.navigateToProject);
        this.navigateToProject = this.props.location.state.navigateToProject;
    }

    render() {
        return (
            <ul className='projectRowContainer'>
                {this.state.projects.map((project) => (
                    <ProjectRow key={project.id} projectRow={project}
                        onClick={this.navigateToProject} />
                ))}
            </ul>
        );
    }
}

export default Projects;
