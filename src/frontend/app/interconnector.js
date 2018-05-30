import reportDI from './report/report-di.js';
import officeDI from './office/office-di.js';

export default function importReport(context) {
    let jsonData = reportDI.reportRestService.getReportData();
    let convertedReport = officeDI.officeConverterService
        .getConvertedTable(jsonData);
    officeDI.officeDisplayService(convertedReport);
}
