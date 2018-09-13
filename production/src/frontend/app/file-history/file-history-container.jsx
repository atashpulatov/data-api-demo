/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'antd';
import { OfficeLoadedFile } from './office-loaded-file.jsx';
import { officeApiHelper } from '../office/office-api-helper';
/* eslint-enable */

class _FileHistoryContainer extends Component {
    render() {
        return (
            this.props.project
                ? <List
                    size='small'
                    bordered
                    header={<h3>Loaded files</h3>}
                    style={{ borderLeft: 'none', borderRight: 'none' }}
                    locale={{ emptyText: 'No files loaded.' }}
                    dataSource={this.props.reportArray
                        ? this.props.reportArray
                        : []}
                    renderItem={(report) => (
                        <div
                        className='cursor-is-pointer'>
                            <List.Item>
                                <OfficeLoadedFile
                                    name={report.name}
                                    bindingId={report.bindId}
                                    onClick={officeApiHelper.onBindingObjectClick}
                                />
                            </List.Item>
                        </div>
                    )}
                />
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
