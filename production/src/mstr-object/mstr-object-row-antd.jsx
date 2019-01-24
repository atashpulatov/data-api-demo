/* eslint-disable */
import React from 'react';
import { Row, Col, message, Tooltip } from 'antd';
import { MSTRIcon } from 'mstr-react-library';
/* eslint-enable */

export const DirectoryRow = ({ directory, onClick }) => (
    <Row
        type='flex'
        className='cursor-is-pointer row'
        onClick={onDirectoryRowClick(onClick, directory)}>
        <Col>
            <MSTRIcon type='folder-collapsed' />
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
            onClick={onReportRowClick(onClick, report)}
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
                onClick={onFilterClick(onFilterReport, report)}>
                <MSTRIcon type='filter' />
            </Col>
        </Tooltip>
    </Row>
);
function onFilterClick(onFilterReport, report) {
    return () => {
        onFilterReport(report.id);
    };
}

function onDirectoryRowClick(onClick, directory) {
    return () => onClick(directory.id, directory.name);
}

function onReportRowClick(onClick, report) {
    return async () => {
        debugger;
        const _result = await onClick(report.id);
        if (_result.success) {
            message.success(_result.message);
        }
        else {
            message.warn(_result.message);
        }
    };
}

