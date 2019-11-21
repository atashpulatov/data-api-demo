import * as mockData from '../mockData.js';

function _getReportData(name) {
  let mockReport = {};
  mockData.mockReports.forEach((element) => {
    if (element.name === name) {
      mockReport = element;
    }
  });
  return mockReport;
}

export default { getReportData: _getReportData, };
