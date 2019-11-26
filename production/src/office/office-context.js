const { Office, Excel } = window;

class OfficeContext {
  getOffice = () => Office

  getExcel = () => Excel

  /**
   * Returns the highest requirement set supported by the current platform.
   *
   * @memberof OfficeContext
   * @returns {String} Requirement set
   */
  getRequirementSet = () => {
    let isSupported = true;
    let api = 0;
    while (isSupported && Office) {
      isSupported = Office.context.requirements.isSetSupported('ExcelAPI', `1.${api}`);
      if (isSupported) api += 1;
    }
    return `1.${api - 1}`;
  }
}

export const officeContext = new OfficeContext();
