import { officeContext } from '../office-context';

const FORM_TYPE_HTML = 'HTMLTag';
const FORM_TYPE_URL = 'url';

class OfficeFormatHyperlinks {
  /**
   * Checks if a string is a valid url including ip addresses.
   *
   * @param {String} str a url string
   * @returns {Boolean} is valid url
   */
  isValidUrl(str: string): boolean {
    const urlRegExp =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return urlRegExp.test(str);
  }

  /**
   * Create Excel hyperlink object from HTMLTag or url attributes
   *
   * HTMLTag: <a data="textToDisplay" href="address">textToDisplay</a>
   * url: http://example.com
   *
   * @param string HTMLTag attribute form
   * @param baseFormType MSTR Base form HTMLTag or URL
   * @returns Object { address, textToDisplay } or null if not a valid HTMLTag
   */
  parseHTMLTag(
    string: string,
    baseFormType: string
  ): { address: string; textToDisplay: string } | null {
    // Some users don't use properly baseFormType, check if valid URL for both url and HTMLTag
    // if(baseFormType === FORM_TYPE_URL)
    if (this.isValidUrl(string)) {
      return { address: string, textToDisplay: string };
    }

    // HTMLTag
    if (baseFormType === FORM_TYPE_HTML) {
      // stores value of href in capture group 1
      const hrefRegExp = /<a\s[^]*?\s?href=['"]([^]*?)['"][^]*>/;

      // stores text content in capture group 1
      const textRegExp = /<a[^]+['"]>([^]+)<\/a>/;

      const hrefMatch = string.match(hrefRegExp);
      let textMatch = string.match(textRegExp);

      // If there is no href or is not valid url we cannot make a hyperlink
      if (!hrefMatch || hrefMatch[0] === '' || !this.isValidUrl(hrefMatch[1])) {
        return null;
      }

      // If there is no text use hyperlink
      if (!textMatch || textMatch[0] === '' || textMatch[1] === '') {
        textMatch = hrefMatch;
      }

      return { address: hrefMatch[1], textToDisplay: textMatch[1] };
    }

    return null;
  }

  /**
   * Iterates through a range of cells with hyperlinks and
   * replaces the content with a valid ExcelAPI hyperlink object
   *
   * @param baseFormType MSTR Base form HTMLTag or URL
   * @param range Reference to Excel range
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @returns contextSync
   */
  async convertToHyperlink(
    baseFormType: string,
    range: Excel.Range,
    excelContext: Excel.RequestContext
  ): Promise<void> {
    try {
      range.load('values');
      await excelContext.sync();
    } catch (error) {
      console.warn('Excel API cannot load hyperlink values, skipping column');
      throw error;
    }

    excelContext.workbook.application.suspendApiCalculationUntilNextSync();
    for (let i = 0; i < range.values.length; i++) {
      const cellRange = range.getCell(i, 0);
      const cellText = range.values[i][0];
      const hyperlink = this.parseHTMLTag(cellText, baseFormType);
      if (hyperlink) {
        cellRange.hyperlink = hyperlink;
        cellRange.untrack();
      }
      // Sync after a batch of 5000 to avoid errors and performance issues
      if (i % 5000 === 0) {
        await excelContext.sync();
        excelContext.workbook.application.suspendApiCalculationUntilNextSync();
      }
    }

    return excelContext.sync();
  }

  /**
   * Formats a column consisting of HTMLTag or URL to Excel hyperlinks
   * Requires ExcelAPI 1.7
   *
   * @param object Column information and object definition
   * @param columnRange Reference to Excel range
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @returns contextSync
   */
  async formatColumnAsHyperlinks(
    object: any,
    columnRange: Excel.Range,
    excelContext: Excel.RequestContext
  ): Promise<void> {
    // https://docs.microsoft.com/en-us/javascript/api/excel/excel.rangehyperlink
    if (officeContext.isSetSupported(1.7)) {
      try {
        excelContext.trackedObjects.add(columnRange);
        const { attributeName, forms } = object;
        const hyperlinkIndex = forms.findIndex((element: any) =>
          [FORM_TYPE_HTML, FORM_TYPE_URL].includes(element.baseFormType)
        );
        if (hyperlinkIndex !== -1) {
          const { baseFormType } = forms[hyperlinkIndex];
          console.time(`Creating hyperlinks for ${attributeName}`);
          await this.convertToHyperlink(baseFormType, columnRange, excelContext);
          console.timeEnd(`Creating hyperlinks for ${attributeName}`);
        }
        excelContext.trackedObjects.remove(columnRange);
      } catch (error) {
        console.warn('Error while creating hyperlinks, skipping...');
      }
    }
  }
}

const officeFormatHyperlinks = new OfficeFormatHyperlinks();
export default officeFormatHyperlinks;
