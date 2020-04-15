/**
 * This function creates location of the file
 *
 * @param {String} relativePath
 */
export const createFileLocation = relativePath => window.location.origin
  + window.location.pathname.replace('index.html', relativePath);

/**
 * This function applies an external script file to a embedded document
 *
 * @param {Document} contentDocument
 * @param {String} fileLocationRelativePath
 */
export const applyFile = (contentDocument, fileLocationRelativePath) => {
  const fileLocation = createFileLocation(fileLocationRelativePath);
  if (contentDocument) {
    const script = contentDocument.createElement('script');
    script.src = fileLocation;
    const title = contentDocument.head.getElementsByTagName('title')[0];
    contentDocument.head.insertBefore(script, title);
  }
};

/**
 * This function applies an external css file to a document
 *
 * @param {Document} contentDocument
 * @param {String} styleSheetRelativePath
 */
export const applyStyle = (contentDocument, styleSheetRelativePath) => {
  const styleSheetLocation = createFileLocation(styleSheetRelativePath);
  const cssLink = document.createElement('link');
  cssLink.href = styleSheetLocation;
  cssLink.rel = 'stylesheet';
  cssLink.type = 'text/css';
  if (contentDocument) {
    contentDocument.head.appendChild(cssLink);
  }
};
