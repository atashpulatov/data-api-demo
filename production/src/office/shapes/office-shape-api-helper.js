import { shapeProps, sheetCollectionProps } from './shape-properties';

class OfficeShapeApiHelper {
  /**
   * Gets the excel shape referenced by shapeId from the workbook.
   * If the shape is found returns the shape object otherwise returns undefined.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {String} shapeId Id of the Office shape created on import used for referencing the Excel shape
   *
   * @return {Office} Reference to Excel Shape
   */
  getShape = async (excelContext, shapeId) => {
    const worksheetCollection = excelContext.workbook.worksheets;
    await worksheetCollection.load(sheetCollectionProps.ITEMS);
    await excelContext.sync();
    for (const sheet of worksheetCollection.items) {
      const shape = sheet.shapes.getItemOrNullObject(shapeId);
      // load shape properties
      const { IS_NULL_OBJECT, TOP, LEFT, WIDTH, HEIGHT } = shapeProps;
      await shape.load([IS_NULL_OBJECT, TOP, LEFT, WIDTH, HEIGHT]);
      await excelContext.sync();

      if (!shape.isNullObject) {
        shape.worksheetId = sheet.id;
        return shape;
      }
    }
  };

  /**
   * Adds an image shape to the worksheet and positions it based on the top and left values
   * Returns the shape id of the newly created shape.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {String} base64PngImage Base64 encoded png image
   * @param {String} name Name of the shape
   * @param {Number} top Top position of the shape
   * @param {Number} left Left position of the shape
   * @param {Worksheet} sheet Worksheet to which the shape is added
   *
   * @return {object} Office Id of the shape which is added to the worksheet
   */
  addImage = async (excelContext, base64PngImage, name, position, dimension, sheet) => {
    const shape = sheet.shapes.addImage(base64PngImage);
    const { top, left } = position;
    const { width, height } = dimension;
    shape.set({
      name,
      top,
      left,
      width,
      height,
    });
    await excelContext.sync();
    return shape.id;
  };

  /**
   * Deletes the shape from the worksheet.
   *
   * @param {*} excelContext Reference to Excel Context used by Excel API functions
   * @param {*} shapeId shapeId Id of the Office shape created on import used for referencing the Excel shape
   */
  deleteImage = async (excelContext, shapeId) => {
    const shape = await this.getShape(excelContext, shapeId);
    if (shape) {
      shape.delete();
      await excelContext.sync();
    }
  };
}

export const officeShapeApiHelper = new OfficeShapeApiHelper();
