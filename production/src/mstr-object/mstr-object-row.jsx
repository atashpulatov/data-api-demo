/* eslint-disable */
import React from 'react';
import { Row, Col, message, Tooltip } from 'antd';
import { MSTRIcon } from 'mstr-react-library';
import { notificationService } from '../notification/notification-service';
import { errorService } from '../error/error-handler';
import { sessionHelper } from '../storage/session-helper';
import { ReportSubtypes } from '../enums/ReportSubtypes';
/* eslint-enable */

export const DirectoryRow = ({ directory, onClick }) => (
    <Row
        type='flex'
        className='cursor-is-pointer row'
        onClick={() => onClick(directory.id, directory.name)}>
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
            onClick={() => {
                onReportRowClick(onClick, report)}}
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
                    onFilterReport(report.id, report.subtype);
                }}>
                <MSTRIcon type='filter' />
            </Col>
        </Tooltip>
    </Row>
);
const onReportRowClick = async (onClick, report) => {
    try {
        sessionHelper.enableLoading();
        const isReport = report.subtype != ReportSubtypes.cube;
        const result = await onClick(report.id, isReport);
        notificationService.displayMessage(result.type, result.message);
    } catch (error) {
        errorService.handleOfficeError(error);
    } finally {
        sessionHelper.disableLoading();
    }
}