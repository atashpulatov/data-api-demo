import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'antd';

class _OfficeLoadedFiles extends Component {
    render() {
        console.log('printing');
        return (
            <List
                size="small"
                header={<div>Header</div>}
                footer={<div>Footer</div>}
                bordered
                dataSource={this.props.reportArray
                    ? this.props.reportArray
                    : []}
                renderItem={(report) => (
                    <List.Item>
                        {report.name}
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
