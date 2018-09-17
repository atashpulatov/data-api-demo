/* eslint-disable */
import React from 'react';
import directoryImg from './images/baseline_folder_black_18dp.png';
import fileImg from './images/baseline_attachment_black_18dp.png';
/* eslint-enable */

export const DirectoryRow = ({ directory, onClick }) => (
    // TODO: refactor it to arrow functions
    <li className='cursor-is-pointer row'
        onClick={onClick.bind(null, directory.id, directory.name)}>
            <img className='object cursor-is-pointer' src={directoryImg} />
            <label className='object cursor-is-pointer'>{directory.name}</label>
    </li>
);

export const ReportRow = ({ report, onClick }) => (
    <li className='cursor-is-pointer row'
        onClick={onClick.bind(null, report.id)}>
            <img className='object cursor-is-pointer' src={fileImg} />
            <label className='object cursor-is-pointer'>{report.name}</label>
    </li>
);
