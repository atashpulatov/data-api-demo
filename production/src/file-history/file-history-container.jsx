import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from 'antd';
import {OfficeLoadedFile} from './office-loaded-file.jsx';
import {officeApiHelper} from '../office/office-api-helper';
import {officeDisplayService} from '../office/office-display-service';
import {popupController} from '../popup/popup-controller';
import './file-history.css';

export class _FileHistoryContainer extends Component {
  render() {
    const {reportArray, loading} = this.props;
    return (
      <div>
        <Button id="add-data-btn-container" className="add-data-btn" onClick={popupController.runPopupNavigation}
          disabled={loading}>Add Data</Button>
        <div>
          {reportArray.map((report) => <OfficeLoadedFile
            key={report.bindId}
            fileName={report.name}
            bindingId={report.bindId}
            onClick={officeApiHelper.onBindingObjectClick}
            onDelete={officeDisplayService.removeReportFromExcel}
            onRefresh={officeDisplayService.refreshReport}
            isLoading={report.isLoading}
            objectType={report.objectType}/>)}
        </div>
      </div>);
  }
}

function mapStateToProps(state) {
  return {
    reportArray: state.officeReducer.reportArray,
    project: state.historyReducer.project,
  };
}

_FileHistoryContainer.defaultProps = {
  reportArray: [],
};

export const FileHistoryContainer = connect(mapStateToProps)(_FileHistoryContainer);
