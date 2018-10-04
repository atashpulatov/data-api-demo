/* eslint-disable */
import React from 'react';
import { Col, Row } from 'antd';
import MSTRIcon from '../attribute-selector/components/mstr-icon.jsx';
/* eslint-enable */

export const ProjectRow = ({ projectRow, onClick }) => (
    <Row
        className='cursor-is-pointer project-row'
        type='flex'
        onClick={() => onClick(projectRow.id, projectRow.name)}>
        <Col>
            <MSTRIcon type='project-collapsed' />
        </Col>
        <Col
            offset={1}>
            {projectRow.name}
        </Col>
    </Row>
);

