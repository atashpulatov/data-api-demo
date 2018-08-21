/* eslint-disable */
import React from 'react';
import directoryImg from './images/baseline_folder_black_18dp.png';
import fileImg from './images/baseline_attachment_black_18dp.png';
/* eslint-enable */

export const DirectoryRow = ({ directory, onClick }) => (
    <li className='cursor-is-pointer row'
        onClick={onClick.bind(null, directory.id, directory.name)}>
            <img className='object' src={directoryImg} />
            <label className='object'>{directory.name}</label>
    </li>
);

export const ReportRow = ({ report, onClick }) => (
    <li className='cursor-is-pointer row'
        onClick={onClick.bind(null, report.id)}>
            <img className='object' src={fileImg} />
            <label className='object'>{report.name}</label>
    </li>
);
