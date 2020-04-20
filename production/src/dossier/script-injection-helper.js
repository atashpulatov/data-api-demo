
class ScriptInjectionHelper {
  /**
   * Applies an external script file to a embedded document
   *
   * @param {Document} contentDocument is a document of iframe
   * @param {String} fileLocationRelativePath is a path to file,
   * that will be injected to iframe.
   */
  applyFile = (contentDocument, fileLocationRelativePath) => {
    const fileLocation = this.createFileLocation(fileLocationRelativePath);
    if (contentDocument) {
      const script = contentDocument.createElement('script');
      script.src = fileLocation;
      const title = contentDocument.head.getElementsByTagName('title')[0];
      contentDocument.head.insertBefore(script, title);
    }
  }

  /**
   * Applies an external css file to a document
   *
   * @param {Document} contentDocument is a document of iframe
   * @param {String} styleSheetRelativePath is a path to file,
   * that will be injected to iframe.
   */
  applyStyle = (contentDocument, styleSheetRelativePath) => {
    const styleSheetLocation = this.createFileLocation(styleSheetRelativePath);
    const cssLink = document.createElement('link');
    cssLink.href = styleSheetLocation;
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    if (contentDocument) {
      contentDocument.head.appendChild(cssLink);
    }
  }

  /**
   * Creates location of the file
   *
   * @param {String} relativePath is a path to file,
   * that will be injected to iframe.
   */
  createFileLocation = relativePath => window.location.origin
    + window.location.pathname.replace('index.html', relativePath);
}

const scriptInjectionHelper = new ScriptInjectionHelper();
export default scriptInjectionHelper;
