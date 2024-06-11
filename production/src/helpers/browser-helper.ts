export class BrowserHelper {
  getWindowLocation(): Location {
    return window.location;
  }

  getDocumentCookie(): string {
    return document.cookie;
  }

  /**
   * Return Url of the current page
   *
   * @return Page Url
   */
  getUrl(): string {
    return window.location.href;
  }

  /**
   * Checks what type of build is currently used
   *
   * @return Determines if used build is development or test build
   */
  isDevelopment(): boolean {
    try {
      const isDevelopment = ['development', 'test'].includes(process.env.NODE_ENV);
      return isDevelopment;
    } catch (error) {
      return false;
    }
  }

  /**
   * Checks if we are running on macOS Safari based client
   * Checking only for webkit or safari is not enought:
   * https://security.stackexchange.com/questions/126407/why-does-chrome-send-four-browsers-in-the-user-agent-header
   *
   * @returns true if user agent is instance of mac desktop or safari
   */
  isMacAndSafariBased(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();

    const isMacintosh = userAgent.includes('macintosh');
    const isWebkit = userAgent.includes('applewebkit');
    const isChrome = userAgent.includes('chrome');

    return isMacintosh && isWebkit && !isChrome;
  }
}

export const browserHelper = new BrowserHelper();
