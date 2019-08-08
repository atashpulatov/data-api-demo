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
import {errorService} from '../error/error-handler';
import {authenticationHelper} from '../authentication/authentication-helper';
import restrictedArt from './assets/art_restricted_access_blue.svg';
import {notificationService} from '../notification/notification-service';
import {fileHistoryHelper} from './file-history-helper';

import './file-history.css';
import {withTranslation} from 'react-i18next';

export class _FileHistoryContainer extends React.Component {
  constructor(props) {
    console.log('------props', props.reportArray);
    super(props);
    if (officeStoreService.isFileSecured()) {
      props.toggleSecuredFlag(true);
    }
    this.state = {
      allowRefreshAllClick: true,
    };
  }

  async componentDidMount() {
    this._ismounted = true;
    await this.addRemoveReportListener();
  }

  async componentWillUnmount() {
    this._ismounted = false;
    await this.deleteRemoveReportListener();
  }

  addRemoveReportListener = async () => {
    const excelContext = await officeApiHelper.getExcelContext();
    this.eventRemove = excelContext.workbook.tables.onDeleted.add(async (e) => {
      try {
        await Promise.all([officeApiHelper.getExcelSessionStatus(), authenticationHelper.validateAuthToken()]);
        const {name} = this.props.reportArray.find((report) => report.bindId === e.tableName);
        officeDisplayService.removeReportFromStore(e.tableName);
        const message = this.props.t('{{name}} has been removed from the workbook.', {name});
        notificationService.displayTranslatedNotification('success', message);
      } catch (error) {
        return errorService.handleError(error);
      }
    });
    await excelContext.sync();
  }

  deleteRemoveReportListener = async () => {
    const test = this.eventRemove.context;
    this.eventRemove.remove();
    await test.sync();
  }

  refreshAllAction = (reportArray, refreshAll) => {
    this.state.allowRefreshAllClick && this.setState({allowRefreshAllClick: false}, async () => {
      await refreshAll(reportArray, true);
      this._ismounted && this.setState({allowRefreshAllClick: true});
    });
  };

  showData = async () => {
    try {
      await Promise.all([officeApiHelper.getExcelSessionStatus(), authenticationHelper.validateAuthToken()]);
      const {reportArray, refreshReportsArray, toggleSecuredFlag} = this.props;
      this.refreshAllAction(reportArray, refreshReportsArray);
      toggleSecuredFlag(false);
    } catch (error) {
      return errorService.handleError(error);
    }
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
          isCrosstab={report.isCrosstab}
          crosstabHeaderDimensions={report.crosstabHeaderDimensions}
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
