import { testReport } from '../mockData.js';

let jsonReportTest = testReport;

function getConvertedTable(jsonReport) {
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
    attributes.forEach((attribute) => _headers.push(attribute.name));
    metrics.forEach((metric) => _headers.push(metric.name));
    return _headers;
}

function createRows(node, headers, level = -1) {
    level++;
    let rows = [];
    if (node.children === undefined) {
        let row = createRowEnding(node, headers[level]);
        rows.push(row);
    } else {
        node.children.forEach((child) => {
            let childRows = createRows(child, headers, level);
            childRows = childRows.map((childRow) => {
                childRow[headers[level]] = node.element.name;
                return childRow;
            });
            rows = rows.concat(childRows);
        });
    }
    return rows;
}

function createRowEnding(node, header) {
    let row = {};
    row[header] = node.element.name;
    let metrics = node.metrics;
    for (let property in metrics) {
        if (metrics.hasOwnProperty(property)) {
            row[property] = metrics[property].rv;
        }
    }
    return row;
}

function getRows(jsonReport) {
    let rows = [];
    const headers = getHeaders(jsonReport);

    let data = jsonReport.result.data.root.children;
    data.forEach((rootNode) => {
        rows = rows.concat(createRows(rootNode, headers));
    });
    return rows;
}

export default {
    getConvertedTable,
};
