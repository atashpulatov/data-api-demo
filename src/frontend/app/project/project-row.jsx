import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
// import './project.css';

const ProjectRow = ({ projectRow, onClick }) => (
    <li className='cursorIsPointer'
        onClick={onClick.bind(null, projectRow.id)}>
        <h1>Name: {projectRow.name}</h1>
        <h2>Alias: {projectRow.alias}</h2>
        <hr />
    </li >
);

export default ProjectRow;
