/**
 * Class providing abstraction for loading data from Excel.
 */
class OfficeApiDataLoader {
  /**
   * Loads single value from Excel.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions used to load value
   * @param object Object to load value from
   * @param key Name of the variable to load
   *
   * @returns Promise with loaded value.
   *
   * @throws Error when excelContext, any item, any item.object or item.key is empty.
   */
  async loadSingleExcelData(
    excelContext: Excel.RequestContext,
    object: any,
    key: string
  ): Promise<any> {
    const valueMap = await this.loadExcelData(excelContext, [{ object, key }]);

    return valueMap[key];
  }

  /**
   * Loads multiple values from Excel, synchronizing only once.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions used to load value
   * @param {Array} items Array of items containing object (to load value from)
   * and key (name of the variable to load), e.g.
   *
   * [{object: officeTableOne, key: 'nameOne'},  {object: officeTableTwo, key: 'nameTwo'}]
   *
   * @returns {Promise} Promise with a map of loaded values. The map is empty for empty items.
   *
   * @throws Error when excelContext, any item, any item.object or item.key is empty.
   */
  loadExcelData = async (excelContext: Excel.RequestContext, items: any[]): Promise<any> => {
    this.validateExcelContext(excelContext);

    if (!items || !items.length) {
      return {};
    }

    for (const item of items) {
      this.validateItem(item);

      item.object.load(item.key);
    }

    await excelContext.sync();

    const result: { [key: string]: any } = {};
    for (const param of items) {
      result[param.key] = param.object[param.key];
    }

    return result;
  };

  /**
   * Validates excelContext.
   *
   * @param {Office} excelContext Reference to Excel Context used by Excel API functions to validate.
   *
   * @throws Error when excelContext is empty.
   */
  validateExcelContext(excelContext: Excel.RequestContext): void {
    if (!excelContext) {
      throw new Error(`Cannot load data from Excel, excel context is [${excelContext}]`);
    }
  }

  /**
   * Validates item, which should be not empty and contain non empty object and key.
   *
   * @param {Object} item Item to validate.
   *
   * @throws Error when item, item.object or item.key is empty.
   */
  validateItem(item: any): void {
    if (!item) {
      throw new Error(`Cannot load data from Excel, item is [${item}]`);
    }

    if (!item.object) {
      throw new Error(`Cannot load data from Excel, item.object is [${item.object}]`);
    }

    if (!item.key) {
      throw new Error(`Cannot load data from Excel, item.key is [${item.key}]`);
    }
  }
}

const officeApiDataLoader = new OfficeApiDataLoader();
export default officeApiDataLoader;
