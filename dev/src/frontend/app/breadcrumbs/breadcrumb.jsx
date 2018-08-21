/* eslint-disable */
import React from 'react';
import './breadcrumbs.css';
/* eslint-enable */

export const Breadcrumb = ({ object, onClick }) => (
    <li className='cursor-is-pointer row'
        onClick={onClick.bind(null, object.projectId || object.dirId)}>
        <label className='object'>{object.projectName || object.dirName}</label>
    </li>
);

