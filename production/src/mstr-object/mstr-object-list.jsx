/* eslint-disable */
import React from 'react';
import { DirectoryRow, ReportRow } from './mstr-object-row.jsx';
import './mstr-object.css';
import { officeDisplayService } from '../office/office-display-service';
import { reduxStore } from '../store';
import { connect } from 'react-redux';
import { withNavigation } from '../navigation/with-navigation.jsx';
import { mstrObjectListHelper } from './mstr-object-list-helper';
import { sessionHelper } from '../storage/session-helper';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { environment } from '../global-definitions';
import { errorService } from '../error/error-handler.js';
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
        try {
            const dirArray = reduxStore.getState().historyReducer.directoryArray;
            sessionHelper.enableLoading();
            const data = await mstrObjectListHelper.fetchContent(dirArray);
            this.setState({
                mstrObjects: data,
            });
        } catch (error) {
            errorService.handleError(error);
        } finally {
            sessionHelper.disableLoading();
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        try {
            if (prevState.body !== this.state.body) {
                this.printReportLocalized(this.state.popupReportId
                    , this.state.body);
            }
            const project = reduxStore.getState().historyReducer.project;
            if (!project) {
                sessionHelper.disableLoading();
                return;
            };
            const dirArray = reduxStore.getState().historyReducer.directoryArray;
            const data = await mstrObjectListHelper.fetchContent(dirArray);
            const arraysEqual = mstrObjectListHelper.compareMstrObjectArrays(this.state.mstrObjects, data);
            if (!arraysEqual) {
                this.setState({
                    mstrObjects: data,
                });
            }
        } catch (error) {
            errorService.handleError(error);
        } finally {
            sessionHelper.disableLoading();
        }
    }

    printReportLocalized = (reportId, body) => {
        officeDisplayService.printObject(reportId, null, null, null, body);
    }

    showPopup = (reportId) => {
        this.setState({
            popupReportId: reportId,
        })
        const session = sessionHelper.getSession();
        Excel.run(async (context) => {
            Office.context.ui.displayDialogAsync(
                `${environment.scheme}://${environment.host}:${environment.port}/popup.html`
                + '?envUrl=' + session.url
                + '&token=' + session.authToken
                + '&projectId=' + session.projectId
                + '&reportId=' + reportId,
                { height: 62, width: 50, displayInIframe: true },
                (asyncResult) => {
                    this.dialog = asyncResult.value;
                    this.dialog.addEventHandler(
                        Office.EventType.DialogMessageReceived,
                        this.onMessageFromPopup);
                });
            await context.sync();
        });
    }

    onMessageFromPopup = (arg) => {
        const message = arg.message
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

    onTriggerUpdate = (body) => {
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
