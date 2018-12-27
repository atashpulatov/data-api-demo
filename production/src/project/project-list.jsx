/* eslint-disable */
import React, { Component } from 'react';
import { ProjectRow } from './project-row-antd.jsx';
import './project.css';
import { withNavigation } from '../navigation/with-navigation.jsx';
import { projectListHelper } from './project-list-helper';
import { sessionHelper } from '../storage/session-helper';
import { reduxStore } from '../store';
import { errorService } from '../error/error-handler.js';
/* eslint-enable */

export class _Projects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [],
        };
    }

    async componentDidMount() {
        try {
            sessionHelper.enableLoading();
            const projects = await projectListHelper.updateProjectList();
            this.setState({
                projects,
            });
        } catch (err) {
            errorService.handleError(err);
            // if (err instanceof UnauthorizedError || err instanceof EnvironmentNotFoundError) {
            //     reduxStore.dispatch({
            //         type: sessionProperties.actions.logOut,
            //     });
            //     return [];
            // } else {
            //     throw err;
            // }
        } finally {
            sessionHelper.disableLoading();
        }
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
                            onClick={projectListHelper.projectChosen} />
                    ))}
                </ul>
            </article>
        );
    }
}

export const Projects = withNavigation(_Projects);
