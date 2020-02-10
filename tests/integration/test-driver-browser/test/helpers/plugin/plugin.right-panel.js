import { switchToPluginFrame, switchToPopupFrame, switchToExcelFrame } from '../utils/iframe-helper';
import { waitAndClick } from '../utils/click-helper';
import { rightPanelSelectors } from '../../constants/selectors/plugin.right-panel-selectors';
import { excelSelectors as exSe } from '../../constants/selectors/office-selectors';

const PluginRightPanel = function() {
  this.clickLoginPopUpBtn = function() {
    waitAndClick($(rightPanelSelectors.loginPopUpBtn));
  };

  this.clickLogout = function() {
    waitAndClick($(rightPanelSelectors.logoutBtn));
  };

  this.clickSettings = function() {
    waitAndClick($(rightPanelSelectors.settingsBtn));
  };

  this.logout = function() {
    this.clickSettings();
    this.clickLogout();
  };

  this.clickImportDataButton = function() {
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.importDataBtn));
    browser.pause(999);
  };

  // Currently it is not used
  this.loginToPluginLDAP = function(username, password) {
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.LDAPbutton));
    $(rightPanelSelectors.usernameInput).setValue(username);
    $(rightPanelSelectors.passwordInput).setValue(password);
    this.clickloginToPlugin();
    browser.pause(4444);
  };

  this.clickAddDataButton = function() {
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.addDataBtn));
    browser.pause(999);
  };

  this.refreshFirstObjectFromTheList = function() {
    switchToPluginFrame();
    // browser.pause(4444); // to do: see if we can change to some wait method
    waitAndClick($(rightPanelSelectors.refreshBtn));
  };

  this.refreshAll = function() {
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.refreshAllBtn));
  };

  this.removeFirstObjectFromTheList = function() {
    switchToPluginFrame();
    browser.pause(3333);
    waitAndClick($(rightPanelSelectors.deleteBtn));
  };

  this.repromptFirstObjectFromTheList = function() {
    switchToPluginFrame();
    browser.pause(3333);
    waitAndClick($(rightPanelSelectors.repromptBtn));
  };

  // Currently it is not used
  this.removeAllObjectsFromTheList = function() {
    switchToPluginFrame();
    const e = $$('.trash').count();
    for (let i = 0; i < e; i++) {
      this.removeFirstObjectFromTheList();
    }
  };

  this.closeNotification = function() {
    switchToPluginFrame();
    waitAndClick($('span.ant-notification-notice-btn > button'));
  };

  this.clickLoginRightPanelBtn = function() {
    waitAndClick($(rightPanelSelectors.loginRightPanelBtn));
  };

  this.loginToPlugin = function(username, password) {
    switchToPluginFrame();
    $(rightPanelSelectors.loginRightPanelBtn).waitForDisplayed(7777);
    if ($(rightPanelSelectors.loginRightPanelBtn).isExisting()) {
      this.clickLoginRightPanelBtn();
      const handles = browser.getWindowHandles();
      browser.switchToWindow(handles[2]); // TODO: create help function to switch tabs
      $(rightPanelSelectors.usernameInput).setValue(username);
      $(rightPanelSelectors.passwordInput).setValue(password);
      this.clickLoginPopUpBtn();
      browser.pause(2222);
      browser.switchToWindow(handles[1]); // TODO: create help function to switch tabs
    }
  };

  this.clearData = function() {
    const clearBtn = $(`.no-trigger-close*=Clear Data`); // TODO: This method will not work with localisation (Don't use 'Clear Data')
    waitAndClick(clearBtn);
    waitAndClick($(rightPanelSelectors.clearOkBtn));
  };

  this.viewDataBtn = function() {
    waitAndClick($(rightPanelSelectors.viewDataBtn));
  };

  this.getVersionOfThePlugin = function() {
    switchToPluginFrame();
    this.clickSettings();
    const version = $('.settings-version').getText();
    return version.substring('Version '.length);
  };

  this.doubleClick = function(element) {
    element.click();
    element.click();
  }

  // clicks on object in the right panel and asserts whether the object was selected in the worksheet
  this.clickOnObject = function(object, cellValue) {
    waitAndClick(object);
    switchToExcelFrame();
    expect($(exSe.cellInput).getValue()).toEqual(cellValue);
    browser.pause(3000); // TODO: Not sure if this is necessary
    switchToPluginFrame(); // TODO: Not sure if this is necessary
  };

  // hovers over objects in the right panel and assert whether the box shadow color is changed
  this.hoverOverObjects = function(objects) {
    for (let i = 0; i < objects.length; i++) {
      objects[i].moveTo();
      browser.pause(1000);
      expect(objects[i].getCSSProperty('box-shadow').value).toEqual('rgba(0,0,0,0.5)0px0px4px0px');
    }
  };

  // hovers over object names in the right panel and assert whether the backgroiund color changed
  this.hoverOverObjectNames = function(objectNames) {
    for (let i = 0; i < objectNames.length; i++) {
      objectNames[i].moveTo();
      browser.pause(1000);
      expect(objectNames[i].getCSSProperty('background-color').value).toEqual('rgba(235,235,235,1)');
    }
  };
};

export default new PluginRightPanel();
