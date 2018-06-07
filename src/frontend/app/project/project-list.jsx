import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import ProjectRow from './project-row.jsx'; // eslint-disable-line no-unused-vars
import BaseComponent from '../BaseComponent';

class Projects extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            projects: props.location.state.projects,
        };

        this.projectChosen = this.projectChosen.bind(this);
    }

    projectChosen(event) {
        return;
    }

    render() {
        return (
            <ul className='projectRowContainer'>
                {this.state.projects.map((project) => (
                    <ProjectRow key={project.id} projectRow={project}
                        onClick={projectChosen} />
                ))}
            </ul>
        );
    }
}

export default Projects;
