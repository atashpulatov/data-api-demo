/* eslint-disable */
import React, { Component } from 'react';
import ProjectRow from './project-row.jsx';
import BaseComponent from '../base-component.jsx';
import { sessionProperties } from '../storage/session-properties';
import './project.css';
/* eslint-enable */

export class Projects extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            projects: props.location.state.projects,
        };

        this.navigateToProject = this.navigateToProject.bind(this);
    }

    navigateToProject(projectId, projectName) {
        const sessionObject = {};
        sessionObject[sessionProperties.projectId] = projectId;
        sessionObject[sessionProperties.projectName] = projectName;
        this.props.history.push({
            pathname: '/',
            origin: this.props.location,
            sessionObject,
        });
    }

    render() {
        return (
            <article>
                <header>
                    <h2 className='projects-header'>
                        All Projects
                    </h2>
                </header>
                <hr className='projects-header-line' />
                <ul className='project-row-container no-padding'>
                    {this.state.projects.map((project) => (
                        <ProjectRow key={project.id} projectRow={project}
                            onClick={this.navigateToProject} />
                    ))}
                </ul>
            </article>
        );
    }
}
