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
      allowRefreshClick: true,
    };
  }

  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  deleteAction = (e) => {
    e.stopPropagation();
    const {onDelete, bindingId, objectType} = this.props;
    this.setState({allowDeleteClick: false}, async () => {
      await fileHistoryHelper.deleteReport(onDelete, bindingId, objectType);
      this._ismounted && this.setState({allowDeleteClick: true});
    });
  };

  refreshAction = (e) => {
    e.stopPropagation();
    const {isLoading, onRefresh, bindingId, objectType} = this.props;
    if (!isLoading) {
      this.setState({allowRefreshClick: false}, async () => {
        await fileHistoryHelper.refreshReport(onRefresh, bindingId, objectType);
        this.setState({allowRefreshClick: true});
      });
    }
  };

  render() {
    const {fileName, bindingId, onClick, isLoading, objectType} = this.props;
    return (
      <Row
        className="file-history-container"
        type="flex"
        justify="center"
        role="listitem"
        tabIndex="0"
        onClick={() => onClick(bindingId)}>
        <Col span={2}>
          {objectType === 'report' ? <MSTRIcon type='report' /> : <MSTRIcon type='dataset' />}
        </Col>
        <Col span={14} title={`${fileName}`} className="report-title">
          {fileName}
        </Col>
        <Col span={1} offset={2}>
          <span className="loading-button-container"
            onClick={(e) => this.state.allowRefreshClick && this.refreshAction(e)}>
            {!isLoading ? <MSTRIcon type='refresh' /> :
              <img width='12px' height='12px' src={loadingSpinner} alt='Report loading icon' />}
          </span>
        </Col>
        <Col span={1} offset={1}>
          <span
            onClick={(e) => this.state.allowDeleteClick && this.deleteAction(e)}>
            <MSTRIcon type='trash' />
          </span>
        </Col>
      </Row>
    );
  }
}

