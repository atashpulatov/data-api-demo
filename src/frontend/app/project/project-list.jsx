import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import ProjectRow from './project-row.jsx'; // eslint-disable-line no-unused-vars
import BaseComponent from '../base-component.jsx';

class Projects extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            projects: props.location.state.projects,
        };

        this.navigateToProject = this.navigateToProject.bind(this);
    }

    navigateToProject(projectId) {
        sessionStorage.setItem('x-mstr-projectid', projectId);
        this.props.history.push({
            pathname: '/',
            origin: this.props.location,
        });
        return;
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
