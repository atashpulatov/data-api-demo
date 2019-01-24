/* eslint-disable */
import React from 'react';
import { Icon, Row, Col } from 'antd';
import { MSTRIcon } from 'mstr-react-library';
import { fileHistoryHelper } from './file-history-helper';
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
            await fileHistoryHelper.refreshReport(onRefresh, bindingId);
        }}>
            <Icon type='redo' />
        </Col>
        <Col span={1} offset={2} onClick={async () => {
            await fileHistoryHelper.deleteReport(onDelete, bindingId);
        }}>
            <Icon type='delete' />
        </Col>
    </Row >
);
