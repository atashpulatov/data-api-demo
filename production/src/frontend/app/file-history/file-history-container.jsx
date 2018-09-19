/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'antd';
import { OfficeLoadedFile } from './office-loaded-file.jsx';
import { officeApiHelper } from '../office/office-api-helper';
import { officeDisplayService } from '../office/office-display-service';
import './file-history.css';
/* eslint-enable */

export class _FileHistoryContainer extends Component {
    render() {
        return (
            this.props.project
                ? <div>
                    <h3 style={{ textAlign: 'center' }}>Loaded files</h3>
                    <hr />
                    <List
                        className='ant-list-header-override'
                        size='small'
                        locale={{ emptyText: 'No files loaded.' }}
                        dataSource={this.props.reportArray
                            ? this.props.reportArray
                            : []}
                        renderItem={(report) => (
                            <OfficeLoadedFile
                                fileName={report.name}
                                bindingId={report.bindId}
                                onClick={officeApiHelper.onBindingObjectClick}
                                onDelete={officeDisplayService.removeReportFromExcel}
                                onRefresh={officeDisplayService.refreshReport}
                            />
                        )}
                    />
                    <hr />
                </div>
                : null
        );
    }
}

function mapStateToProps(state) {
    return {
        reportArray: state.officeReducer.reportArray,
        project: state.historyReducer.project,
    };
}

export const FileHistoryContainer = connect(mapStateToProps)(_FileHistoryContainer);
