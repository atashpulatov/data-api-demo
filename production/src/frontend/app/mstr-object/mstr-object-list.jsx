/* eslint-disable */
import React from 'react';
import { DirectoryRow, ReportRow } from './mstr-object-row.jsx';
import './mstr-object.css';
import { officeDisplayService } from '../office/office-display-service';
import { reduxStore } from '../store';
import { connect } from 'react-redux';
import { withNavigation } from '../navigation/with-navigation.jsx';
import { mstrObjectListHelper } from './mstr-object-list-helper';
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
    }

    async componentDidMount() {
        const dirArray = reduxStore.getState().historyReducer.directoryArray;
        const data = await mstrObjectListHelper.fetchContent(dirArray);
        this.setState({
            mstrObjects: data,
        });
    }

    async componentDidUpdate() {
        const dirArray = reduxStore.getState().historyReducer.directoryArray;
        const data = await mstrObjectListHelper.fetchContent(dirArray);
        console.log('in component did update');
        const arraysEqual = mstrObjectListHelper.compareMstrObjectArrays(this.state.mstrObjects, data);
        if (!arraysEqual) {
            this.setState({
                mstrObjects: data,
            });
        }
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
