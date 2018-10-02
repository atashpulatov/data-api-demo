/* eslint-disable */
import React from 'react';
import { DirectoryRow, ReportRow } from './mstr-object-row-antd.jsx';
import './mstr-object.css';
import { officeDisplayService } from '../office/office-display-service';
import { reduxStore } from '../store';
import { connect } from 'react-redux';
import { withNavigation } from '../navigation/with-navigation.jsx';
import { mstrObjectListHelper } from './mstr-object-list-helper';
import { sessionHelper } from '../storage/session-helper';
import { Bootstrap } from '../attribute-selector/bootstrap.jsx';
import { Modal } from 'antd';
/* eslint-enable */

const objectsTypesMap = {
    directory: 8,
    report: 3,
    project: 55,
};

export class _MstrObjects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mstrObjects: [],
            modalVisible: false,
            triggerUpdate: false,
        };
        this.showModal = this.showModal.bind(this);
        this.onTriggerUpdate = this.onTriggerUpdate.bind(this);
    }

    async componentDidMount() {
        const dirArray = reduxStore.getState().historyReducer.directoryArray;
        sessionHelper.enableLoading();
        const data = await mstrObjectListHelper.fetchContent(dirArray);
        this.setState({
            mstrObjects: data,
        });
        sessionHelper.disableLoading();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.body !== this.state.body) {
            console.log(this.state.body);
            this.printReportLocalized(this.state.currentReportId, this.state.body);
        }
        const dirArray = reduxStore.getState().historyReducer.directoryArray;
        const data = await mstrObjectListHelper.fetchContent(dirArray);
        const arraysEqual = mstrObjectListHelper.compareMstrObjectArrays(this.state.mstrObjects, data);
        if (!arraysEqual) {
            this.setState({
                mstrObjects: data,
            });
            sessionHelper.disableLoading();
        }
    }

    printReportLocalized(reportId, body){
        officeDisplayService.printObject(reportId, null, null, null, body);
    }

    showModal = (reportId) => {
        this.setState({
            modalVisible: true,
            currentReportId: reportId,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    }

    onTriggerUpdate(body) {
        this.setState({
            body,
            triggerUpdate: false,
        });
    }

    handleOk = () => {
        this.setState({
            triggerUpdate: true,
            modalVisible: false,
        });
    }

    render() {
        return (
            <article className='objects-container'>
                <ul className='no-padding object-list'>
                    {this.state.mstrObjects
                        .filter((obj) => objectsTypesMap.directory === obj.type)
                        .map((directory) => (
                            <DirectoryRow key={directory.id}
                                directory={directory}
                                onClick={mstrObjectListHelper.navigateToDir} />
                        ))}
                </ul>
                <ul className='no-padding object-list'>
                    {this.state.mstrObjects
                        .filter((obj) => objectsTypesMap.report === obj.type)
                        .map((report) => (
                            <ReportRow key={report.id}
                                report={report}
                                // onClick={officeDisplayService.printObject} />
                                onClick={this.showModal} />
                        ))}
                </ul>
                <Modal
                    title="Load report"
                    visible={this.state.modalVisible}
                    onOk={this.handleOk}
                    width='1100px'
                    onCancel={this.handleCancel}>
                    <Bootstrap
                        reportId={this.state.currentReportId}
                        triggerUpdate={this.state.triggerUpdate}
                        onTriggerUpdate={this.onTriggerUpdate}
                    />
                </Modal>
            </article>
        );
    }
};

function mapStateToProps(state) {
    return {
        directoryArray: state.historyReducer.directoryArray,
    };
}

const _mstrObjectsWithRedux = connect(mapStateToProps)(_MstrObjects);
export const MstrObjects = withNavigation(_mstrObjectsWithRedux);
