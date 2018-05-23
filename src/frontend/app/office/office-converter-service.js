import { testReport } from '../mockData.js';

let jsonReportTest = testReport;

export default function getConvertedTable(jsonReport) {
    let _headers = getHeaders(jsonReport);
    let _rows = getRows(jsonReport);

    return {
        headers: _headers,
        rows: _rows,
    };
}

function getHeaders(jsonReport) {
    let _headers;

    return _headers;
}

function getRows(jsonReport) {
    let _rows;

    return _rows;
}

getConvertedTable(jsonReportTest);
