/* eslint-disable */
import React from 'react';
import directoryImg from './images/baseline_folder_black_18dp.png';
import fileImg from './images/baseline_attachment_black_18dp.png';
/* eslint-enable */

export const DirectoryRow = ({ directory, onClick }) => (
    <li className='cursorIsPointer'
        onClick={onClick.bind(null, directory.id)}>
        <h1>
            <img src={directoryImg} />
            {directory.name}
        </h1>
        <hr />
    </li >
);

export const ReportRow = ({ report, onClick }) => (
    <li className='cursorIsPointer'
        onClick={onClick.bind(null, report.id)} >
        <h1>
            <img src={fileImg} />
            {report.name}
        </h1>
        <hr />
    </li >
);
