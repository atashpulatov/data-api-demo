import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import directoryImg from './images/baseline-folder-24px.svg';

export const DirectoryRow = ({ directory }) => (
    <li
        /* onClick={onClick.bind(null, directory.id)} */>
        <h1>
            {/* <img src={directoryImg} /> */}
            Name: {directory.name}</h1>
        <hr />
    </li >
);

export const ReportRow = ({ report }) => (
    <li
        /* onClick={onClick.bind(null, report.id)} */>
        <h1>Name: {report.name}</h1>
        <hr />
    </li >
);
