/* eslint-disable */
import React from 'react';
import { Icon, Row, Col } from 'antd';
import { message } from 'antd';
/* eslint-enable */

export const OfficeLoadedFile = ({ fileName, bindingId, onClick, onRefresh, onDelete }) => (
    <Row
        className="cursor-is-pointer"
        type="flex"
        justify="center">
        <Col span={2}>
            <Icon type="file-text" theme="outlined" />
        </Col>
        <Col span={14} onClick={() => onClick(bindingId)}>
            {fileName}
        </Col>
        <Col span={1} onClick={() => {
            onRefresh(bindingId);
            message.info(`Report refreshed.`);
        }}>
            <Icon type='redo' />
        </Col>
        <Col span={1} offset={2} onClick={async () => {
            await onDelete(bindingId);
            message.info(`Removed report`);
        }}>
            <Icon type='delete' />
        </Col>
    </Row >
);
