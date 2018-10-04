/* eslint-disable */
import React from 'react';
import { Row, Col, message, Tooltip } from 'antd';
import MSTRIcon from '../attribute-selector/components/MSTRIcon';
/* eslint-enable */

export const DirectoryRow = ({ directory, onClick }) => (
    <Row
        type='flex'
        className='cursor-is-pointer row'
        onClick={() => onClick(directory.id, directory.name)}>
        <Col>
            <MSTRIcon type='folder-collapsed' />
            {/* <Icon type="folder" theme="outlined" /> */}
        </Col>
        <Col
            offset={1}>
            {directory.name}
        </Col>
    </Row>
);

export const ReportRow = ({ report, onClick, onFilterReport }) => (
    <Row
        type='flex'
        className='cursor-is-pointer row'>
        <Col>
            <MSTRIcon type='report' />
        </Col>
        <Col
            onClick={async () => {
                await onClick(report.id);
                message.success(`Loaded report: ${report.name}`);
            }}
            span={18}
            offset={1}
        >
            {report.name}
        </Col>
        <Tooltip
            placement='left'
            title='Choose data'>
            <Col
                offset={1}
                onClick={() => {
                    onFilterReport(report.id);
                }}>
                <MSTRIcon type='filter' />
            </Col>
        </Tooltip>
    </Row>
);
