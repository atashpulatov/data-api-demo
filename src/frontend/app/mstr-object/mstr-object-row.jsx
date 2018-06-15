/* eslint-disable no-unused-vars */
import React from 'react';
import DirectoryImg from './images/baseline-folder-24px.svg';
import FileImg from './images/baseline-attachment-24px.svg';
/* eslint-enable */

export const DirectoryRow = ({ directory, onClick }) => (
    <li className='cursorIsPointer'
        onClick={onClick.bind(null, directory.id)}>
        <h1>
            <DirectoryImg />
            {directory.name}
        </h1>
        <hr />
    </li >
);

export const ReportRow = ({ report, onClick }) => (
    <li className='cursorIsPointer'
        onClick={onClick.bind(null, report.id)} >
        <h1>
            <FileImg />
            {report.name}
        </h1>
        <hr />
    </li >
);
