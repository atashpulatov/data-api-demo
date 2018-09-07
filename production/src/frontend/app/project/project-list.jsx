/* eslint-disable */
import React, { Component } from 'react';
import { ProjectRow } from './project-row.jsx';
import './project.css';
import { projectRestService } from './project-rest-service';
import { reduxStore } from '../store';
import { historyProperties } from '../history/history-properties';
import { withNavigation } from '../navigation/with-navigation.jsx';
import { UnauthorizedError } from '../error/unauthorized-error';
import { sessionProperties } from '../storage/session-properties';
/* eslint-enable */

export class _Projects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [],
        };

        this.projectChosen = this.projectChosen.bind(this);
    }

    async componentDidMount() {
        try {
            const envUrl = reduxStore.getState().sessionReducer.envUrl;
            const authToken = reduxStore.getState().sessionReducer.authToken;
            const projects = await projectRestService
                .getProjectList(envUrl, authToken);
            this.setState({
                projects: projects,
            });
        } catch (err) {
            if (err instanceof UnauthorizedError) {
                reduxStore.dispatch({
                    type: sessionProperties.actions.logOut,
                });
            } else {
                throw err;
            }
        };
    }

    projectChosen(projectId, projectName) {
        reduxStore.dispatch({
            type: historyProperties.actions.goInsideProject,
            projectId: projectId,
            projectName: projectName,
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
                            onClick={this.projectChosen} />
                    ))}
                </ul>
            </article>
        );
    }
}

export const Projects = withNavigation(_Projects);
