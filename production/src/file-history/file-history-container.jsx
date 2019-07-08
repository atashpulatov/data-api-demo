import React from 'react';
import {connect} from 'react-redux';
import {Button, Popover} from 'antd';
import {OfficeLoadedFile} from './office-loaded-file.jsx';
import {officeApiHelper} from '../office/office-api-helper';
import {officeDisplayService} from '../office/office-display-service';
import {MSTRIcon} from 'mstr-react-library';
import loadingSpinner from './assets/report_loading_spinner.gif';
import {refreshReportsArray} from '../popup/popup-actions';
import {fileHistoryContainerHOC} from './file-history-container-HOC.jsx';
import {officeStoreService} from '../office/store/office-store-service';
import {toggleSecuredFlag} from '../office/office-actions';
import restrictedArt from './assets/art_restricted_access_blue.svg';

import './../index.css';
import './file-history.css';
import {withTranslation} from 'react-i18next';

export class _FileHistoryContainer extends React.Component {
  constructor(props) {
    super(props);
    if (officeStoreService.isFileSecured()) {
      props.toggleSecuredFlag(true);
    }
    this.state = {
      allowRefreshAllClick: true,
    };
  }

  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  refreshAllAction = (reportArray, refreshAll) => {
    this.state.allowRefreshAllClick && this.setState({allowRefreshAllClick: false}, async () => {
      await refreshAll(reportArray, true);
      this._ismounted && this.setState({allowRefreshAllClick: true});
    });
  };

  showData = () => {
    const {reportArray, refreshReportsArray, toggleSecuredFlag} = this.props;
    this.refreshAllAction(reportArray, refreshReportsArray);
    toggleSecuredFlag(false);
  }

  render() {
    const {reportArray = [], loading, refreshingAll, refreshReportsArray, isSecured, t} = this.props;
    return (<React.Fragment >
      {
        isSecured &&
        <div className="secured-screen-container">
          <img src={restrictedArt} alt={t('Refresh')} />
          <div className="secured-header">{t('Data Cleared!')}</div>
          <p className="secured-info">{t(`MicroStrategy data has been removed from the workbook. Click 'View Data' to import it again.`)}</p>
          <Button type="primary" className="show-data-btn" onClick={this.showData}>{t('View Data')}</Button>
        </div>
      }
      <Button id="add-data-btn-container" className="add-data-btn floating-button" onClick={() => this.props.addDataAction()}
        disabled={loading}>{t('Add Data')}</Button>
      <span className="refresh-button-container">
        <Popover placement="bottom" content={t('Refresh All Data')} mouseEnterDelay={1}>
          <Button id="refresh-all-btn" className="refresh-all-btn" style={{float: 'right'}} onClick={() => this.refreshAllAction(reportArray, refreshReportsArray)} disabled={loading}>
            {!refreshingAll ? <MSTRIcon type='refresh' /> : <img width='12px' height='12px' src={loadingSpinner} alt={t('Report loading icon')} />}
          </Button>
        </Popover>
      </span>
      <div role="list" className='tables-container'>
        {reportArray.map((report) => <OfficeLoadedFile
          isPrompted={report.isPrompted}
          key={report.bindId}
          fileName={report.name}
          bindingId={report.bindId}
          onClick={officeApiHelper.onBindingObjectClick}
          onDelete={officeDisplayService.removeReportFromExcel}
          isLoading={report.isLoading}
          objectType={report.objectType}
          refreshDate={report.refreshDate} />)}
      </div>
    </React.Fragment>);
  };
}

_FileHistoryContainer.defaultProps = {
  t: (text) => text,
};

function mapStateToProps({officeReducer, historyReducer}) {
  return {
    reportArray: officeReducer.reportArray,
    project: historyReducer.project,
    refreshingAll: officeReducer.isRefreshAll,
    isSecured: officeReducer.isSecured,
  };
}

const mapDispatchToProps = {
  refreshReportsArray,
  toggleSecuredFlag,
};

const WrappedFileHistoryContainer = fileHistoryContainerHOC(_FileHistoryContainer);

export const FileHistoryContainer = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(WrappedFileHistoryContainer));
