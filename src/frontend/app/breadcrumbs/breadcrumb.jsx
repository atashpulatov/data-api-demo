/* eslint-disable */
import React from 'react';
/* eslint-enable */

export const Breadcrumb = ({ object, onClick }) => (
    <li className='cursor-is-pointer row'
        onClick={onClick.bind(null, object.id)}>
        <label className='object'>{object.projectName || object.dirName}</label>
    </li>
);

