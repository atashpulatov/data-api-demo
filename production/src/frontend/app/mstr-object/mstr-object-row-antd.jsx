/* eslint-disable */
import React from 'react';
import { Row, Col, Icon } from 'antd';
/* eslint-enable */

export const DirectoryRow = ({ directory, onClick }) => (
    <Row
        type='flex'
        className='cursor-is-pointer row'
        onClick={() => onClick(directory.id, directory.name)}>
        <Col>
            <Icon type="folder" theme="outlined" />
        </Col>
        <Col
            offset={1}>
            {directory.name}
        </Col>
    </Row>
);

export const ReportRow = ({ report, onClick }) => (
    <Row
        type='flex'
        className='cursor-is-pointer row'
        onClick={() => onClick(report.id)}>
        <Col>
            <Icon type="file-text" theme="outlined" />
        </Col>
        <Col
            offset={1}>
            {report.name}
        </Col>
    </Row>
);
