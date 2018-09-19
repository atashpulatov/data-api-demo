/* eslint-disable */
import React from 'react';
import { Col, Row, Icon } from 'antd';
/* eslint-enable */

export const ProjectRow = ({ projectRow, onClick }) => (
    <Row
        className='cursor-is-pointer project-row'
        type='flex'
        onClick={() => onClick(projectRow.id, projectRow.name)}>
        <Col>
            <Icon type="project" theme="outlined" />
        </Col>
        <Col
            offset={1}>
            {projectRow.name}
        </Col>
    </Row>
);

