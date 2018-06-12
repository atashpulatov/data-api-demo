import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import BaseComponent from '../base-component.jsx';
import { DirectoryRow, ReportRow } from './mstr-object-row.jsx'; // eslint-disable-line no-unused-vars

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
    }

    render() {
        return (
            <div>
                <ul>
                    {this.state.mstrObjects
                        .filter((obj) => objectsTypesMap.directory === obj.type)
                        .map((directory) => (
                            <DirectoryRow key={directory.id}
                                directory={directory} />
                        ))}
                </ul>
                <ul>
                    {this.state.mstrObjects
                        .filter((obj) => objectsTypesMap.report === obj.type)
                        .map((report) => (
                            <ReportRow key={report.id} report={report} />
                        ))}
                </ul>
            </div>
        );
    }
};

export default MstrObjects;
