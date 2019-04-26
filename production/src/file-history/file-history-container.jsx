import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'antd';
import {OfficeLoadedFile} from './office-loaded-file.jsx';
import {officeApiHelper} from '../office/office-api-helper';
import {officeDisplayService} from '../office/office-display-service';
import {popupController} from '../popup/popup-controller';
import {MSTRIcon} from 'mstr-react-library';
import loadingSpinner from './assets/report_loading_spinner.gif';
import {refreshAll} from '../popup/popup-actions';

import './file-history.css';

export const _FileHistoryContainer = ({reportArray = [], loading, refreshingAll, refreshAll}) => {
  return (<React.Fragment>
    <Button id="add-data-btn-container" className="add-data-btn" onClick={popupController.runPopupNavigation}
      disabled={loading}>Add Data</Button>
    <span className="refresh-button-container">
      <Button className="refresh-all-btn" style={{float: 'right'}} onClick={() => refreshAll(reportArray)} disabled={loading}>
        {!refreshingAll ? <MSTRIcon type='refresh' /> : <img width='12px' height='12px' src={loadingSpinner} alt='Report loading icon' />}
      </Button>
    </span>
    <div role="list" className='tables-container'>
      {reportArray.map((report) => <OfficeLoadedFile
        key={report.bindId}
        fileName={report.name}
        bindingId={report.bindId}
        onClick={officeApiHelper.onBindingObjectClick}
        onDelete={officeDisplayService.removeReportFromExcel}
        isLoading={report.isLoading}
        objectType={report.objectType} />)}
    </div>
  </React.Fragment>);
};

function mapStateToProps(state) {
  return {
    reportArray: state.officeReducer.reportArray,
    project: state.historyReducer.project,
    refreshingAll: state.popupReducer.refreshingAll,
  };
}

const mapDispatchToProps = {
  refreshAll,
};

export const FileHistoryContainer = connect(mapStateToProps, mapDispatchToProps)(_FileHistoryContainer);
