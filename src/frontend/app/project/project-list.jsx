import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import ProjectRow from './project-row.jsx'; // eslint-disable-line no-unused-vars

const Projects = (props) => (
    <div>
        <ul className='projectRowContainer'>
            {props.location.state.projects.map((project) => (
                <ProjectRow key={project.id} projectRow={project} />
            ))}
        </ul>
    </div>
);

export default Projects;
