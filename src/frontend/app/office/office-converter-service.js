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
    attributes.forEach((attribute) => _headers.push(attribute.name));
    metrics.forEach((metric) => _headers.push(metric.name));
    return _headers;
}

function createRows(node, headers, level) {
    level++;
    if (node.children === undefined) {
        let row = {};
        row[headers[level]] = node.element.name;
        row = Object.assign(row, node.metrics);
        return [row];
        // rows.push(Object.assign(row, node.metrics));
    } else {
        let rows = [];
        node.children.forEach((child) => {
            let childRows = createRows(child, headers, level);
            childRows = childRows.map((childRow) => {
                childRow[headers[level]] = node.element.name;
                return childRow;
            });
            // childRows[headers[level]] = node.element.name;
            rows = rows.concat(childRows);
        });
        return rows;
    }
}

function getRows(jsonReport) {
    let rows = [];
    let data = jsonReportTest.result.data.root.children;
    const headers = getHeaders(jsonReport);

    data.forEach((rootNode) => {
        rows = rows.concat(createRows(rootNode, headers, 0));
    });

    // for (let i = 0; i < data.length; i++) {
    //     let dataChildren = data[i].children;
    //     for (let j = 0; j < dataChildren.length; j++) {
    //         let dataGrandChildren = dataChildren[j].children;
    //         for (let k = 0; k < dataGrandChildren.length; k++) {
    //             let row = [];
    //             row.push(data[i].element.formValues.DESC);
    //             row.push(dataChildren[j].element.formValues.DESC);
    //             row.push(dataGrandChildren[k].element.formValues.DESC);
    //             row.push(dataGrandChildren[k].metrics['Count of Customers'].rv);
    //             rows.push(row);
    //         }
    //     }
    // }
    return rows;
}

getConvertedTable(jsonReportTest);
