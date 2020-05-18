import { switchToPluginFrame, switchToExcelFrame } from './iframe-helper';
import { rightPanelSelectors } from '../../constants/selectors/plugin.right-panel-selectors';
import { logStep } from './allure-helper';

export function waitForNotification() {
  console.log('Should wait for notification');
  const notification = $(rightPanelSelectors.notificationContainer);
  const progressBar = $(rightPanelSelectors.progressBar);
  getNotification(notification, progressBar);
}


export function waitForAllNotifications() {
  logStep(`Waiting for all notifications to finish...    [wait-helper.js - waitForAllNotifications()]`);
  switchToPluginFrame();
  const objectCount = $$(rightPanelSelectors.objectContainer).length;
  for (let index = 1; index <= objectCount; index++) {
    const notification = $(rightPanelSelectors.getNotificationAt(index));
    const progressBar = $(rightPanelSelectors.getProgressBarAt(index));
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
      browser.pause(777);
      progress = false;
    } else {
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
