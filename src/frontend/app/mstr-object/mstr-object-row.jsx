import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import directoryImg from './images/baseline-folder-24px.svg';
import fileImg from './images/baseline-attachmenttt-24px.svg';

export const DirectoryRow = ({ directory, onClick }) => (
    <li className='cursorIsPointer'
        onClick={onClick.bind(null, directory.id)}>
        <h1>
            <img src={directoryImg} />
            Name: {directory.name}
        </h1>
        <hr />
    </li >
);

export const ReportRow = ({ report }) => (
    <li
        /* onClick={onClick.bind(null, report.id)} */>
        <h1>
            <img src={fileImg} />
            Name: {report.name}
        </h1>
        <hr />
    </li >
);
