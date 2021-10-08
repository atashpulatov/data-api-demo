class ScriptInjectionHelper {
  /**
   * Applies an external script file to a embedded document.
   *
   * @param {Document} contentDocument is a document of iframe
   * @param {String} fileLocationRelativePath is a path to file,
   * that will be injected to iframe.
   */
  applyFile = (contentDocument, fileLocationRelativePath) => {
    if (contentDocument) {
      const fileLocation = this.createFileLocation(fileLocationRelativePath);
      const script = contentDocument.createElement('script');
      script.src = encodeURI(fileLocation);
      const title = contentDocument.head.getElementsByTagName('title')[0];
      contentDocument.head.insertBefore(script, title);
    }
  }

  /**
   * Applies an external css file to a document.
   *
   * @param {Document} contentDocument is a document of iframe
   * @param {String} styleSheetRelativePath is a path to file,
   * that will be injected to iframe.
   */
  applyStyle = (contentDocument, styleSheetRelativePath) => {
    if (contentDocument) {
      const styleSheetLocation = this.createFileLocation(styleSheetRelativePath);
      const cssLink = document.createElement('link');
      cssLink.href = encodeURI(styleSheetLocation);
      cssLink.rel = 'stylesheet';
      cssLink.type = 'text/css';
      contentDocument.head.appendChild(cssLink);
    }
  }

  /**
   * Creates location of the file.
   *
   * @param {String} relativePath is a path to file,
   * that will be injected to iframe.
   */
  createFileLocation = relativePath => window.location.origin
    + window.location.pathname.replace('index.html', relativePath);

  /**
   * Checks if document is login page of embedded library.
   *
   * @param {Document} document content document of embedded dossier iframe.
   * @returns {Boolean} True if document is login page, false otherwise.
   */
  isLoginPage = (document) => document && document.URL.includes('embeddedLogin.jsp');

  /**
   * Watches container for child addition and runs callback in case an iframe was added
   * @param {*} container
   * @param {*} callback
   */
  watchForIframeAddition = (container, callback) => {
    const config = { childList: true };
    const onMutation = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.addedNodes && mutation.addedNodes.length && mutation.addedNodes[0].nodeName === 'IFRAME') {
          const iframe = mutation.addedNodes[0];
          iframe.tabIndex = 0;
          iframe.focusEventListenerAdded = false;
          callback(iframe);
        }
      }
    };
    const observer = new MutationObserver(onMutation);
    observer.observe(container, config);
  }

  /**
  * When focused on window switch focus to different element in this window.
  * For prompted dossiers this element will be first Table Data tag.
  * For non-prompted dossiers it will be the Table of Content button.
  * Focusing on the window itself is not visible for the user therefore should be skipped.
  *
  * @param {FocusEvent} focusEvent
  */
  switchFocusToElementOnWindowFocus = (focusEvent) => {
    const iframeDocument = focusEvent.target.contentDocument;
    const overlay = iframeDocument.getElementsByClassName('mstrd-PromptEditorContainer-overlay').length;
    let elementToFocusOn;
    if (overlay) {
      [elementToFocusOn] = iframeDocument.getElementsByTagName('TD');
    } else {
      [elementToFocusOn] = iframeDocument.getElementsByClassName('icon-tb_toc_n');
    }
    if (elementToFocusOn) {
      elementToFocusOn.focus();
    }
  }
}

const scriptInjectionHelper = new ScriptInjectionHelper();
export default scriptInjectionHelper;
