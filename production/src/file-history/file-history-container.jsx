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
import {toggleStoreSecuredFlag} from '../office/office-actions';
import {errorService} from '../error/error-handler.js';

import './file-history.css';

export class _FileHistoryContainer extends React.Component {
  constructor(props) {
    super(props);
    if (officeStoreService.isFileSecured()) {
      this.props.toggleStoreSecuredFlag(true);
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

  secureData = async () => {
    try {
      const excelContext = await officeApiHelper.getExcelContext();
      this.props.reportArray.forEach((report) => {
        const tableObject = excelContext.workbook.tables.getItem(report.bindId);
        const tableRange = tableObject.getDataBodyRange();
        tableRange.clear(Excel.ClearApplyTo.contents);
      });
      this.toggleSecured(true);
      await excelContext.sync();
    } catch (error) {
      errorService.handleOfficeError(error);
    }
  }

  showData = (reportArray, refreshAll) => {
    this.refreshAllAction(reportArray, refreshAll);
    this.toggleSecured(false);
  }

  toggleSecured = (isSecured) => {
    officeStoreService.toggleFileSecuredFlag(isSecured);
    this.props.toggleStoreSecuredFlag(isSecured);
  }

  render() {
    const {reportArray = [], loading, refreshingAll, refreshReportsArray, isSecured} = this.props;
    return (<React.Fragment >
      {isSecured &&
        <div className="secured-screen-container">
          <div>
            <div>File is secured</div>
            <Button onClick={() => this.showData(reportArray, refreshReportsArray)}>Show Data</Button>
          </div>
        </div>
      }
      <Button id="add-data-btn-container" className="add-data-btn" onClick={() => this.props.addDataAction()}
        disabled={loading}>Add Data</Button>
      <span>
        <Button className="refresh-all-btn" style={{float: 'right'}} onClick={this.secureData}>
          Secure
        </Button>
      </span>
      <span className="refresh-button-container">
        <Popover placement="bottom" content='Refresh All Data' mouseEnterDelay={1}>
          <Button className="refresh-all-btn" style={{float: 'right'}} onClick={() => this.refreshAllAction(reportArray, refreshReportsArray)} disabled={loading}>
            {!refreshingAll ? <MSTRIcon type='refresh' /> : <img width='12px' height='12px' src={loadingSpinner} alt='Report loading icon' />}
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
  toggleStoreSecuredFlag,
};

const WrappedFileHistoryContainer = fileHistoryContainerHOC(_FileHistoryContainer);

export const FileHistoryContainer = connect(mapStateToProps, mapDispatchToProps)(WrappedFileHistoryContainer);
