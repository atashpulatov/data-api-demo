import React from 'react';
import { Row, Col, Spin } from 'antd';
import { MSTRIcon } from 'mstr-react-library';
import { fileHistoryHelper } from './file-history-helper';

export const OfficeLoadedFile = ({ fileName, bindingId, onClick, onRefresh, onDelete }) => (
  <Row
    className="cursor-is-pointer"
    type="flex"
    justify="center">
    <Spin spinning={!bindingId}>
      <Col span={2}>
        <MSTRIcon type='report' />
      </Col>
      <Col span={14} title={`${fileName}`} className="report-title" onClick={() => onClick(bindingId)}>
        {fileName}
      </Col>
      <Col span={1} offset={2} onClick={async () => {
        await fileHistoryHelper.refreshReport(onRefresh, bindingId);
      }}>
      </Col>
      <Col span={1} offset={1} onClick={async () => {
        await fileHistoryHelper.deleteReport(onDelete, bindingId);
      }}>
        <MSTRIcon type='trash' />
      </Col>
    </Spin>
  </Row >
);
