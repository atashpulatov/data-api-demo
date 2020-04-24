/* eslint-disable class-methods-use-this */
import { switchToPluginFrame, switchToExcelFrame, changeBrowserTab } from '../utils/iframe-helper';
import { waitAndClick } from '../utils/click-helper';
import { rightPanelSelectors } from '../../constants/selectors/plugin.right-panel-selectors';
import { excelSelectors } from '../../constants/selectors/office-selectors';

class PluginRightPanel {
  clickLoginPopUpBtn() {
    waitAndClick($(rightPanelSelectors.loginPopUpBtn));
  }

  clickLogout() {
    waitAndClick($(rightPanelSelectors.logoutBtn));
  }

  clickSettings() {
    waitAndClick($(rightPanelSelectors.settingsBtn));
  }

  logout() {
    this.clickSettings();
    this.clickLogout();
  }

  clickImportDataButton() {
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.importDataBtn), 20000);
    browser.pause(999);
  }

  // Currently it is not used
  loginToPluginLDAP(username, password) {
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.LDAPbutton));
    $(rightPanelSelectors.usernameInput).setValue(username);
    $(rightPanelSelectors.passwordInput).setValue(password);
    this.clickloginToPlugin();
    browser.pause(4444);
  }

  clickAddDataButton() {
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.addDataBtn));
    browser.pause(999);
  }

  refreshFirstObjectFromTheList() {
    switchToPluginFrame();
    // browser.pause(4444); // to do: see if we can change to some wait method
    waitAndClick($(rightPanelSelectors.refreshBtn));
  }


  /**
   * Clicks to refresh button for imported object. Will work when there are more than one report imported.
   *
   * @param {Number} index indicates the report represented in the plugin. Starts with 1 which indicates the last imported object.
   *
   * @memberof PluginRightPanel
   */
  refreshObject(index) {
    switchToPluginFrame();
    const refreshBtn = rightPanelSelectors.getRefreshBtnForObject(index);
    waitAndClick($(refreshBtn));
  }

  /**
   * Clicks to edit button for imported object. Will work when there are more than one object imported.
   *
   * @param {Number} index indicates the report represented in the plugin. Starts with 1 which indicates the last imported object.
   *
   * @memberof PluginRightPanel
   */
  editObject(index) {
    switchToPluginFrame();
    const editBtn = rightPanelSelectors.getEdithBtnForObject(index);
    waitAndClick($(editBtn));
  }

  /**
   * Clicks to remove button for imported object. Will work when there are more than one object imported.
   *
   * @param {Number} index indicates the report represented in the plugin. Starts with 1 which indicates the last imported object.
   *
   * @memberof PluginRightPanel
   */
  removeObject(index) {
    switchToPluginFrame();
    const removeBtn = rightPanelSelectors.getRemoveBtnForObject(index);
    waitAndClick($(removeBtn));
  }

  /* refreshAll() {
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.refreshAllBtn));
  } */

  refreshAll() {
    switchToPluginFrame();
    const checkBoxAll = $('#overlay > div.side-panel > div.object-tile-container > div.object-tile-container-header > span > div');
    const refreshAllIcon = $('#overlay > div.side-panel > div.object-tile-container > div.object-tile-container-header > span > span > button:nth-child(5)');
    waitAndClick(checkBoxAll);
    waitAndClick(refreshAllIcon);
  }

  edit() {
    switchToPluginFrame();
    waitAndClick($('.edit'));
  }

  removeFirstObjectFromTheList() {
    switchToPluginFrame();
    browser.pause(3333);
    waitAndClick($(rightPanelSelectors.deleteBtn));
  }

  repromptFirstObjectFromTheList() {
    switchToPluginFrame();
    browser.pause(3333);
    waitAndClick($(rightPanelSelectors.repromptBtn));
  }

  // Currently it is not used
  removeAllObjectsFromTheList() {
    switchToPluginFrame();
    const e = $$('.trash').count();
    for (let i = 0; i < e; i++) {
      this.removeFirstObjectFromTheList();
    }
  }

  closeNotification() {
    switchToPluginFrame();
    // waitAndClick($('span.ant-notification-notice-btn > button'));
    waitAndClick($('.warning-notification-button-container'));
  }

  clickLoginRightPanelBtn() {
    waitAndClick($(rightPanelSelectors.loginRightPanelBtn));
  }

  closeNotificationOnHover() {
    const selector = '.notification-container';
    const selectorOther = '.object-tile-container-header';
    $(selectorOther).moveTo();
    browser.pause(1000);
    $(selector).moveTo();
    browser.pause(1000);
  }

  closeAllNotificationsOnHover() {
    switchToPluginFrame();
    const objectCount = $$('.object-tile-content').length;
    for (let index = 1; index <= objectCount; index++) {
      this.closeNotificationOnHover();
    }
  }


  loginToPlugin(username, password, isValidCredentials) {
    switchToPluginFrame();
    $(rightPanelSelectors.loginRightPanelBtn).waitForDisplayed(17777);
    if ($(rightPanelSelectors.loginRightPanelBtn).isExisting()) {
      this.clickLoginRightPanelBtn();
      changeBrowserTab(2);
      this.enterCredentialsAndPressLoginBtn(username, password);
      if (isValidCredentials) {
        changeBrowserTab(1);
      }
    }
  }

  enterCredentialsAndPressLoginBtn(username, password) {
    $(rightPanelSelectors.usernameInput).setValue(username);
    $(rightPanelSelectors.passwordInput).setValue(password);
    this.clickLoginPopUpBtn();
    browser.pause(2222);
  }

  clearData() {
    const clearBtn = $(`.no-trigger-close*=Clear Data`); // TODO: This method will not work with localisation (Don't use 'Clear Data')
    waitAndClick(clearBtn);
    waitAndClick($(rightPanelSelectors.clearOkBtn));
  }

  viewDataBtn() {
    waitAndClick($(rightPanelSelectors.viewDataBtn));
  }

  getVersionOfThePlugin() {
    switchToPluginFrame();
    this.clickSettings();
    const version = $('.settings-version').getText();
    return version.substring('Version '.length);
  }

  doubleClick(element) {
    element.click();
    element.click();
  }

  // clicks on object in the right panel and asserts whether the object was selected in the worksheet
  clickOnObject(object, cellValue) {
    waitAndClick(object);
    switchToExcelFrame();
    expect($(excelSelectors.cellInput).getValue()).toEqual(cellValue);
    browser.pause(3000); // TODO: Not sure if this is necessary
    switchToPluginFrame(); // TODO: Not sure if this is necessary
  }

  // hovers over objects in the right panel and assert whether the box shadow color is changed
  hoverOverObjects(objects) {
    for (let i = 0; i < objects.length; i++) {
      objects[i].moveTo();
      browser.pause(1000);
      expect(objects[i].getCSSProperty('box-shadow').value).toEqual('rgba(0,0,0,0.5)0px0px4px0px');
    }
  }

  // hovers over object names in the right panel and assert whether the backgroiund color changed
  hoverOverObjectNames(objectNames) {
    for (let i = 0; i < objectNames.length; i++) {
      objectNames[i].moveTo();
      browser.pause(1000);
      expect(objectNames[i].getCSSProperty('background-color').value).toEqual('rgba(235,235,235,1)');
    }
  }

  SelectNthPlaceholder(number) {
    switchToPluginFrame();
    return $(`${rightPanelSelectors.placeholderContainer} > div:nth-child(${number})`);
  }
}

export default new PluginRightPanel();
