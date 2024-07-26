import { officeApiHelper } from '../office/api/office-api-helper';

import { ErrorMessages } from '../error/constants';
import { OFFICE_TABLE_EXTA_ROW } from './constants';


class FormattedDataHelper {
    /**
     * Retrieves the shape collection of given woksheet.
     *
     * @param worksheet Excel worksheet
     * @param excelContext Reference to Excel Context used by Excel API functions
     */
    async getShapeCollection(worksheet: Excel.Worksheet, excelContext: Excel.RequestContext): Promise<Excel.ShapeCollection> {
        worksheet.load('shapes');
        await excelContext.sync();

        const shapeCollection = worksheet.shapes;

        shapeCollection.load('items');
        await excelContext.sync();

        return shapeCollection;
    }

    /**
     * Calculates the added dimensions size of a table including the headers/crosstab-headers.
     * 
     * @param excelContext Reference to Excel Context used by Excel API functions
     * @param range Reference to Excel range object.
     * @param prevOfficeTable previous office table
     * @returns
     */
    async calculateRowsAndColumnsSize(
        excelContext: Excel.RequestContext,
        range: Excel.Range,
        prevOfficeTable: Excel.Table,
    ): Promise<{ addedRows: number; addedColumns: number }> {
        prevOfficeTable?.columns.load('count');
        prevOfficeTable?.rows.load('count');

        range.load(['rowCount', 'columnCount'])
        await excelContext.sync();

        const addedColumns = Math.max(0, range.columnCount - prevOfficeTable.columns.count);
        const addedRows = Math.max(0, range.rowCount - prevOfficeTable.rows.count - OFFICE_TABLE_EXTA_ROW);

        return { addedRows, addedColumns };
    }

    /**
     * Deletes the exported worksheet from workbook.
     * 
     * @param excelContext Reference to Excel Context used by Excel API functions
     * @param sourceWorksheet Exported worksheet, where the formatted table resides
     * @returns
     */
    async deleteExportedWorksheet(
        excelContext: Excel.RequestContext,
        sourceWorksheet: Excel.Worksheet,
    ): Promise<void> {
        try {
            if (sourceWorksheet) {
                sourceWorksheet.delete();
                await excelContext.sync();
            }
        } catch (err) {
            // Ignore the thrown exception (error)
            console.error(err)
        }
    }

    /**
     * Retrieves the exported sheet by sheet id. In addition verifies the existence of source worksheet.
     * 
     * @param excelContext Reference to Excel Context used by Excel API functions
     * @param sourceWorksheetId Exported worksheet ID
     * @returns
     */
    async getExportedWorksheetById(
        excelContext: Excel.RequestContext,
        sourceWorksheetId: string,
    ): Promise<Excel.Worksheet> {
        const sourceWorksheet = officeApiHelper.getExcelSheetById(excelContext, sourceWorksheetId);

        if (!sourceWorksheet) {
            throw new Error(ErrorMessages.FORMATTED_DATA_MANIPULATION_FAILURE_MESSAGE);
        }

        return sourceWorksheet;
    }


}

export const formattedDataHelper = new FormattedDataHelper();
