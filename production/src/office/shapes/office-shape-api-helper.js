class OfficeShapeApiHelper {

  /**
   * Gets Excel shape added to the workbook.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {String} shapeId Id of the Office shape created on import used for referencing the Excel shape
   * @return {Office} Reference to Excel Shape
   */
  getShape = async (excelContext, shapeId) => {
    const worksheetCollection = excelContext.workbook.worksheets;
    await worksheetCollection.load('items');
    await excelContext.sync();
    let shape;
    for (const sheet of worksheetCollection.items) {
      shape = sheet.shapes.getItemOrNullObject(shapeId);
      await shape.load(['isNullObject', 'top', 'left', 'width', 'height']);
      await excelContext.sync();
      if (!shape.isNullObject) {
        break;
      }
    }
    return shape;
  };

  /**
   * Adds an image shape to the worksheet and positions it based on the top and left values
   * Returns the shape id of the newly created shape
   * 
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions
   * @param {String} base64PngImage Base64 encoded png image
   * @param {Number} top Top position of the shape
   * @param {Number} left Left position of the shape
   * 
   * @return {String} Id of the Office shape created on import used for referencing the Excel shape
   */
  addImage = async (excelContext, base64PngImage, top, left) => {
    const worksheet = excelContext.workbook.worksheets.getActiveWorksheet();
    const shape = worksheet.shapes.addImage(base64PngImage);
    shape.set({ top, left });
    await excelContext.sync();
    return shape.id;
  };

  /**
   * Deletes the shape from the worksheet
   * 
   * @param {*} excelContext Reference to Excel Context used by Excel API functions
   * @param {*} shapeId shapeId Id of the Office shape created on import used for referencing the Excel shape
   */
  deleteImage = async (excelContext, shapeId) => {
    const shape = await this.getShape(excelContext, shapeId);
    shape.delete();
    await excelContext.sync();
  };

}

export const officeShapeApiHelper = new OfficeShapeApiHelper();
