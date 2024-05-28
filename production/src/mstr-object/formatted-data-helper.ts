/**
 * Retrieves the shape collection of given woksheet.
 *
 * @param worksheet Excel worksheet
 * @param excelContext Reference to Excel Context used by Excel API functions
 */
export const getShapeCollection = async (worksheet: Excel.Worksheet, excelContext: Excel.RequestContext): Promise<Excel.ShapeCollection> => {
    worksheet.load('shapes');
    await excelContext.sync();

    const shapeCollection = worksheet.shapes;

    shapeCollection.load('items');
    await excelContext.sync();

    return shapeCollection;
}