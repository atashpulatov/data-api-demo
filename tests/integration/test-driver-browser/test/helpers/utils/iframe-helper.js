export function switchToPluginFrame() {
  switchToExcelFrame();
  $('.AddinIframe').waitForExist(9999);
  browser.switchToFrame($('.AddinIframe'));
}

export function switchToDialogFrame() {
  switchToExcelFrame();
  $('#WACDialogPanel .AddinIframe').waitForExist(9999);
  browser.switchToFrame($('#WACDialogPanel .AddinIframe'));
}

export function switchToExcelFrame() {
  browser.switchToFrame(null);
  $('#WebApplicationFrame').waitForDisplayed(19999);
  browser.switchToFrame($('#WebApplicationFrame'));
}

export function switchToPromptFrame() {
  switchToPluginFrame();
  $('iframe[src*="app.embedded=true"]').waitForExist(9999);
  browser.switchToFrame($('iframe[src*="app.embedded=true"]'));
}

export function switchToPromptFrameForEditDossier() {
  switchToPluginFrame();
  const editFrame = '#root > div > div:nth-child(3) > iframe';
  $(editFrame).waitForExist(9999);
  browser.switchToFrame($(editFrame));
}

export function switchToPromptFrameForEditReport() {
  switchToPluginFrame();
  const editFrame = '#root > div > div.promptsContainer > iframe';
  $(editFrame).waitForExist(9999);
  browser.switchToFrame($(editFrame));
}

export function switchToRightPanelFrame() {
  switchToExcelFrame();
  $('iframe[src*="loader-mstr-office"]').waitForExist(9999);
  browser.switchToFrame($('iframe[src*="loader-mstr-office"]'));
}

export function switchToPopupFrame() {
  switchToExcelFrame();
  $('iframe[src*="api&et="]').waitForExist(9999);
  browser.switchToFrame($('iframe[src*="api&et="]'));
}

/**
 * switches to refreshAll popup frame
 */
export function switchToRefreshAllFrame() {
  switchToExcelFrame();
  $('iframe[src*="refresh-all-page"]').waitForExist(9999);
  browser.switchToFrame($('iframe[src*="refresh-all-page"]'));
}

/**
 * Changes the browser tab to the passed index
 *
 * @param {Number} tabIndex
 */
export function changeBrowserTab(tabIndex) {
  const handles = browser.getWindowHandles();
  browser.switchToWindow(handles[tabIndex]);
}
