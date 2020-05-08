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
    this.refreshObject(1);
    console.log('First object from the list is refreshed');
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
    $(refreshBtn).moveTo();
    browser.pause(1000);
    waitAndClick($(refreshBtn));
  }

  /**
   * Clicks to edit button for imported object. Will work when there is one or more objects imported.
   *
   * @param {Number} index indicates the report represented in the plugin. Starts with 1 which indicates the last imported object.
   *
   * @memberof PluginRightPanel
   */
  editObject(index) {
    switchToPluginFrame();
    const editBtn = rightPanelSelectors.getEdithBtnForObject(index);
    $(editBtn).moveTo();
    browser.pause(1000);
    waitAndClick($(editBtn));
  }

  /**
   * Clicks duplicate button for imported object under given index. Will work when there is one or more objects imported.
   *
   * @param {Number} index indicates the report represented in the plugin. Starts with 1 which indicates the last imported object.
   */
  duplicateObject(index) {
    switchToPluginFrame();
    const duplicateBtn = rightPanelSelectors.getDuplicateBtnForObject(index);
    $(duplicateBtn).moveTo();
    browser.pause(1000);
    waitAndClick($(duplicateBtn));
  }

  /**
   * Clicks import button in duplicate popup. Will work only when duplicate popup is opened.
   *
   */
  clickDuplicatePopupImportBtn() {
    switchToPluginFrame();
    const duplicatePopupImportBtn = $(rightPanelSelectors.duplicatePopupImportBtn);
    duplicatePopupImportBtn.moveTo();
    browser.pause(1000);
    waitAndClick(duplicatePopupImportBtn);
  }

  /**
   * Clicks to remove button for imported object. Will work when there is one or more objects imported.
   *
   * @param {Number} index indicates the report represented in the plugin. Starts with 1 which indicates the last imported object.
   *
   * @memberof PluginRightPanel
   */
  removeObject(index) {
    switchToPluginFrame();
    const removeBtn = rightPanelSelectors.getRemoveBtnForObject(index);
    $(removeBtn).moveTo();
    browser.pause(1000);
    waitAndClick($(removeBtn));
  }

  /**
   * Clicks to select the imported object in the right panel. Will work when there is one or more objects imported.
   *
   * @param {Number} index indicates the report represented in the plugin. Starts with 1 which indicates the last imported object.
   *
   * @memberof PluginRightPanel
   */
  clickObjectInRightPanel(index) {
    switchToPluginFrame();
    const objectSelected = rightPanelSelectors.getObjectSelector(index);
    browser.pause(1000);
    waitAndClick($(objectSelected));
  }

  /**
   * Gets text of input name for imported object under given index. Will work when there is one or more objects imported.
   *
   * @param {Number} index indicates the report represented in the plugin. Starts with 1 which indicates the last imported object.
   *
   * @returns {String} Name of imported object under given index
   */
  getNameOfObject(index) {
    switchToPluginFrame();
    const nameInput = $(rightPanelSelectors.getNameInputForObject(index));
    return nameInput.getText();
  }

  refreshAll() {
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.checkBoxAll));
    waitAndClick($(rightPanelSelectors.refreshAllBtn));
  }


  removeFirstObjectFromTheList() {
    this.removeObject(1);
  }


  // Currently it is not used
  removeAllObjectsFromTheList() {
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.checkBoxAll));
    waitAndClick($(rightPanelSelectors.deleteAllBtn));
  }

  closeNotification() {
    switchToPluginFrame();
    waitAndClick($('.warning-notification-button-container'));
  }

  clickLoginRightPanelBtn() {
    waitAndClick($(rightPanelSelectors.loginRightPanelBtn));
  }

  closeNotificationOnHover() {
    const selector = rightPanelSelectors.notificationContainer;
    const selectorOther = rightPanelSelectors.objectHeaderContainer;
    $(selectorOther).moveTo();
    browser.pause(1000);
    $(selector).moveTo();
    browser.pause(1000);
  }

  closeAllNotificationsOnHover() {
    switchToPluginFrame();
    const objectCount = $$(rightPanelSelectors.objectContainer).length;
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

  /**
   * Clicks on desired object in the right panel and asserts whether the object was selected in the worksheet
   *
   * @param {Number} index Index of the object in the right side panel to be selected. It starts from 1 (1 is the first from the top)
   * @param {String} cellValue Value of the top-left corner of the selected object. It is used to assert that after the object is clicked in the right side panel, in Excel, the table of that object was selected.
   *
   * @memberof PluginPopup
   */
  clickObjectInRightPanelAndAssert(index, cellValue) {
    this.clickObjectInRightPanel(index);
    switchToExcelFrame();
    browser.pause(1000); // TODO: Not sure if this is necessary
    expect($(excelSelectors.cellInput).getValue()).toEqual(cellValue);
  }
}

export default new PluginRightPanel();
