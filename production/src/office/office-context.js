class OfficeContext {
  getOffice = () => window.Office

  getExcel = () => window.Excel

  /**
   * Returns the highest requirement set supported by the current platform.
   *
   * @returns {String} Requirement set
   */
  getRequirementSet = () => {
    const { Office } = window;
    let isSupported = true;
    let api = 0;
    while (isSupported && !!Office) {
      isSupported = Office.context.requirements.isSetSupported('ExcelAPI', `1.${api}`);
      if (isSupported) { api += 1; }
    }
    return `1.${api - 1}`;
  }

  /**
   * Check if requirement set is supported.
   *
   * @param {Number} version ExcelAPI version
   * @returns {Boolean} Requirement set supported
   */
  isSetSupported = (version) => {
    const { Office } = window;
    if (Office) {
      return Office.context.requirements.isSetSupported('ExcelAPI', `${version}`);
    }
    return false;
  }
}

export const officeContext = new OfficeContext();
