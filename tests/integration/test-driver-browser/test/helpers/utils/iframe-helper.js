export function switchToPluginFrame() {
  switchToExcelFrame();
  $('.AddinIframe').waitForExist(9999);
  browser.switchToFrame($('.AddinIframe'));
}

export function switchToExcelFrame() {
  browser.switchToFrame(null);
  $('#WebApplicationFrame').waitForExist(9999);
  browser.switchToFrame($('#WebApplicationFrame'));
}

export function switchToPromptFrame() {
  switchToPluginFrame();
  $('iframe[src*="app.embedded=true"]').waitForExist(9999);
  browser.switchToFrame($('iframe[src*="app.embedded=true"]'));
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

export function switchToRefreshAllFrame() {
  switchToExcelFrame();
  $('iframe[src*="refresh-all-page"]').waitForExist(9999);
  browser.switchToFrame($('iframe[src*="refresh-all-page"]'));
}
