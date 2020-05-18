/* eslint-disable class-methods-use-this */
import { switchToPluginFrame, switchToExcelFrame, changeBrowserTab } from '../utils/iframe-helper';
import { waitAndClick, waitAndDoubleClick } from '../utils/click-helper';
import { rightPanelSelectors } from '../../constants/selectors/plugin.right-panel-selectors';
import { excelSelectors } from '../../constants/selectors/office-selectors';
import { waitForNotification } from '../utils/wait-helper';
import { pressEnter } from '../utils/keyboard-actions';


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

  /**
   * Clicks Clear Data button in Settings menu
   */
  clickClearData() {
    waitAndClick($(rightPanelSelectors.clearDataBtn));
  }

  /**
   * Clicks Ok button on Clear Data confiramtion to start the action
   */
  clickClearDataOk() {
    waitAndClick($(rightPanelSelectors.clearOkBtn));
  }

  logout() {
    console.log('Should log out');
    this.clickSettings();
    this.clickLogout();
  }

  clickImportDataButton() {
    console.log('Should click import data button');
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.importDataBtn), 20000);
    browser.pause(999);
  }

  /**
   * Moves cursor over particular element (ex. refresh icon)
   *
   * @param {Number} index index of the icon in the icon bar
   */
  moveToRefreshIcon(index) {
    $(rightPanelSelectors.getRefreshBtnForObject(index)).moveTo();
  }

  /**
   * Moves cursor over particular element (ex. edit icon)
   *
   * @param {Number} index index of the icon in the icon bar
   */
  moveToEditIcon(index) {
    $(rightPanelSelectors.getEdithBtnForObject(index)).moveTo();
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
    console.log('Should click add data button');
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.addDataBtn));
    browser.pause(999);
  }

  refreshFirstObjectFromTheList() {
    console.log('Should refresh first object');
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
    console.log('Should refresh the object');
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
    console.log('Should click Edit');
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
   * Clicks edit button in duplicate popup. Will work only when duplicate popup is opened.
   *
   */
  clickDuplicatePopupEditBtn() {
    switchToPluginFrame();
    const duplicatePopupEditBtn = $(rightPanelSelectors.duplicatePopupEditBtn);
    duplicatePopupEditBtn.moveTo();
    browser.pause(1000);
    waitAndClick(duplicatePopupEditBtn);
  }

  /**
   * Selects active cell option in duplicate popup. Will work only when duplicate popup is opened.
   *
   */
  selectActiveCellOptionInDuplicatePopup() {
    switchToPluginFrame();
    const activeCellOption = $(rightPanelSelectors.duplicatePopupActiveCellOption);
    activeCellOption.moveTo();
    browser.pause(1000);
    waitAndClick(activeCellOption);
  }

  /**
   * Selects new sheet option in duplicate popup. Will work only when duplicate popup is opened.
   *
   */
  selectNewSheetOptionInDuplicatePopup() {
    switchToPluginFrame();
    const newSheetOption = $(rightPanelSelectors.duplicatePopupNewSheetOption);
    newSheetOption.moveTo();
    browser.pause(1000);
    waitAndClick(newSheetOption);
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
    console.log('Should click the object in right panel');
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
  /**
   * Select all imported objects. Will work when there is at least one or more objects imported.
   */
  selectAll() {
    console.log('Should select all imported objects');
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.checkBoxAll));
  }

  /**
   * Run refresh for selected imported objects. Will work when there is at least one or more objects selected.
   */
  refreshSelected() {
    console.log('Should refresh selected objects');
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.refreshAllBtn));
  }

  /**
   * Run remove for selected imported objects. Will work when there is at least one or more objects selected.
   */
  removeSelected() {
    console.log('Should remove selected objects');
    switchToPluginFrame();
    waitAndClick($(rightPanelSelectors.deleteAllBtn));
  }

  /**
   * Clicks master checkbox
   */
  clickMasterCheckbox() {
    waitAndClick($(rightPanelSelectors.checkBoxAll));
  }

  /**
   * Clicks checkbox for a given object
   *
   * @param {Number} index index of an imported object in the right side panel
   */
  clickObjectCheckbox(index) {
    waitAndClick($(rightPanelSelectors.getObjectCheckbox(index)));
  }

  refreshAll() {
    console.log('Should refresh all');
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
    console.log('Should close the notification');
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

  /**
   * Waits for notification, asserts the notification message was displayed and closes the notification
   *
   * @param {String} notificationMessage Notification message that should be displayed
   */
  waitAndCloseNotification(notificationMessage) {
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(notificationMessage);
    this.closeNotificationOnHover();
  }

  /**
   * Press Cancel button on object pending notification
   *
   * @param {Number} index index of an imported object in the right side panel
   */
  cancelObjectPendingAction(index) {
    console.log('Should cancel object pending action');
    const objectCancelBtn = $(rightPanelSelectors.getPendingNotificationCancelBtnAt(index));
    waitAndClick(objectCancelBtn);
  }

  /**
   * Changes the name of object that is imported. Will work if there is an object imported.
   *
   * @param {Number} index Index of the object in the right side panel that the name will be changed. Starts from 1 (1 is the first from the top)
   * @param {String} text Text to enter for new object name
   */
  changeObjectName(index, text) {
    switchToPluginFrame();
    const divNameInput = $(rightPanelSelectors.getNameInputForObject(index));
    divNameInput.moveTo();
    browser.pause(2222);
    waitAndDoubleClick(divNameInput);
    browser.pause(3333);
    const nameText = $(rightPanelSelectors.getNameInputTextForObject(index));
    nameText.clearValue();
    nameText.setValue(text);
    pressEnter();
  }

  /**
   * Checks whether an element is opaque (not transparent)
   *
   * @param {String} selector selector for which element to check opacity
   *
   * @returns {Boolean} true if an element is opaque, false if an element is transparent
   */
  isOpaque(selector) {
    return $(selector).getCSSProperty('opacity').value === 1;
  }

  /**
   * Hovers over icon bar buttons for a given object
   * to show the tooltip and gets the tooltip text
   *
   * @param {Number} objectIndex index of the imported object
   * @param {Number} iconIndex index of the icon in the icon bar
   *
   * @returns {String} tooltip text for a given button
   */
  getIconBarTooltipText(objectIndex, iconIndex) {
    switch (iconIndex) {
      case 1:
        $(rightPanelSelectors.getDuplicateBtnForObject(objectIndex)).moveTo();
        browser.pause(1000);
        return $(rightPanelSelectors.getDuplicateBtnForObjectTooltip(objectIndex)).getText();
      case 2:
        $(rightPanelSelectors.getEdithBtnForObject(objectIndex)).moveTo();
        browser.pause(1000);
        return $(rightPanelSelectors.getEdithBtnForObjectTooltip(objectIndex)).getText();
      case 3:
        $(rightPanelSelectors.getRefreshBtnForObject(objectIndex)).moveTo();
        browser.pause(1000);
        return $(rightPanelSelectors.getRefreshBtnForObjectTooltip(objectIndex)).getText();
      case 4:
        $(rightPanelSelectors.getRemoveBtnForObject(objectIndex)).moveTo();
        browser.pause(1000);
        return $(rightPanelSelectors.getRemoveBtnForObjectTooltip(objectIndex)).getText();
      default:
        throw new Error('Error in getIconBarTooltipText');
    }
  }

  /**
   * Hovers over master icon bar buttons
   * to show tooltip and gets tooltip text
   *
   * @param {Number} iconIndex index of the icon in the icon bar
   *
   * @returns {String} tooltip text for the given button
   */
  getMasterIconBarTooltipText(iconIndex) {
    switch (iconIndex) {
      case 1:
        $(rightPanelSelectors.refreshAllBtn).moveTo();
        browser.pause(1000);
        return $(rightPanelSelectors.refreshAllBtnTooltip).getText();
      case 2:
        $(rightPanelSelectors.deleteAllBtn).moveTo();
        browser.pause(1000);
        return $(rightPanelSelectors.deleteAllBtnTooltip).getText();
      default:
        throw new Error('Error in getMasterIconBarTooltipText');
    }
  }
}

export default new PluginRightPanel();
