import React from 'react';
import {Row, Col} from 'antd';
import {MSTRIcon} from 'mstr-react-library';
import {fileHistoryHelper} from './file-history-helper';
import loadingSpinner from './assets/report_loading_spinner.gif';

export class OfficeLoadedFile extends React.Component {
  constructor() {
    super();
    this.state = {
      allowDeleteClick: true,
    };
  }

  deleteAction() {
    const {onDelete, bindingId, objectType} = this.props;
    fileHistoryHelper.deleteReport(onDelete, bindingId, objectType);
    this.setState({allowDeleteClick: false});
  }

  render() {
    const {fileName, bindingId, onClick, onRefresh, isLoading, objectType} = this.props;
    return (
      <Row
        className="file-history-container"
        type="flex"
        justify="center">
        <Col span={2}>
          {objectType === 'report' ? <MSTRIcon type='report' /> : <MSTRIcon type='dataset' />}
        </Col>
        <Col span={14} title={`${fileName}`} className="report-title" onClick={() => onClick(bindingId)}>
          {fileName}
        </Col>
        <Col span={1} offset={2}>
          <span className="loading-button-container"
            onClick={!isLoading ? () => fileHistoryHelper.refreshReport(onRefresh, bindingId, objectType) : null}>
            {!isLoading ? <MSTRIcon type='refresh' /> : <img width='12px' height='12px' src={loadingSpinner} alt='Report loading icon' />}
          </span>
        </Col>
        <Col span={1} offset={1}>
          <span
            onClick={() => this.state.allowDeleteClick && this.deleteAction()}>
            <MSTRIcon type='trash' />
          </span>
        </Col>
      </Row >
    );
  }
}

