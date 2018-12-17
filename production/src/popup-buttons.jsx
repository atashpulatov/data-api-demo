
/* eslint-disable */
import React from 'react';
import { Row, Col, Button } from 'antd';
/* eslint-enable */

export const PopupButtons = ({ handleOk, handleCancel, loading }) => (
    <Row
        type='flex'
        justify='end'
        gutter={16}>
        <Col>
            <Button
                onClick={handleCancel}>
                Cancel
    </Button>
        </Col>
        <Col>
            <Button
                type='primary'
                onClick={handleOk}
                loading={loading}>
                Ok
      </Button>
        </Col>
    </Row >
);
