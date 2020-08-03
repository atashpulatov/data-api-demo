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
  const nowInSec = Math.floor(Date.now()/1000)
  const endTime = nowInSec + 120;
  while(Math.floor(Date.now()/1000) < endTime){
    try {
      browser.switchToFrame(null);
      $('#WebApplicationFrame').waitForDisplayed(20000);
      browser.switchToFrame($('#WebApplicationFrame'));
      return;
    } catch(e) {
    throw new Error(e)
    }
  } 
}

// This frame is used for report prompt window and visualizations window
export function switchToPromptFrame() {
  switchToPluginFrame();
  $('iframe[mstr-embed-iframe="true"]').waitForExist(40000);
  browser.switchToFrame($('iframe[mstr-embed-iframe="true"]'));
}

export function switchToPromptFrameForImportDossier() {
  switchToPluginFrame();
  const editFrame = 'iframe[src*="message=true&ui"]';
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
