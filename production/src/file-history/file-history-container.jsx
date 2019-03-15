import React, {Component} from 'react';
import {connect} from 'react-redux';
import {List, Button} from 'antd';
import {OfficeLoadedFile} from './office-loaded-file.jsx';
import {officeApiHelper} from '../office/office-api-helper';
import {officeDisplayService} from '../office/office-display-service';
import {popupController} from '../popup/popup-controller';
import './file-history.css';

export class _FileHistoryContainer extends Component {
  render() {
    return (
      <div>
        <Button className="add-data-btn" onClick={popupController.runPopupNavigation}>Add Data</Button>
        <List
          className='ant-list-header-override'
          size='small'
          // TODO: Remove when supporting simultaneous datasets refresh
          loading={{indicator: <span></span>, spinning: !!this.props.reportArray.find((e) => e.isLoading)}}
          locale={{emptyText: 'No files loaded.'}}
          dataSource={this.props.reportArray
            ? this.props.reportArray
            : []}
          renderItem={(report) => (
            (<OfficeLoadedFile
              fileName={report.name}
              bindingId={report.bindId}
              onClick={officeApiHelper.onBindingObjectClick}
              onDelete={officeDisplayService.removeReportFromExcel}
              onRefresh={officeDisplayService.refreshReport}
              isLoading={report.isLoading}
              objectType={report.objectType}
            />)
          )}
        />
      </div>);
  }
}

function mapStateToProps(state) {
  return {
    reportArray: state.officeReducer.reportArray,
    project: state.historyReducer.project,
  };
}

export const FileHistoryContainer = connect(mapStateToProps)(_FileHistoryContainer);
