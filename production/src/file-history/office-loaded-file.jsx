import React from 'react';
import {connect} from 'react-redux';
import {Row, Col} from 'antd';
import {MSTRIcon} from 'mstr-react-library';
import {fileHistoryHelper} from './file-history-helper';
import loadingSpinner from './assets/report_loading_spinner.gif';
import {refreshReportsArray} from '../popup/popup-actions';
import RenameInput from './file-history-rename-input';
import {withTranslation} from 'react-i18next';

export class _OfficeLoadedFile extends React.Component {
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
    if (!this.state.allowDeleteClick) {
      return;
    }
    const {onDelete, bindingId, objectType} = this.props;
    this.setState({allowDeleteClick: false}, async () => {
      await fileHistoryHelper.deleteReport(onDelete, bindingId, objectType);
      this._ismounted && this.setState({allowDeleteClick: true});
    });
  };

  refreshAction = (e) => {
    e.stopPropagation();
    if (!this.state.allowRefreshClick) {
      return;
    }
    const {isLoading, bindingId, objectType, refreshReportsArray} = this.props;
    if (!isLoading) {
      this.setState({allowRefreshClick: false}, async () => {
        // await refreshReport(bindingId, objectType, false);
        await refreshReportsArray([{bindId: bindingId, objectType}], false);
        this.setState({allowRefreshClick: true});
      });
    }
  };

  render() {
    const {fileName, bindingId, onClick, isLoading, objectType, isPrompted, refreshDate, t} = this.props;
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
          <RenameInput bindingId={bindingId} fileName={fileName} />
          <div className="additional-data">{refreshDate.toLocaleString()}</div>
        </Col>
        <Col span={1} offset={2}>
          {!isPrompted && <span className="loading-button-container" title={t('Refresh Data')}
            onClick={this.refreshAction}>
            {!isLoading ? <MSTRIcon type='refresh' /> :
              <img width='12px' height='12px' src={loadingSpinner} alt={t('Report loading icon')} />}
          </span>}
        </Col>
        <Col span={1} offset={1}>
          <span
            title={t('Remove Data from Workbook')}
            onClick={this.deleteAction}>
            <MSTRIcon type='trash' />
          </span>
        </Col>
      </Row>
    );
  }
}

_OfficeLoadedFile.defaultProps = {
  t: (text) => text,
};

const mapDispatchToProps = {
  refreshReportsArray,
};

export const OfficeLoadedFile = connect(null, mapDispatchToProps)(withTranslation('common')(_OfficeLoadedFile));

