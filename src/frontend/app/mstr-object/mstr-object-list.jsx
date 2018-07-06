import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import BaseComponent from '../base-component.jsx';
import { DirectoryRow, ReportRow } from './mstr-object-row.jsx'; // eslint-disable-line no-unused-vars
import sessionPropertiesEnum from '../storage/session-properties';
import mstrObjectRestService from './mstr-object-rest-service';
import officeDi from '../office/office-di';
import './mstr-object.css';
import { historyProperties } from '../history/history-properties';

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

    navigateToDir(dirId) {
        const historyObject = {};
        historyObject[historyProperties.command] =
            historyProperties.goInside;
        historyObject[historyProperties.directoryId] = dirId;
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
                <header className='mstr-objects'>
                    All Files
                </header>
                <hr />
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
