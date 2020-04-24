import { switchToPluginFrame, switchToExcelFrame } from './iframe-helper';
import { rightPanelSelectors as se } from '../../constants/selectors/plugin.right-panel-selectors';

/* export function waitForNotification() {
  let popupExists = true;
  while (popupExists) {
    switchToExcelFrame();
    const popupDiv = $('#WACDialogPanel').isExisting();
    if (!popupDiv) {
      switchToPluginFrame();
      const overlayDiv = $('#overlay').isExisting();
      if (overlayDiv) {
        popupExists = false;
      }
    }
    browser.pause(777);
  }
  $(se.notificationPopUp).waitForExist(6666, false, `${se.notificationPopUp} was not found`);
} */

export function waitForNotification() {
  let progress = true;
  const notification = $('.notification-container > div.notification-text > span.right-text');
  while (progress) {
    switchToPluginFrame();
    const isExist = notification.isExisting();
    if (isExist) {
      if (notification.getText() === '') {
        browser.pause(777);
        progress = false;
      }
    } else {
      browser.pause(777);
    }
  }
  // notification.waitForExist(6666, false, `${notification} was not found`);
}

export function waitForPopup(timeout = 29999) {
  switchToExcelFrame();
  $('#WACDialogPanel').waitForExist(timeout, false, `#WACDialogPanel was not found`);

  browser.pause(2500);
  switchToPluginFrame();
}

// In webdriverIO use $(selector).waitForDisplayed(ms, reverse, error) instead of this function
export async function waitById(id, timeout = 9999) {
  await browser.wait(async () => {
    const elm = await element(by.id(id)).isPresent();
    return elm;
  }, timeout);
}

// use $(selector).waitForDisplayed(ms, reverse, error) instead of this function
export async function waitByClass(className, timeout = 9999) {
  await browser.wait(async () => {
    const elm = await element(by.className(className)).isPresent();
    return elm;
  }, timeout);
}
