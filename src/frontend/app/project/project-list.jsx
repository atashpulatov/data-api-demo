import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import ProjectRow from './project-row.jsx'; // eslint-disable-line no-unused-vars
import BaseComponent from '../base-component.jsx';
import { sessionProperties } from '../storage/session-properties';

class Projects extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            projects: props.location.state.projects,
        };

        this.navigateToProject = this.navigateToProject.bind(this);
    }

    navigateToProject(projectId) {
        const sessionObject = {};
        sessionObject[sessionProperties.projectId] = projectId;
        this.props.history.push({
            pathname: '/',
            origin: this.props.location,
            sessionObject,
        });
    }

    render() {
        return (
            <div>
                <h2 className='projects-header'>
                    All Projects
                </h2>
                <hr className='projects-header-line' />
                <ul className='projectRowContainer no-padding'>
                    {this.state.projects.map((project) => (
                        <ProjectRow key={project.id} projectRow={project}
                            onClick={this.navigateToProject} />
                    ))}
                </ul>
            </div>
        );
    }
}

export default Projects;
