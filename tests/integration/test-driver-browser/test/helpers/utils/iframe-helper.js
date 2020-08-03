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
  const endTime = Date.now() + 120 * 1000;
  let i = 1;
  while(Date.now() < endTime){
    try {
      browser.switchToFrame(null);
      $('#WebApplicationFrame1').waitForDisplayed(20000);
      browser.switchToFrame($('#WebApplicationFrame'));
      return;
    } catch(e) {
      console.log(`Element '#WebApplicationFrame' not found. Retrying for the ${++i} time.`)
      continue;
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
