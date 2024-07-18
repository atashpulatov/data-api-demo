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
     * Calculates the added dimensions count of a table.
     * 
     * @param excelContext Reference to Excel Context used by Excel API functions
     * @param range Reference to Excel range object.
     * @param prevOfficeTable previous office table
     * @returns
     */
    async calculateDimensionsCount(
        excelContext: Excel.RequestContext,
        range: Excel.Range,
        prevOfficeTable: Excel.Table,
    ): Promise<{ addedRows: number; addedColumns: number }> {
        prevOfficeTable.columns.load('count');
        prevOfficeTable.rows.load('count');

        range.load(['rowCount', 'columnCount'])
        await excelContext.sync();

        const addedColumns = Math.max(0, range.columnCount - prevOfficeTable.columns.count);
        const addedRows = Math.max(0, range.rowCount - prevOfficeTable.rows.count - OFFICE_TABLE_EXTA_ROW);

        return { addedRows, addedColumns };
    }
}

export const formattedDataHelper = new FormattedDataHelper();