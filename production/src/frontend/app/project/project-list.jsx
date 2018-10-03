/* eslint-disable */
import React, { Component } from 'react';
import { ProjectRow } from './project-row-antd.jsx';
import './project.css';
import { withNavigation } from '../navigation/with-navigation.jsx';
import { projectListHelper } from './project-list-helper';
import { sessionHelper } from '../storage/session-helper';
import { reduxStore } from '../store';
/* eslint-enable */

export class _Projects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [],
        };
    }

    async componentDidMount() {
        sessionHelper.enableLoading();
        const projects = await projectListHelper.updateProjectList();
        this.setState({
            projects,
        });
        sessionHelper.disableLoading();
        const envUrl = reduxStore.getState().sessionReducer.envUrl;
        const token = reduxStore.getState().sessionReducer.authToken;
        if (token === undefined) {
            return;
        }
        await Excel.run(async (context) => {
            Office.context.ui.displayDialogAsync(
                'https://localhost:3000/popup.html?envUrl=' + envUrl
                + '&token=' + token,
                { height: 50, width: 60, displayInIframe: true },
                (asyncResult) => {
                    console.log(asyncResult);
                    let dialog = asyncResult.value;
                    dialog.addEventHandler(
                        Office.EventType.DialogMessageReceived, (arg) => {
                            // console.log(arg.message);
                            // dialog.close();
                        });
                });

            await context.sync();
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
                            onClick={projectListHelper.projectChosen} />
                    ))}
                </ul>
            </article>
        );
    }
}

export const Projects = withNavigation(_Projects);
