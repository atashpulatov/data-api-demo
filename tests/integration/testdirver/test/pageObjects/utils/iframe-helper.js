export function switchToPluginFrame() {
  // await browser.switchTo().defaultContent();
  // await browser.switchTo().frame($('#WebApplicationFrame').getWebElement());
  // await browser.switchTo().frame($('.AddinIframe').getWebElement());
  
  switchToExcelFrame();
  $('.AddinIframe').waitForExist(9999);
  browser.switchToFrame($('.AddinIframe'));
}

export function switchToExcelFrame() {
  // await browser.switchTo().defaultContent();
  // await browser.switchTo().frame($('#WebApplicationFrame').getWebElement());
  
  browser.switchToFrame(null);
  $('#WebApplicationFrame').waitForExist(9999);
  browser.switchToFrame($('#WebApplicationFrame'));
}

export async function switchToPromptFrame() { // currently switch is only possible from within the plugin frame
  // await browser.switchTo().defaultContent();
  // await browser.switchTo().frame($('#WebApplicationFrame').getWebElement());
  // await browser.switchTo().frame($('.AddinIframe').getWebElement());
  // await browser.switchTo().frame($('iframe[src*="app.embedded=true"]').getWebElement());

  switchToPluginFrame();
  $('iframe[src*="app.embedded=true"]').waitForExist(9999);
  browser.switchToFrame($('iframe[src*="app.embedded=true"]'));
}

export async function switchToRightPanelFrame() {
  await browser.switchTo().defaultContent();
  await browser.switchTo().frame($('#WebApplicationFrame').getWebElement());
  await browser.switchTo().frame($('iframe[src*="loader-mstr-office"]').getWebElement());
}

export async function switchToPopupFrame() {
  await browser.switchTo().defaultContent();
  await browser.switchTo().frame($('#WebApplicationFrame').getWebElement());
  await browser.switchTo().frame($('iframe[src*="api&et="]').getWebElement());
}
