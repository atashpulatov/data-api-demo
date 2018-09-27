import React, {Component} from 'react';
import {Table} from 'antd';

class PreviewTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    getColumns(data) {
        if (!data) {
            return;
        }
        const rawcolumns = [...data.attributes, ...data.metrics];
        const columns = rawcolumns.map((column) => {
            return {
                title: column,
                dataIndex: column,
            };
        });
        return columns;
    }

    getData(previewData) {
        if (!previewData || !previewData.data) {
            return;
        }
        const data = previewData.data.map((row, index) => {
            return {
                ...row,
                key: index,
            };
        });
        return data;
    }

    emptyData(data) {
        return !data || data.length === 0;
    }

    lessThan15(previewData) {
        return this.emptyData(previewData) || previewData.data.length < 15;
    }

    render() {
        return (
            <div>
                <Table id='mstr-table' columns={this.getColumns(this.props.previewData)}
                    dataSource={this.getData(this.props.previewData)}
                    size='small'
                    bordered
                    loading={this.emptyData(this.props.previewData)}
                    pagination={false}
                    scroll={{x: true}} />
                <div className='preview-note' style={{display: this.lessThan15(this.props.previewData) ? 'none' : 'block'}}>Note: Only the first 15 rows are shown</div>
            </div>
        );
    }
}

export default PreviewTable;
