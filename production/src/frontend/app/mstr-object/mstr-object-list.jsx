/* eslint-disable */
import React from 'react';
import { BaseComponent } from '../base-component.jsx';
import { DirectoryRow, ReportRow } from './mstr-object-row.jsx';
import { mstrObjectRestService } from './mstr-object-rest-service';
import './mstr-object.css';
import { historyProperties } from '../history/history-properties';
import { officeConverterService } from '../office/office-converter-service';
import { officeDisplayService } from '../office/office-display-service';
import { notification, message } from 'antd';
/* eslint-enable */

const objectsTypesMap = {
    directory: 8,
    report: 3,
    project: 55,
};

export class MstrObjects extends BaseComponent {
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
        let convertedReport = officeConverterService
            .getConvertedTable(jsonData);
        convertedReport.id = jsonData.id;
        const result = await officeDisplayService.displayReport(convertedReport);
        //this.bindNamedItem('ComplexReport', 'testid');
        console.log(result);
        this.displayAllBindingNames();
    }


    displayAllBindingNames() {
        Office.context.document.bindings.getAllAsync(function (asyncResult) {
            var bindingString = '';
            for (var i in asyncResult.value) {
                bindingString += asyncResult.value[i].id + '\n';
            }
            message.info('This is a normal message');
            console.log('Existing bindings: ' + bindingString);
        });
    }

    bindNamedItem(tableName, tableId) {
        Office.context.document.bindings.addFromNamedItemAsync(
            tableName, 'table', { id: tableId }, function (result) {
                if (result.status == 'succeeded') {
                    console.log('Added new binding with type: ' + result.value.type + ' and id: ' + result.value.id);
                } else {
                    console.error('Error: ' + result.error.message);
                }
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
                                onClick={this.printObject} />
                        ))}
                </ul>
            </article>
        );
    }
};
