/* eslint-disable */
import React from 'react';
import { DirectoryRow, ReportRow } from './mstr-object-row.jsx';
import { mstrObjectRestService } from './mstr-object-rest-service';
import './mstr-object.css';
import { historyProperties } from '../history/history-properties';
import { officeConverterService } from '../office/office-converter-service';
import { officeDisplayService } from '../office/office-display-service';
import { reduxStore } from '../store';
import { historyManager } from '../history/history-manager';
import { connect } from 'react-redux';
import { withNavigation } from '../navigation/with-navigation';
import { sessionReducer } from '../storage/session-reducer';
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
        };
        this.refreshContent = this.refreshContent.bind(this);
        this.navigateToDir = this.navigateToDir.bind(this);
        this.printObject = this.printObject.bind(this);
    }

    async componentDidMount() {
        await this.refreshContent();
    }

    async componentDidUpdate() {
        await this.refreshContent();
    }

    async refreshContent() {
        const envUrl = reduxStore.getState().sessionReducer.envUrl;
        const token = reduxStore.getState().sessionReducer.authToken;
        const { projectId } = reduxStore.getState().historyReducer.project;
        let data = [];
        if (historyManager.isDirectoryStored()) {
            const { dirId } = historyManager.getCurrentDirectory();
            data = await mstrObjectRestService
                .getFolderContent(envUrl, token, projectId, dirId);
        } else {
            data = await mstrObjectRestService
                .getProjectContent(envUrl, token, projectId);
        }
        this.setState({
            mstrObjects: data,
        });
    }

    navigateToDir(directoryId, directoryName) {
        reduxStore.dispatch({
            type: historyProperties.actions.goInside,
            dirId: directoryId,
            dirName: directoryName,
        });
    }

    async printObject(objectId) {
        let jsonData = await mstrObjectRestService.getObjectContent(objectId);
        let convertedReport = officeConverterService
            .getConvertedTable(jsonData);
        convertedReport.id = jsonData.id;
        officeDisplayService.displayReport(convertedReport);
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
                                onClick={this.navigateToDir} />
                        ))}
                </ul>
                <ul className='no-padding object-list'>
                    {this.state.mstrObjects
                        .filter((obj) => objectsTypesMap.report === obj.type)
                        .map((report) => (
                            <ReportRow key={report.id}
                                report={report}
                                onClick={this.printObject} />
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
