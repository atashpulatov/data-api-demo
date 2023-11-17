import scriptInjectionHelper from './script-injection-helper';

/**
 * Handles embedding api login in excel desktop in windows
 * @param {Document} contentDocument
 * @param {*} Office
 */
export const handleLoginExcelDesktopInWindows = (contentDocument: Document, Office: any) => {
  if (!scriptInjectionHelper.isLoginPage(contentDocument)) {
    // DE158588 - Not able to open library in embedding api on excel desktop in windows
    const isOfficeOnline = Office.context && Office.context.platform === Office.PlatformType.OfficeOnline;
    const isIE = /Trident\/|MSIE /.test(window.navigator.userAgent);
    if (!isOfficeOnline && isIE) {
      scriptInjectionHelper.applyFile(
        contentDocument,
        'javascript/mshtmllib.js'
      );
    }
    scriptInjectionHelper.applyFile(
      contentDocument,
      'javascript/embeddingsessionlib.js'
    );
  }
};
