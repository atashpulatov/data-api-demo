import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
// import './project.css';

const ProjectRow = ({ projectRow }) => (
    <li onClick={projectRow.onClick}>
        <h1>Name: {projectRow.name}</h1>
        <h2>Alias: {projectRow.alias}</h2>
        <hr />
    </li >
);

export default ProjectRow;
