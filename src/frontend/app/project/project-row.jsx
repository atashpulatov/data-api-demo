import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
// import './project.css';
import di from './project-di';

const ProjectRow = ({ projectRow }) => (
    <div className='projectRowContainer'>
        <h1>Name: {projectRow.name}</h1>
        <h2>Alias: {projectRow.alias}</h2>
        <hr />
    </div>
);

export default ProjectRow;
