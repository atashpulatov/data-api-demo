/* eslint-disable */
import React from 'react';
import BaseComponent from '../base-component.jsx';
import { DirectoryRow, ReportRow } from './mstr-object-row.jsx';
import mstrObjectRestService from './mstr-object-rest-service';
import officeDi from '../office/office-di';
import './mstr-object.css';
import { historyProperties } from '../history/history-properties';
/* eslint-enable */

const objectsTypesMap = {
    directory: 8,
    report: 3,
    project: 55,
};

class MstrObjects extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            mstrObjects: props.location.state.mstrObjects,
        };
        this.navigateToDir = this.navigateToDir.bind(this);
        this.printObject = this.printObject.bind(this);
    }

    navigateToDir(dirId, directoryName) {
        const historyObject = {};
        historyObject[historyProperties.command] =
            historyProperties.actions.goInside;
        historyObject[historyProperties.directoryId] = dirId;
        historyObject[historyProperties.directoryName] = directoryName;
        this.props.history.push({
            pathname: '/',
            origin: this.props.location,
            historyObject,
        });
    }

    async printObject(objectId) {
        let jsonData = await mstrObjectRestService.getObjectContent(objectId);
        let convertedReport = officeDi.officeConverterService
            .getConvertedTable(jsonData);
        convertedReport.id = jsonData.id;
        officeDi.officeDisplayService.displayReport(convertedReport);
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

export default MstrObjects;
