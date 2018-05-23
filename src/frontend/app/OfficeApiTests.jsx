import React, { Component } from 'react'; // eslint-disable-line no-unused-lets
import di from './root-di.js';
import interconnector from './interconnector.js';

class OfficeApiTest extends Component {
    constructor(props) {
        super(props);

        this.onSetColor = this.onSetColor.bind(this);
    }

    onSetColor() {
        window.Excel.run(async (context) => {
            const range = context.workbook.getSelectedRange();
            range.format.fill.color = 'red';
            await context.sync();
        });
    }

    onCreateTable() {
        Excel.run(function (context) {
            let sheet = context.workbook.worksheets.getItem('Sample');
            let expensesTable = sheet.tables.add('A1:D1', true /*hasHeaders*/);
            expensesTable.name = 'ExpensesTable';

            expensesTable.getHeaderRowRange().values = [['Date', 'Merchant', 'Category', 'Amount']];

            expensesTable.rows.add(null /*add rows to the end of the table*/, [
                ['1/1/2017', 'The Phone Company', 'Communications', '$120'],
                ['1/2/2017', 'Northwind Electric Cars', 'Transportation', '$142'],
                ['1/5/2017', 'Best For You Organics Company', 'Groceries', '$27'],
                ['1/10/2017', 'Coho Vineyard', 'Restaurant', '$33'],
                ['1/11/2017', 'Bellows College', 'Education', '$350'],
                ['1/15/2017', 'Trey Research', 'Other', '$135'],
                ['1/15/2017', 'Best For You Organics Company', 'Groceries', '$97']
            ]);

            if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
                sheet.getUsedRange().format.autofitColumns();
                sheet.getUsedRange().format.autofitRows();
            }

            sheet.activate();

            return context.sync();
        });

    }

    onAddToTable() {
        Excel.run(function (context) {
            let sheet = context.workbook.worksheets.getItem('Sample');
            let expensesTable = sheet.tables.getItem('ExpensesTable');

            expensesTable.rows.add(null /*add rows to the end of the table*/, [
                ['1/16/2017', 'THE PHONE COMPANY', 'Communications', '$120'],
                ['1/20/2017', 'NORTHWIND ELECTRIC CARS', 'Transportation', '$142'],
                ['1/20/2017', 'BEST FOR YOU ORGANICS COMPANY', 'Groceries', '$27'],
                ['1/21/2017', 'COHO VINEYARD', 'Restaurant', '$33'],
                ['1/25/2017', 'BELLOWS COLLEGE', 'Education', '$350'],
                ['1/28/2017', 'TREY RESEARCH', 'Other', '$135'],
                ['1/31/2017', 'BEST FOR YOU ORGANICS COMPANY', 'Groceries', '$97']
            ]);

            if (Office.context.requirements.isSetSupported('ExcelApi', 1.2)) {
                sheet.getUsedRange().format.autofitColumns();
                sheet.getUsedRange().format.autofitRows();
            }

            return context.sync();
        })
    }

    onCreateChart() {
        Excel.run(function (context) {
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

    render() {
        return (
            <div>
                <div>
                    <h3>Set colour.</h3>
                    <button onClick={this.onSetColor}>Set color</button>
                </div>
                <div>
                    <h3>TableFunction</h3>
                    <button onClick={this.onCreateTable}>Create Table</button>
                </div>
                <div>
                    <h3>TableFunction</h3>
                    <button onClick={this.onAddToTable}>Add to Table</button>
                </div>
                <div>
                    <h3>TableFunction</h3>
                    <button onClick={this.onCreateChart}>Add Chart</button>
                </div>
                {/* <div>
                    <h3></h3>
                    <button onClick={this.}></button>
                </div> */}
            </div>
        );
    }
}

export default OfficeApiTest;
