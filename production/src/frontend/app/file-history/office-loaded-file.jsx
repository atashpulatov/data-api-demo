/* eslint-disable */
import React from 'react';
import { Icon, Row, Col } from 'antd';
import { message } from 'antd';
import { sessionHelper } from '../storage/session-helper';
import MSTRIcon from '../attribute-selector/components/MSTRIcon';
/* eslint-enable */

export const OfficeLoadedFile = ({ fileName, bindingId, onClick, onRefresh, onDelete }) => (
    <Row
        className="cursor-is-pointer"
        type="flex"
        justify="center">
        <Col span={2}>
            <MSTRIcon type='report' />
        </Col>
        <Col span={14} onClick={() => onClick(bindingId)}>
            {fileName}
        </Col>
        <Col span={1} onClick={async () => {
            await refreshReport(onRefresh, bindingId);
        }}>
            <Icon type='redo' />
        </Col>
        <Col span={1} offset={2} onClick={async () => {
            await deleteReport(onDelete, bindingId);
        }}>
            <Icon type='delete' />
        </Col>
    </Row >
);

async function refreshReport(onRefresh, bindingId) {
    sessionHelper.enableLoading();
    await onRefresh(bindingId);
    message.info('Report refreshed.');
    sessionHelper.disableLoading();
}

async function deleteReport(onDelete, bindingId) {
    sessionHelper.enableLoading();
    await onDelete(bindingId);
    message.info('Report removed');
    sessionHelper.disableLoading();
}
