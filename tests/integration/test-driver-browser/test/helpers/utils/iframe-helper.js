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
  for (let i = 0; i < 15; i++) {
    browser.pause(2000);
    browser.switchToFrame(null);
    if($('#WebApplicationFrame').isDisplayed()) {
      browser.switchToFrame($('#WebApplicationFrame')); 
      return;
    } 
    console.log(`Element '#WebApplicationFrame' not found. Retrying`);
  }
  throw new Error(`Element '#WebApplicationFrame' could not be found.`)
}

// This frame is used for report prompt window and visualizations window
export function switchToPromptFrame() {
  switchToPluginFrame();
  $('iframe[mstr-embed-iframe="true"]').waitForExist(40000);
  browser.switchToFrame($('iframe[mstr-embed-iframe="true"]'));
}

export function switchToPromptFrameForImportDossier() {
  switchToPluginFrame();
  const editFrame = '#popup-wrapper > div > div:nth-child(3) > iframe';
  $(editFrame).waitForExist(19999);
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
