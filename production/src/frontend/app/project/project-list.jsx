/* eslint-disable */
import React, { Component } from 'react';
import { ProjectRow } from './project-row.jsx';
import './project.css';
import { withNavigation } from '../navigation/with-navigation.jsx';
import { projectListHelper } from './project-list-helper';
/* eslint-enable */

export class _Projects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [],
        };
    }

    async componentDidMount() {
        const projects = await projectListHelper.updateProjectList();
        this.setState({
            projects,
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
