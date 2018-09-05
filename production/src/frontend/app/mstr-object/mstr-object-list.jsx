/* eslint-disable */
import React from 'react';
import { BaseComponent } from '../base-component.jsx';
import { DirectoryRow, ReportRow } from './mstr-object-row.jsx';
import { mstrObjectRestService } from './mstr-object-rest-service';
import './mstr-object.css';
import { historyProperties } from '../history/history-properties';
import { officeConverterService } from '../office/office-converter-service';
import { officeDisplayService } from '../office/office-display-service';
import { Modal, message } from 'antd';
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
        this.displayAllBindingNames = this.displayAllBindingNames.bind(this);
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
        const result = officeDisplayService.displayReport(convertedReport);
        await this.bindNamedItem(result.tableName, convertedReport.id, result.startCell, this.onBindingDataChanged);
        console.log(result);
        this.displayAllBindingNames();
    }


    displayAllBindingNames() {
        Office.context.document.bindings.getAllAsync(function (asyncResult) {
            var bindingString = '';
            for (var i in asyncResult.value) {
                bindingString += asyncResult.value[i].id + '\n';
            }
            message.info(bindingString);
            console.log('Existing bindings: ' + bindingString);
        });
    }

    async bindNamedItem(tableName, tableId, startCell) {
        const bindingId = `${startCell}${tableId}`;
        Office.context.document.bindings.addFromNamedItemAsync(
            tableName, 'table', { id: bindingId }, (asyncResult) => {
                console.log('adding eventHandler');
                const selectString = `bindings#${bindingId}`;
                console.log(selectString);
                Office.select(selectString,
                    function onError() {
                        console.log('error on attaching event handler');
                    }).addHandlerAsync(Office.EventType.BindingDataChanged,
                        (eventArgs) => {
                            onBindingDataChanged(eventArgs);
                        });
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


// when data in the table is changed, this event will be triggered.
const onBindingDataChanged = (eventArgs) => {
    console.log('triggered change');
    Excel.run(function (ctx) {
        // highlight the table in orange to indicate data has been changed.
        ctx.workbook.bindings.getItem(eventArgs.binding.id).getTable().getDataBodyRange().format.fill.color = 'Orange';
        return ctx.sync().then(function () {
            console.log('The value in this table got changed!');
        })
            .catch(function (error) {
                console.log(JSON.stringify(error));
            });
    });
};
