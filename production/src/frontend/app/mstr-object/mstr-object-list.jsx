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
import { AttributeSelector } from '../attribute-selector/attribute-selector.jsx';
import { Modal } from 'antd';
import { selectorProperties } from '../attribute-selector/selector-properties';
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
            // modalVisible: false,
            triggerUpdate: false,
        };
        this.showPopup = this.showPopup.bind(this);
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
            this.printReportLocalized(this.state.popupReportId
                , this.state.body);
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

    printReportLocalized = (reportId, body) => {
        console.log('im in print');
        officeDisplayService.printObject(reportId, null, null, null, body);
    }

    showPopup = (reportId) => {
        this.setState({
            popupReportId: reportId,
        })
        const session = sessionHelper.getSession();
        Excel.run(async (context) => {
            Office.context.ui.displayDialogAsync(
                'https://localhost:3000/popup.html'
                + '?envUrl=' + session.url
                + '&token=' + session.authToken
                + '&projectId=' + session.projectId
                + '&reportId=' + reportId,
                { height: 62, width: 50, displayInIframe: true },
                (asyncResult) => {
                    console.log(asyncResult);
                    this.dialog = asyncResult.value;
                    this.dialog.addEventHandler(
                        Office.EventType.DialogMessageReceived,
                        this.onMessageFromPopup);
                });

            await context.sync();
        });
        // TODO: remove below
        // this.setState({
        //     modalVisible: true,
        //     currentReportId: reportId,
        // });
    }

    onMessageFromPopup = (arg) => {
        const message = arg.message
        console.log(message);
        const response = JSON.parse(message);
        switch (response.command) {
            case selectorProperties.commandOk:
                this.handleOk();
                break;
            case selectorProperties.commandCancel:
                this.handleCancel();
                break;
            case selectorProperties.commandOnUpdate:
                this.onTriggerUpdate(response.body);
                break;
            default:
                break;
        }
    }

    handleCancel = () => {
        this.dialog.close();
    }

    handleOk = (body) => {
        // this.dialog.close();
        // this.setState()
        // this.setState({
        //     triggerUpdate: true,
        // });
    }

    onTriggerUpdate = (body) => {
        console.log(body);
        this.dialog.close();
        this.setState({
            body,
            triggerUpdate: false,
        });
    }

    render() {
        const session = sessionHelper.getSession();
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
                                onClick={officeDisplayService.printObject}
                                onFilterReport={this.showPopup} />
                        ))}
                </ul>
                {/* <Modal
                    title="Load report"
                    visible={this.state.modalVisible}
                    onOk={this.handleOk}
                    width='1100px'
                    onCancel={this.handleCancel}>
                    <AttributeSelector
                        session={session}
                        reportId={this.state.currentReportId}
                        triggerUpdate={this.state.triggerUpdate}
                        onTriggerUpdate={this.onTriggerUpdate}
                    />
                </Modal> */}
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
