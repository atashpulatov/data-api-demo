import { shapeProps, sheetCollectionProps } from './shape-properties';

const ITEM_NOT_FOUND = 'ItemNotFound';

class OfficeShapeApiHelper {
  /**
   * Gets the excel shape referenced by shapeId from the workbook.
   * If the shape is found returns the shape object otherwise returns undefined.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param shapeId Id of the Office shape created on import used for referencing the Excel shape
   *
   * @return Reference to Excel Shape
   */
  getShape = async (
    excelContext: Excel.RequestContext,
    shapeId: string
  ): Promise<Excel.Shape | undefined> => {
    const worksheetCollection = excelContext.workbook.worksheets;
    worksheetCollection.load(sheetCollectionProps.ITEMS);
    await excelContext.sync();
    for (const sheet of worksheetCollection.items) {
      const shape = sheet.shapes.getItemOrNullObject(shapeId);
      // load shape properties
      const { IS_NULL_OBJECT, TOP, LEFT, WIDTH, HEIGHT } = shapeProps;
      shape.load([IS_NULL_OBJECT, TOP, LEFT, WIDTH, HEIGHT]);
      await excelContext.sync();

      if (!shape.isNullObject) {
        // @ts-expect-error
        shape.worksheetId = sheet.id;
        return shape;
      }
    }
  };

  /**
   * Adds an image shape to the worksheet and positions it based on the top and left values
   * Returns the shape id of the newly created shape.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param base64PngImage Base64 encoded png image
   * @param name Name of the shape
   * @param top Top position of the shape
   * @param left Left position of the shape
   * @param sheet Worksheet to which the shape is added
   *
   * @return Office Id of the shape which is added to the worksheet
   */
  addImage = async (
    excelContext: Excel.RequestContext,
    base64PngImage: string,
    name: string,
    position: { top: number; left: number },
    dimension: { width: number; height: number },
    sheet: Excel.Worksheet
  ): Promise<string> => {
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
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param shapeId shapeId Id of the Office shape created on import used for referencing the Excel shape
   */
  deleteImage = async (excelContext: Excel.RequestContext, shapeId: string): Promise<void> => {
    const shape = await this.getShape(excelContext, shapeId);
    if (shape) {
      shape.delete();
      await excelContext.sync();
    }
  };

  /**
   * Deletes the shape group linked to office table from the worksheet.
   *
   * @param officeTable Reference to Excel Table
   * @param shapeGroupId Shape group Id
   * @param excelContext Reference to Excel Context used by Excel API functions
   */
  deleteShapeGroupLinkedToOfficeTable = async (officeTable: Excel.Table, shapeGroupId: string, excelContext: Excel.RequestContext): Promise<void> => {
    try {
      const shapeGroup = officeTable.worksheet.shapes.getItem(shapeGroupId);
      shapeGroup?.delete();

      await excelContext.sync();
    } catch (error) {
      /*
      If the error is InvalidSelection it means that the requested resource(shape) doesn't exist.
      https://learn.microsoft.com/en-us/office/dev/add-ins/testing/application-specific-api-error-handling
      Shape group could be deleted manually from worksheet. Currently there is no Excel api/events to track user's actions
      on removal of images. Hence we will swallow the error and proceed further. 
      */
      if (error.code !== ITEM_NOT_FOUND) {
        throw error;
      }
    }
  };
}

export const officeShapeApiHelper = new OfficeShapeApiHelper();
