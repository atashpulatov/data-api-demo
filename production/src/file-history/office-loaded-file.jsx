import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Popover} from 'antd';
import {MSTRIcon} from 'mstr-react-library';
import {fileHistoryHelper} from './file-history-helper';
import loadingSpinner from './assets/report_loading_spinner.gif';
import {refreshReportsArray, callForEdit, callForReprompt} from '../popup/popup-actions';
import RenameInput from './file-history-rename-input';
import {withTranslation} from 'react-i18next';
import {officeApiHelper} from '../office/office-api-helper';

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
    const {onDelete, bindingId, isCrosstab, crosstabHeaderDimensions, fileName} = this.props;
    this.setState({allowDeleteClick: false, allowRefreshClick: false}, async () => {
      const message = this.props.t('{{name}} has been removed from the workbook.', {name: fileName});
      await fileHistoryHelper.deleteReport(onDelete, bindingId, isCrosstab, crosstabHeaderDimensions, message);
      this._ismounted && this.setState({allowDeleteClick: true, allowRefreshClick: true});
    });
  };

  repromptAction = (e) => {
    e.stopPropagation();
    if (!this.state.allowRefreshClick) {
      return;
    }
    const {isLoading, bindingId, objectType, callForReprompt} = this.props;
    if (!isLoading) {
      this.setState({allowRefreshClick: false}, async () => {
        try {
          // calling onBindingObjectClick to check whether the object exists in Excel before opening prompt popup
          await officeApiHelper.onBindingObjectClick(bindingId, false) && await callForReprompt({bindId: bindingId, objectType});
        } finally {
          this.setState({allowRefreshClick: true});
        }
      });
    }
  };

  editAction = (e) => {
    e.stopPropagation();
    if (!this.state.allowRefreshClick) {
      return;
    }
    const {isLoading, bindingId, objectType, callForEdit} = this.props;
    if (!isLoading) {
      this.setState({allowRefreshClick: false}, async () => {
        try {
          // calling onBindingObjectClick to check whether the object exists in Excel before opening edit data popup
          await officeApiHelper.onBindingObjectClick(bindingId, false) && await callForEdit({bindId: bindingId, objectType});
        } finally {
          this.setState({allowRefreshClick: true});
        }
      });
    }
  };

  refreshAction = (e) => {
    e.stopPropagation();
    const {isLoading, bindingId, objectType, refreshReportsArray, loading} = this.props;
    if (!this.state.allowRefreshClick || loading) {
      return;
    }
    if (!isLoading) {
      this.setState({allowRefreshClick: false}, async () => {
        try {
          await officeApiHelper.onBindingObjectClick(bindingId, false) && await refreshReportsArray([{bindId: bindingId, objectType}], false);
        } finally {
          this.setState({allowRefreshClick: true});
        }
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
        <Col span={11} className="report-title">
          <RenameInput bindingId={bindingId} fileName={fileName} />
          <Popover placement="bottom" content={t('Date and time of last modification')} mouseEnterDelay={1}>
            <div className="additional-data">{t('refreshed_date', {date: refreshDate})}</div>
          </Popover>
        </Col>
        <Col span={1} offset={1} style={{marginTop: '1px'}}>
          <Popover placement="bottom" content={t('Reprompt')} mouseEnterDelay={1}>
            {!!isPrompted && <span className="loading-button-container"
              onClick={this.repromptAction}>
              <MSTRIcon type='reprompt' />
            </span>}
          </Popover>
        </Col>
        <Col span={1} offset={1} style={{marginTop: '1px'}}>
          <Popover placement="bottom" content={t('Edit Data')} mouseEnterDelay={1}>
            {<span
              tabIndex="0"
              className="loading-button-container"
              onClick={this.editAction}>
              <MSTRIcon type='edit' />
            </span>}
          </Popover>
        </Col>
        <Col span={1} offset={1}>
          <Popover placement="bottom" content={t('Refresh Data')} mouseEnterDelay={1}>
            {<span
              tabIndex="0"
              className="loading-button-container"
              onClick={this.refreshAction}>
              {!isLoading ? <MSTRIcon type='refresh' /> :
                <img width='12px' height='12px' src={loadingSpinner} alt={t('Report loading icon')} />}
            </span>}
          </Popover>
        </Col>
        <Col span={1} offset={1}>
          <Popover placement="bottomRight" content={t('Remove Data from Workbook')} mouseEnterDelay={1} arrowPointAtCenter="true">
            <span
              tabIndex="0"
              onClick={this.deleteAction}>
              <MSTRIcon type='trash' />
            </span>
          </Popover>
        </Col>
      </Row>
    );
  }
}

_OfficeLoadedFile.defaultProps = {
  t: (text) => text,
};

function mapStateToProps(state) {
  return {
    loading: state.officeReducer.loading,
  };
}

const mapDispatchToProps = {
  refreshReportsArray,
  callForEdit,
  callForReprompt,
};

export const OfficeLoadedFile = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_OfficeLoadedFile));

