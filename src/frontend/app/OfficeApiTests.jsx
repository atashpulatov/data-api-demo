import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
// import di from './root-di.js';
import reportDI from './report/report-di.js';
import officeDI from './office/office-di.js';
import officeHelper from './office/office-api-helper';
import RadioSelectionForm from './radio-selection-form.jsx';
import { mockReports } from './mockData';

class OfficeApiTest extends Component {
    constructor(props) {
        super(props);

        this.onSetColor = this.onSetColor.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);

        this.state = {
            selectedOption: 'MediumReport',
        };
        this.onImportReport = this.onImportReport.bind(this);
        this.reportList = this.generateReportList();
    }

    generateReportList() {
        return mockReports.map((report) => {
            return {
                id: report.id,
                name: report.name,
                handleOptionChange: this.handleOptionChange,
            };
        });
    }

    handleOptionChange(changeEvent) {
        this.setState({
            selectedOption: changeEvent.target.value,
        });
    }

    onSetColor() {
        window.Excel.run(async (context) => {
            const range = context.workbook.getSelectedRange();
            range.format.fill.color = 'red';
            await context.sync();
        });
    }

    onCreateChart() {
        Excel.run((context) => {
            let range = context.workbook.getSelectedRange();
            let sheet = context.workbook.worksheets.getActiveWorksheet();
            let dataRange = range;
            let chart = sheet.charts.add('Line', dataRange, 'auto');

            chart.title.text = 'Sales Data';
            chart.legend.position = 'right';
            chart.legend.format.fill.setSolidColor('white');
            chart.dataLabels.format.font.size = 15;
            chart.dataLabels.format.font.color = 'black';

            return context.sync();
        }).catch();
    }

    onImportReport() {
        let jsonData = reportDI.reportRestService.getReportData(this.state.selectedOption);
        let convertedReport = officeDI.officeConverterService
            .getConvertedTable(jsonData);
        convertedReport.id = jsonData.id;
        officeDI.officeDisplayService.displayReport(convertedReport);
    }

    render() {
        return (
            <div>
                <div>
                    <h3>Set colour.</h3>
                    <button onClick={this.onSetColor}>Set color</button>
                </div>
                <div>
                    <h3>Create chart</h3>
                    <button onClick={this.onCreateChart}>Add Chart</button>
                </div>
                <RadioSelectionForm reportList={this.reportList}
                    onImportReport={this.onImportReport}
                    selectedOption={this.state.selectedOption} />
                {/* <div>
                    <h3></h3>
                    <button onClick={this.}></button>
                </div> */}
            </div>
        );
    }
}

export default OfficeApiTest;
