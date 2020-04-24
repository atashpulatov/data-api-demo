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
  console.log('FOR A SINGLE ELEMENT');
  const notification = $('.notification-container');
  const progressBar = $('.notification-container > div.notification-body > div.progress');

  getNotification(notification, progressBar);
}


export function waitForAllNotifications() {
  switchToPluginFrame();
  console.log('IN WAIT FOR ALL !!!!!!!');
  const objectCount = $$('.object-tile-content').length;
  for (let index = 1; index <= objectCount; index++) {
    const notification = $(`#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div.notification-container`);
    const progressBar = $(`#overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(${index}) > div.notification-container > div.notification-body > div.progress`);
    // #overlay > div > div.object-tile-container > div.object-tile-list > article:nth-child(1) > div.notification-container > div.notification-body > div.progress > div
    getNotification(notification, progressBar);
  }
}

function getNotification(notification, progressBar) {
  let progress = true;
  while (progress) {
    switchToPluginFrame();
    const isNotificationExist = notification.isExisting();
    const isProgressBarExist = progressBar.isExisting();
    if (isNotificationExist && !isProgressBarExist) {
      console.log('INSIDE IF BAR DOESNT EXIST');
      browser.pause(777);
      progress = false;
    } else {
      console.log('BAR STILL EXIST, WAITING');
      browser.pause(777);
    }
  }
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
