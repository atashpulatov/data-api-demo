import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

const ProjectRow = ({ projectRow, onClick }) => (
    <li className='cursor-is-pointer project-row'
        onClick={onClick.bind(null, projectRow.id)}>
        <label className='projects-mstr-object'>{projectRow.name}</label>
    </li >
);

export default ProjectRow;
