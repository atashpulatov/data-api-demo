import {switchToPluginFrame, switchToPopupFrame, switchToExcelFrame} from '../utils/iframe-helper';
import {waitAndClick} from '../utils/click-helper';
import {selectors as s} from '../../constants/selectors/plugin.right-panel-selectors';
// import {selectors as se} from '../../constants/selectors/popup-selectors';
// import {excelSelectors as exSe} from '../../constants/selectors/office-selectors';
// const EC = protractor.ExpectedConditions;

const PluginRightPanel = function() {
  this.clickLoginPopUpBtn = function() {
     waitAndClick($(s.loginPopUpBtn));
  };

  this.clickLogout = function() {
    waitAndClick($(s.logoutBtn));
  };

  this.clickSettings = function() {
    waitAndClick($(s.settingsBtn));
  };

  this.logout = function() {
    this.clickSettings();
    this.clickLogout();
  };

  this.clickImportDataButton = function() {
    switchToPluginFrame();
    waitAndClick($(s.importDataBtn));
    browser.pause(999);
  };

    // TODO: needs to be refactor for webdriverIO - Currently it is not used
    this.loginToPluginLDAP = async function(username, password) {
    await switchToPluginFrame();
    await s.LDAPbutton.waitAndClick(s.LDAPbutton);
    await s.usernameInput.sendKeys(username);
    await s.passwordInput.sendKeys(password);
    await this.clickloginToPlugin();
    await browser.sleep(4444);
  };

  this.clickAddDataButton = function() {
    switchToPluginFrame();
    waitAndClick($(s.addDataBtn));
    browser.pause(999);
  };

  this.refreshFirstObjectFromTheList = function() {
    switchToPluginFrame();
    browser.pause(4444); // to do: see if we can change to some wait method
    waitAndClick($(s.refreshBtn));
  };

  this.refreshAll = function() {
    switchToPluginFrame();
    waitAndClick($(s.refreshAllBtn));
  };

  this.removeFirstObjectFromTheList = function() {
    switchToPluginFrame();
    browser.pause(3333);
    waitAndClick($(s.deleteBtn));
  };

  this.repromptFirstObjectFromTheList = function() {
    switchToPluginFrame();
    browser.pause(3333);
    waitAndClick($(s.repromptBtn));
  };

  // TODO: needs to be refactor for webdriverIO - Currently it is not used
  this.removeAllObjectsFromTheList = async function() {
    await switchToPluginFrame();
    const e = await $$('.trash').count();
    for (let i = 0; i < e; i++) {
      await this.removeFirstObjectFromTheList();
    }
  };

  this.closeNotification = function() {
    switchToPluginFrame();
    waitAndClick($('span.ant-notification-notice-btn > button'));
  };

  this.clickLoginRightPanelBtn = function() {
   waitAndClick($(s.loginRightPanelBtn));
  };

  this.loginToPlugin = function(username, password) {
    switchToPluginFrame();
    $(s.loginRightPanelBtn).waitForDisplayed(7777);
    if ( $(s.loginRightPanelBtn).isExisting()) {
      this.clickLoginRightPanelBtn();
      const handles =  browser.getWindowHandles();
      browser.switchToWindow(handles[2]); // TODO: create help function to switch tabs
      $(s.usernameInput).setValue(username);
      $(s.passwordInput).setValue(password);
      this.clickLoginPopUpBtn();
      browser.pause(2222);
      browser.switchToWindow(handles[1]); // TODO: create help function to switch tabs
    }
  };

  this.clearData = function() {
    const clearBtn = $(`.no-trigger-close*=Clear Data`); // TODO: This method will not work with localisation (Don't use 'Clear Data')
    waitAndClick(clearBtn);
    waitAndClick($(s.clearOkBtn));
  };

  this.viewDataBtn = async function() {
    await waitAndClick(s.viewDataBtn);
  };
  // this.getVersionOfThePlugin = async function() {
  //   await switchToPluginFrame();
  //   await this.clickSettings();
  //   const version = await $('.settings-version').getText();
  //   return version.substring('Version '.length);
  // };

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

  //clicks on object in the right panel and asserts whether the object was selected in the worksheet
  this.clickOnObject = async function(object, cellValue) {
    await waitAndClick(object);
    await switchToExcelFrame();
    // await browser.wait(EC.textToBePresentInElementValue(exSe.cellInput, cellValue), 3000);
    await browser.sleep(5000);
    await switchToPluginFrame();
  };

  //hovers over objects in the right panel and assert whether the box shadow color is changed
  this.hoverOverObjects = async function(objects) {
    for (let i = 0; i < objects.length; i++) {
      await browser.actions().mouseMove(objects[i]).mouseMove(objects[i]).perform();
      await browser.sleep(1000);
      await expect(objects[i].getCssValue('box-shadow')).toEqual('rgba(0, 0, 0, 0.5) 0px 0px 4px 0px');
    }
  };

  //hovers over object names in the right panel and assert whether the backgroiund color changed
  this.hoverOverObjectNames = async function(objectNames) {
    for (let i = 0; i < objectNames.length; i++) {
      await browser.actions().mouseMove(objectNames[i]).mouseMove(objectNames[i]).perform();
      await browser.sleep(1000);
      await expect(objectNames[i].getCssValue('background-color')).toEqual('rgba(235, 235, 235, 1)');
    };
  };
};

export default new PluginRightPanel();
