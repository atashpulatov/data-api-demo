import React from 'react';
import './breadcrumbs.css';
import { Breadcrumb } from 'antd';
const BreadcrumbItem = Breadcrumb.Item;

export const CustomBreadcrumb = ({ object, onClick }) => (
    <BreadcrumbItem
        onClick={() => {
            const objectContent = object.projectId || object.dirId;
            onClick(objectContent);
        }}>
        <a className='breadcrumb'>
            {object.projectName || object.dirName}
        </a>
    </BreadcrumbItem >
);
