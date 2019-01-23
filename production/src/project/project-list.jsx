/* eslint-disable */
import React, { Component } from 'react';
import { ProjectRow } from './project-row.jsx';
import './project.css';
import { withNavigation } from '../navigation/with-navigation.jsx';
import { projectListHelper } from './project-list-helper';
import { sessionHelper } from '../storage/session-helper';
import { errorService } from '../error/error-handler.js';
/* eslint-enable */

const predefinedEnvUrl = 'https://env-125323.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

export class _Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
        };
    }

    saveMockedLoginValues = () =>{
        const values = {
            username: 'mstr',
            envUrl: predefinedEnvUrl,
            isRememberMeOn: false,
        }
        sessionHelper.saveLoginValues(values);
    }

    getCookies = () =>{
        console.log('sup');
        const cookieJar = document.cookie;
        const splittedCookies = cookieJar.split(';');
        return splittedCookies.map((cookie) => {
            const slicedCookie = cookie.split('=');
            return {
                name: slicedCookie[0],
                value: slicedCookie[1],
            }
        });
    }

    async componentDidMount() {
        this.saveMockedLoginValues();
        const splittedCookiesJar = this.getCookies();
        console.log(splittedCookiesJar);
        const authToken = splittedCookiesJar.filter((cookie) => {
            return cookie.name === ' iSession';
        });
        console.log(authToken);
        if(authToken[0]){
            sessionHelper.login(authToken[0].value);
        }
        try {
            sessionHelper.enableLoading();
            const projects = await projectListHelper.updateProjectList();
            this.setState({
                projects,
            });
        } catch (err) {
            errorService.handleError(err);
        } finally {
            sessionHelper.disableLoading();
        }
    }

    render() {
        const projects = this.state.projects;
        return (
            <article>
                <header>
                    <h2 className='projects-header'>
                        All Projects
                    </h2>
                </header>
                <hr className='projects-header-line' />
                <ul className='project-row-container no-padding'>
                    {projects.map((project) => (
                        <ProjectRow key={project.id} projectRow={project}
                            onClick={projectListHelper.projectChosen} />
                    ))}
                </ul>
            </article>
        );
    }
}

export const Projects = withNavigation(_Projects);
