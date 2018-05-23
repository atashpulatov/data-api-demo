import { testReport } from '../mockData.js';

let jsonReportTest = testReport;

export default function getConvertedTable(jsonReport) {
    let _headers = getHeaders(jsonReport);
    let _rows = getRows(jsonReport);
    console.log(jsonReportTest);

    return {
        headers: _headers,
        rows: _rows,
    };
}

function getHeaders(jsonReport) {
    let _headers = [];
    let attributes = jsonReport.result.definition.attributes;
    let metrics = jsonReport.result.definition.metrics;
    for (let i = 0; i < attributes.length; i++) {
        _headers.push(attributes[i].name);
    }
    for (let i = 0; i < metrics.length; i++) {
        _headers.push(metrics[i].name);
    }
    return _headers;
}

function getRows(jsonReport) {
    let _rows = [];
    let data = jsonReportTest.result.data.root.children;
    for (let i = 0; i < data.length; i++) {

        let dataChildren = data[i].children;
        for (let j = 0; j < dataChildren.length; j++) {
            let dataGrandChildren = dataChildren[j].children;
            for (let k = 0; k < dataGrandChildren.length; k++) {
                let row = [];
                row.push(data[i].element.formValues.DESC);
                row.push(dataChildren[j].element.formValues.DESC);
                row.push(dataGrandChildren[k].element.formValues.DESC);
                row.push(dataGrandChildren[k].metrics['Count of Customers'].rv);
                _rows.push(row);
            }
        }
    }
    return _rows;
}

getConvertedTable(jsonReportTest);
