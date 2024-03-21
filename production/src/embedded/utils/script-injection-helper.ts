class ScriptInjectionHelper {
  /**
   * Applies an external script file to a embedded document.
   *
   * @param contentDocument is a document of iframe
   * @param fileLocationRelativePath is a path to file,
   * that will be injected to iframe.
   */
  applyFile = (contentDocument: Document, fileLocationRelativePath: string): void => {
    if (contentDocument) {
      const fileLocation = this.createFileLocation(fileLocationRelativePath);
      const script = contentDocument.createElement('script');
      script.src = encodeURI(fileLocation);
      const title = contentDocument.head.getElementsByTagName('title')[0];
      contentDocument.head.insertBefore(script, title);
    }
  };

  /**
   * Applies an external css file to a document.
   *
   * @param contentDocument is a document of iframe
   * @param styleSheetRelativePath is a path to file,
   * that will be injected to iframe.
   */
  applyStyle = (contentDocument: Document, styleSheetRelativePath: string): void => {
    if (contentDocument) {
      const styleSheetLocation = this.createFileLocation(styleSheetRelativePath);
      const cssLink = document.createElement('link');
      cssLink.href = encodeURI(styleSheetLocation);
      cssLink.rel = 'stylesheet';
      cssLink.type = 'text/css';
      contentDocument.head.appendChild(cssLink);
    }
  };

  /**
   * Creates location of the file.
   *
   * @param relativePath is a path to file,
   * that will be injected to iframe.
   */
  createFileLocation(relativePath: string): string {
    return window.location.origin + window.location.pathname.replace('index.html', relativePath);
  }

  /**
   * Checks if document is login page of embedded library.
   *
   * @param document content document of embedded dossier iframe.
   * @return True if document is login page, false otherwise.
   */
  isLoginPage(document: Document): boolean {
    return document?.URL.includes('embeddedLogin.jsp');
  }

  /**
   * Watches container for child addition and runs callback in case an iframe was added
   * @param container
   * @param callback
   */
  watchForIframeAddition(
    container: HTMLElement,
    callback: (iframe: HTMLIFrameElement) => void
  ): void {
    const config = { childList: true };
    const onMutation = (mutationList: any): void => {
      for (const mutation of mutationList) {
        if (
          mutation.addedNodes &&
          mutation.addedNodes.length &&
          mutation.addedNodes[0].nodeName === 'IFRAME'
        ) {
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
   * @param  focusEvent
   */
  switchFocusToElementOnWindowFocus(focusEvent: FocusEvent): void {
    const iframeDocument = (focusEvent.target as HTMLIFrameElement).contentDocument;
    const overlay = iframeDocument.getElementsByClassName(
      'mstrd-PromptEditorContainer-overlay'
    ).length;
    let elementToFocusOn;
    if (overlay) {
      // @ts-expect-error
      [elementToFocusOn] = iframeDocument.getElementsByTagName('TD');
    } else {
      // @ts-expect-error
      [elementToFocusOn] = iframeDocument.getElementsByClassName('icon-tb_toc_n');
    }
    if (elementToFocusOn) {
      elementToFocusOn.focus();
    }
  }
}

const scriptInjectionHelper = new ScriptInjectionHelper();
export default scriptInjectionHelper;
