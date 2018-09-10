/* eslint-disable */
import React from 'react';
import { DirectoryRow, ReportRow } from './mstr-object-row.jsx';
import './mstr-object.css';
import { historyProperties } from '../history/history-properties';
import { officeDisplayService } from '../office/office-display-service';
import { reduxStore } from '../store';
import { historyHelper } from '../history/history-helper';
import { connect } from 'react-redux';
import { withNavigation } from '../navigation/with-navigation.jsx';
import { mstrObjectRestService } from './mstr-object-rest-service';
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
        this.refreshContent = this.fetchContent.bind(this);
        this.navigateToDir = this.navigateToDir.bind(this);
    }

    async componentDidMount() {
        const dirArray = reduxStore.getState().historyReducer.directoryArray;
        await this.fetchContent(dirArray);
    }

    async componentDidUpdate() {
        const dirArray = reduxStore.getState().historyReducer.directoryArray;
        await this.fetchContent(dirArray);
    }

    async fetchContent(dirArray) {
        const envUrl = reduxStore.getState().sessionReducer.envUrl;
        const token = reduxStore.getState().sessionReducer.authToken;
        const { projectId } = reduxStore.getState()
            .historyReducer.project || {};
        let data = [];
        if (historyHelper.isDirectoryStored(dirArray)) {
            const { dirId } = historyHelper
                .getCurrentDirectory(dirArray);
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
                                onClick={officeDisplayService.printObject} />
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
