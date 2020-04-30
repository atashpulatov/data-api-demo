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

// This frame is used for report prompt window and visualizations window
export function switchToPromptFrame() {
  switchToPluginFrame();
  $('iframe[src*="app.embedded=true"]').waitForExist(9999);
  browser.switchToFrame($('iframe[src*="app.embedded=true"]'));
}

export function switchToPromptFrameForImportDossier() {
  switchToPluginFrame();
  const editFrame = '#popup-wrapper > div > div:nth-child(2) > iframe';
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
 * Changes the browser tab to the passed index
 *
 * @param {Number} tabIndex
 */
export function changeBrowserTab(tabIndex) {
  const handles = browser.getWindowHandles();
  browser.switchToWindow(handles[tabIndex]);
}
