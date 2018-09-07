import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'antd';
import { OfficeLoadedFile } from './office-loaded-file.jsx';
import { officeApiHelper } from './office/office-api-helper';

class _OfficeLoadedFiles extends Component {

    render() {
        console.log('printing');
        return (
            <List
                size="small"
                bordered
                header={<p>Loaded files</p>}
                style={{ 'border-left': 'none', 'border-right': 'none', 'margin-bottom': '5px' }}
                locale={{ emptyText: 'No files loaded.' }}
                dataSource={this.props.reportArray
                    ? this.props.reportArray
                    : []}
                renderItem={(report) => (
                    <List.Item>
                        <OfficeLoadedFile
                            name={report.name}
                            bindingId={report.bindId}
                            onClick={officeApiHelper.onBindingObjectClick}
                        />
                    </List.Item>
                )}
            />
        );
    }
}

function mapStateToProps(state) {
    return { reportArray: state.officeReducer.reportArray };
}

export const OfficeLoadedFiles = connect(mapStateToProps)(_OfficeLoadedFiles);
