/* eslint-disable */
import React from 'react';
import { Icon } from 'antd';
/* eslint-enable */

export const OfficeLoadedFile = ({ fileName, bindingId, onClick, onRefresh, onDelete }) => (
    <li
        className='cursor-is-pointer'>
        <span
            onClick={() => onClick(bindingId)}>
            {fileName}
        </span>
        <Icon
            type='redo'
            onClick={() => onRefresh(bindingId)} />
        <Icon
            type='delete'
            onClick={() => onDelete(bindingId)} />
    </li>
);
