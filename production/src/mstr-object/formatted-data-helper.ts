export const getShapCollection = async (worksheet: Excel.Worksheet, excelContext: Excel.RequestContext): Promise<Excel.ShapeCollection> => {
    worksheet.load('shapes');
    await excelContext.sync();

    const shapeCollection = worksheet.shapes;

    shapeCollection.load('items');
    await excelContext.sync();

    return shapeCollection;
}