/* eslint-disable */
import React from 'react';
import directoryImg from './images/baseline_folder_black_18dp.png';
import fileImg from './images/baseline_attachment_black_18dp.png';
/* eslint-enable */

export const DirectoryRow = ({ directory, onClick }) => (
    <li className='cursorIsPointer row'
        onClick={onClick.bind(null, directory.id)}>
            <img className='object-img' src={directoryImg} /> <span className='object-label'>{directory.name}</span>
    </li >
);

export const ReportRow = ({ report, onClick }) => (
    <li className='cursorIsPointer row'
        onClick={onClick.bind(null, report.id)} >
            <img className='object-img' src={fileImg} /> <span className='object-label'>{report.name}</span>
    </li >
);
