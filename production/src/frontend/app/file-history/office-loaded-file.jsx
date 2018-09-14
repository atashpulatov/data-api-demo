/* eslint-disable */
import React from 'react';
import { Icon, Row, Col } from 'antd';
/* eslint-enable */

export const OfficeLoadedFile = ({ fileName, bindingId, onClick, onRefresh, onDelete }) => (
    <Row
        className="cursor-is-pointer"
        type="flex"
        justify="space-around">
        <Col span={7} onClick={() => onClick(bindingId)}>
            {fileName}
        </Col>
        <Col span={1} offset={4} onClick={() => onRefresh(bindingId)}>
            <Icon type='redo' />
        </Col>
        <Col span={1} onClick={() => onDelete(bindingId)}>
            <Icon type='delete' />
        </Col>
    </Row >
);
