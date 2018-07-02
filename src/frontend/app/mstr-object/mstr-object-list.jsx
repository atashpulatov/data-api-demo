import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import BaseComponent from '../base-component.jsx';
import { DirectoryRow, ReportRow } from './mstr-object-row.jsx'; // eslint-disable-line no-unused-vars
import sessionPropertiesEnum from '../storage/session-properties';
import mstrObjectRestService from './mstr-object-rest-service';
import officeDi from '../office/office-di';
import './mstr-object.css';

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

    navigateToDir(folderId) {
        const sessionObject = {};
        sessionObject[sessionPropertiesEnum.folderId] = folderId;
        this.props.history.push({
            pathname: '/',
            origin: this.props.location,
            sessionObject,
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
            <div className='objects-container'>
                <p className='mstr-objects-header'>
                    All Files
                </p>
                <hr className='projects-header-line' />
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
            </div>
        );
    }
};

export default MstrObjects;
