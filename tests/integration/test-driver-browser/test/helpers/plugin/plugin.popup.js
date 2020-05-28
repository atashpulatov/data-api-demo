/* eslint-disable class-methods-use-this */
import { waitAndClick, waitAndRightClick } from '../utils/click-helper';
import { popupSelectors } from '../../constants/selectors/popup-selectors';
import {
  switchToPluginFrame,
  switchToPromptFrame,
  switchToPopupFrame,
  switchToExcelFrame,
  switchToDialogFrame,
  switchToPromptFrameForImportDossier
} from '../utils/iframe-helper';
import pluginRightPanel from './plugin.right-panel';
import {
  pressTab, pressRightArrow, pressBackspace, pressEnter
} from '../utils/keyboard-actions';
import { waitForNotification } from '../utils/wait-helper';
import { dictionary } from '../../constants/dictionaries/dictionary';
import OfficeWorksheet from '../office/office.worksheet';
import { rightPanelSelectors } from '../../constants/selectors/plugin.right-panel-selectors';
import { logStep } from '../utils/allure-helper';

const fileName = 'plugin.popup.js';
class PluginPopup {
  searchForObject(objectName) {
    logStep(`Searching for the object "${objectName}"...    [${fileName} - searchForObject()]`);
    $(popupSelectors.searchInput).clearValue();
    $(popupSelectors.searchInput).setValue(objectName);
  }

  /**
   * Searches for attribute or metric inside the popup report preparation
   *
   * @param {String} elementName indicates the attribute or metric name that will be searched
   *
   *
   */
  searchForElements(elementName) {
    logStep(`Searching for the attribute or metric "${elementName}"...    [${fileName} - searchForElements()]`);
    $(popupSelectors.searchInputPrepareDataPopup).clearValue();
    $(popupSelectors.searchInputPrepareDataPopup).setValue(elementName);
  }

  clickImport() {
    logStep(`Clicking "Import" button...    [${fileName} - clickImport()]`);
    waitAndClick($(popupSelectors.importBtn));
  }

  clickPrepareData() {
    logStep(`Clicking "Prepare Data" button...    [${fileName} - clickPrepareData()]`);
    waitAndClick($(popupSelectors.prepareBtn));
  }

  clickCancel() {
    logStep(`Clicking "Cancel" button...    [${fileName} - clickCancel()]`);
    waitAndClick($(popupSelectors.cancelBtn));
  }

  clickBack() {
    logStep(`Clicking "Back" button...    [${fileName} - clickBack()]`);
    waitAndClick($(popupSelectors.backBtn));
  }

  clickDataPreview() {
    logStep(`Clicking "Data Preview" button...    [${fileName} - clickDataPreview()]`);
    waitAndClick($(popupSelectors.dataPreviewBtn));
  }

  clickViewSelected() {
    logStep(`Clicking "View Selected" button...    [${fileName} - clickViewSelected()]`);
    waitAndClick($(popupSelectors.viewSelected));
  }

  clickSubtotalToggler() {
    logStep(`Clicking subtotal toggler...    [${fileName} - clickSubtotalToggler()]`);
    waitAndClick($(popupSelectors.subtotalToggler));
  }

  closePreview() {
    logStep(`Clicking "Close preview" button...    [${fileName} - closePreview()]`);
    waitAndClick($(popupSelectors.closePreviewBtn));
  }

  clickRunForPromptedDossier() {
    logStep(`Clicking "Run" for prompted dossier...    [${fileName} - clickRunForPromptedDossier()]`);
    waitAndClick($(popupSelectors.runBtnForPromptedDossier));
  }

  clickRun() {
    logStep(`Clicking "Run" button...    [${fileName} - clickRun()]`);
    switchToPluginFrame();
    $(popupSelectors.runBtn).waitForExist(6000);
    waitAndClick($(popupSelectors.runBtn));
    browser.pause(3000);
  }

  clickPromptArrow() {
    logStep(`Clicking Prompt Arrow...    [${fileName} - clickPromptArrow()]`);
    waitAndClick($(popupSelectors.promptArrow));
  }

  selectAllAttributes() {
    logStep(`Selecting all the attributes...    [${fileName} - selectAllAttributes()]`);
    waitAndClick($(popupSelectors.allAttributes));
  }

  selectAllMetrics() {
    logStep(`Selecting all the metrics...    [${fileName} - selectAllMetrics()]`);
    waitAndClick($(popupSelectors.allMetrics));
  }

  selectAllFilters() {
    logStep(`Selecting all the filters...    [${fileName} - selectAllFilters()]`);
    waitAndClick($(popupSelectors.allFilters));
  }

  /**
   * Selects atrributes and metrics using all.
   */
  selectAllAttributesAndMetrics() {
    logStep(`Selecting all attributes and metrics...    [${fileName} - selectAllAttributesAndMetrics()]`);
    switchToDialogFrame();
    this.selectAllAttributes();
    this.selectAllMetrics();
  }

  /**
   * Waits for element to show up and dissapear
   * useful to validate that action has been started and finished
   *
   * @param {String} selector a css selector to validate
   *
   */
  waitUntilActionIsFinished(selector) {
    logStep(`Waiting for element to show up and dissapear...    [${fileName} - waitUntilActionIsFinished()]`);
    browser.waitUntil(() => ($(selector).isExisting()));
    browser.waitUntil(() => !($(selector).isExisting()));
  }

  /**
   * This method is used in the Prepare Data window.
   * It is used to select the desired attributes or metrics to be selected/unselected.
   * !Important! Selecting attributes only work for datasets. Selecting metrics can be used for both reports and datasets
   * To select attributes for reports, user have to user the selectAttributeElementsForReportObjects(elements) method
   * After the introduction of Attribute forms, the selectors for attributes in Reports and in Datasets are not the same
   *
   * @param {String} elements an array with the names of the attributes/metrics to be selected/unselected
   *
   */
  selectObjectElements(elements) {
    logStep(`Selecting the attributes and metrics: ${elements}...    [${fileName} - selectObjectElements()]`);
    for (let i = 0; i < elements.length; i++) {
      waitAndClick($(`span=${elements[i]}`));
    }
  }

  // This method select Objects in Prepare Data for Report Objects. After the introduction of Attribute forms, the selectors for attributes in Reports and in Datasets are not the same
  /**
   * This method is used in the Prepare Data window.
   * It is used to select the desired attributes to be selected/unselected (only for reports).
   * !Important! Selecting attributes only work for reports.
   * After the introduction of Attribute forms, the selectors for attributes in Reports and in Datasets are not the same
   *
   * @param {String} elements an array with the names of the attributes/metrics to be selected/unselected
   *
   */
  selectAttributeElementsForReportObjects(attributes) {
    logStep(`Selecting the attributes: ${attributes}...    [${fileName} - selectAttributeElementsForReportObjects()]`);
    for (let i = 0; i < attributes.length; i++) {
      waitAndClick($(`.item-title=${attributes[i]}`));
    }
  }

  changePromptQualificationItem(value) {
    logStep(`Changing the prompt qualification item to new value ${value}...    [${fileName} - changePromptQualificationItem()]`);
    switchToPopupFrame();
    waitAndClick($('div[title="- none -"]'));
    waitAndClick($(`div[title=${value}"]`));
  }

  selectFilters(names) {
    logStep(`Selecting the filters ${names}...    [${fileName} - selectFilters()]`);
    for (const [filterKey, filterInstances] of names) {
      const filter = $(`.filter-title*=${filterKey}`);
      waitAndClick(filter);
      this.selectObjectElements(filterInstances);
    }
  }

  clickHeader(headerName) {
    logStep(`Clicking the header ${headerName}...    [${fileName} - clickHeader()]`);
    waitAndClick($(`.data-tip*=${headerName}`));
  }

  /**
   * Selects object from objects list depending on passed parameter.
   *
   * NOTE: by default selects first object.
   *
   * @param {Number} objectOrder is order of an object on the list
   */
  selectObject(objectOrder = 1) {
    logStep(`Selecting the object number ${objectOrder}...    [${fileName} - selectFirstObject()]`);
    browser.pause(2222);
    let selector = '';
    switch (objectOrder) {
      case 1:
        selector = $(popupSelectors.firstObject);
        break;
      case 2:
        selector = $(popupSelectors.secondObject);
        break;
      default:
        return;
    }
    waitAndClick(selector);
  }

  selectFirstObjectWithoutSearch() {
    logStep(`Selecting the first object...    [${fileName} - selectFirstObjectWithoutSearch()]`);
    browser.pause(2222);
    waitAndClick($(popupSelectors.firstObjectWithoutSearch));
  }

  switchLibraryAndImportObject(objectName, myLibrarySwitch = false, index = 1) {
    logStep(`+ Importing the object "${objectName}"...    [${fileName} - switchLibraryAndImportObject()]`);
    switchToDialogFrame();
    browser.pause(4000);
    this.switchLibrary(myLibrarySwitch);
    browser.pause(1000);
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectObject(index);
    this.clickImport();
  }

  importObject(objectName) {
    logStep(`+ Importing the object "${objectName}"...    [${fileName} - importObject()]`);
    switchToDialogFrame();
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectObject();
    this.clickImport();
  }

  importAnyObject(objectName, index = 1) {
    logStep(`+ Importing the object "${objectName}"...    [${fileName} - importAnyObject()]`);
    switchToDialogFrame();
    browser.pause(500);
    this.switchLibrary(false);
    this.searchForObject(objectName);
    browser.pause(500);
    waitAndClick($(popupSelectors.anyObject(index)));
    this.clickImport();
  }

  selectAnyObject(index) {
    logStep(`Selecting the object number ${index}...    [${fileName} - selectAnyObject()]`);
    browser.pause(2222);
    waitAndClick($(popupSelectors.anyObject(index)));
  }

  preparePrompt(objectName) {
    logStep(`+ Selecting the object "${objectName}" and clicking "Prepare Data" button...    [${fileName} - preparePrompt()]`);
    switchToPluginFrame();
    browser.pause(500);
    this.switchLibrary(false);
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectObject();
    this.clickPrepareData();
    browser.pause(9999); // temp solution
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(7777);
  }

  selectAttributeIndex(index) {
    logStep(`Selecting the attribute number ${index}...    [${fileName} - selectAttributeIndex()]`);
    for (let i = 0; i < index.length; i++) {
      waitAndClick($(popupSelectors.attributeSelector(index[i])));
    }
  }

  importPromptDefault(objectName) {
    logStep(`+ Importing the object "${objectName}" with the default prompt answers...    [${fileName} - importPromptDefault()]`);
    this.importObject(objectName);
    browser.pause(5555); // temp solution
    $(popupSelectors.runBtn).waitForExist(3333);
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    this.clickRun();
  }

  importPromptDefaultNested(objectName) {
    logStep(`+ Importing the object "${objectName}" with the default prompt answers...    [${fileName} - importPromptDefaultNested()]`);
    this.switchLibraryAndImportObject(objectName, false);
    browser.pause(5555);
    while (true) {
      browser.pause(3000);
      switchToPluginFrame();
      if ($(popupSelectors.runBtn).isExisting()) {
        this.clickRun();
      } else {
        break;
      }
    }
  }

  /**
   * This function is used for report with nested prompts.
   * It click on edit for the first object from the list.
   * After that it is clicking run for all nested default prompts.
   *
   * @param {Number} index indicates the report represented in the plugin. Starts with 1 which indicates the last imported object.
   */

  editPromptDefaultNested(index = 1) {
    logStep(`Importing nested prompt report number ${index} using the default answers...    [${fileName} - importPromptDefaultNested()]`);
    pluginRightPanel.editObject(index);
    browser.pause(5555);
    while (true) {
      browser.pause(3000);
      switchToPluginFrame();
      if ($(popupSelectors.runBtn).isExisting()) {
        this.clickRun();
      } else {
        break;
      }
    }
  }

  isViewSelected() {
    return $(popupSelectors.viewSelected).getAttribute('class') === 'ant-switch ant-switch-checked';
  }

  openPrompt(objectName) {
    logStep(`+ Opening the prompt object "${objectName}"...    [${fileName} - openPrompt()]`);
    this.switchLibraryAndImportObject(objectName, false);
    browser.pause(9999); // temp solution
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(33333);
  }

  writeValueText(value) {
    logStep(`Writing the text value: "${value}"...    [${fileName} - writeValueText()]`);
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(7777);
    waitAndClick($(popupSelectors.valueInput), 5555);
    $(popupSelectors.valueInput).clearValue();
    $(popupSelectors.valueInput).setValue(`${value}\uE004\uE006`);
  }

  writeAttrQualificationValue(value) {
    logStep(`Writing attribute qualification value: "${value}"...    [${fileName} - writeAttrQualificationValue()]`);
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(popupSelectors.attrQualificationInput).click();
    $(popupSelectors.attrQualificationInput).clearValue();
    $(popupSelectors.attrQualificationInput).setValue(`${value}\uE004\uE004\uE006`);
  }

  writeMultiPrompt(value) {
    logStep(`Writing multiple prompt value: "${value}"...    [${fileName} - writeMultiPrompt()]`);
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(popupSelectors.calendarInput).waitForExist(7777);
    $(popupSelectors.calendarInput).click();
    $(popupSelectors.calendarInput).clearValue();
    $(popupSelectors.calendarInput).setValue(`${value}\uE004\uE004\uE006`);
    console.log('Prompts are answered');
  }

  removeAllSelected() {
    logStep(`Removing all the selected...    [${fileName} - removeAllSelected()]`);
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(popupSelectors.promptRemoveAllSelected).click();
  }

  changeExpressionQualificationAndRun(value) {
    logStep(`Writing value in Expression Qualification: "${value}"...    [${fileName} - changeExpressionQualificationAndRun()]`);
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(popupSelectors.expressionInList).click();
    waitAndClick($(`.mstrListBlockItemName*=${value}`));
    this.clickRun();
  }

  promptSelectObject(objectName) {
    logStep(`Prompting selected object "${objectName}"...    [${fileName} - promptSelectObject()]`);
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(22222);
    waitAndClick($(`.mstrListBlockItem*=${objectName}`));
    browser.pause(2222);
    waitAndClick($('.mstrToolButtonRounded'));
  }

  promptSelectObjectForEdit(objectName) {
    logStep(`Prompting selected object for edit "${objectName}"...    [${fileName} - promptSelectObjectForEdit()]`);
    switchToPromptFrame();
    browser.pause(10000);
    $('#mstrdossierPromptEditor').waitForExist(7777);
    waitAndClick($(`.mstrListBlockItem*=${objectName}`));
    browser.pause(2222);
    waitAndClick($('.mstrToolButtonRounded'));
  }

  prepareObject(objectName, elements, filters) {
    logStep(`+ Preparing data for the object "${objectName}", selecting the attributes/metrics:"${elements}", and filters: "${filters}"...    [${fileName} - prepareObject()]`);
    this.openPrepareData(objectName);
    this.selectObjectElements(elements);
    this.selectFilters(filters);
    browser.pause(1111);
    this.clickImport();
  }

  searchForPreparedObject(objectName) {
    logStep(`Searching the element "${objectName}" in Prepare Data...    [${fileName} - searchForPreparedObject()]`);
    $(popupSelectors.prepareSearchInput).clearValue();
    $(popupSelectors.prepareSearchInput).setValue(objectName);
  }

  /**
   * Opens the more menu for visualization. Will work if dossier window is presented.
   *
   * @param {String} visID Id of the visualization, for ex: '#mstr106'
   *
   */
  openMoreMenuForVisualization(visID) {
    logStep('Opening more menu of visualization');
    switchToPromptFrame();
    const titleBar = $(popupSelectors.dossierWindow.getVisualisationTitleBar(visID));
    titleBar.waitForClickable(10000, false, `${titleBar} is not clickable`);
    titleBar.moveTo();
    browser.pause(1000);
    const moreMenu = $(popupSelectors.dossierWindow.getMoreItemMenu(visID));
    moreMenu.waitForClickable(60000, false, `${moreMenu} is not clickable`);
    waitAndClick(moreMenu);
  }

  /**
   * Opens show data panel for for visualization. Will work if dossier window is presented.
   *
   * @param {String} visID Id of the visualization, for ex: '#mstr106'
   *
   */
  openShowDataPanel(visID) {
    this.openMoreMenuForVisualization(visID);
    logStep('Opening show data panel');
    const showDataSelector = $(popupSelectors.dossierWindow.showDataSelector);
    showDataSelector.waitForClickable(60000, false, `${showDataSelector} is not clickable`);
    waitAndClick(showDataSelector);
  }

  /**
   * Closes show data panel for for visualization. Will work if dossier window and show data panel is presented.
   *
   */
  closeShowDataPanel() {
    logStep('Closing show data panel');
    const closeShowDataSelector = $(popupSelectors.dossierWindow.closeShowDataSelector);
    closeShowDataSelector.waitForClickable(60000, false, `${closeShowDataSelector} is not clickable`);
    waitAndClick(closeShowDataSelector);
  }

  /**
   * Opens export menu that is inside more menu. Will work if dossier window is presented.
   *
   * @param {String} visID Id of the visualization, for ex: '#mstr106'
   */
  showExportMenu(visID) {
    const exportSelector = $(popupSelectors.dossierWindow.exportSelector);
    this.openMoreMenuForVisualization(visID);
    exportSelector.waitForDisplayed(60000, false, `${exportSelector} is not displayed`);
    exportSelector.moveTo();
  }

  /**
   * Clicks export to excel button if presented. Will work if dossier window is presented.
   *
   * @param {String} visID Id of the visualization, for ex: '#mstr106'
   *
   */
  exportToExcel(visID) {
    logStep('Export to excel');
    this.showExportMenu(visID);
    const exportToExcel = $(popupSelectors.dossierWindow.exportToExcel);
    exportToExcel.waitForClickable(60000, false, `${exportToExcel} is not clickable`);
    waitAndClick(exportToExcel);
    this.waitForExport();
  }

  /**
   * Clicks export to PDF button if presented. Will work if dossier window is presented.
   *
   * @param {String} visID Id of the visualization, for ex: '#mstr106'
   *
   */
  exportToPDF(visID) {
    logStep('Export to PDF');
    this.showExportMenu(visID);
    const exportToPDF = $(popupSelectors.dossierWindow.exportToPDF);
    exportToPDF.waitForClickable(60000, false, `${exportToPDF} is not clickable`);
    waitAndClick(exportToPDF);
    const confirmExportToPDF = $(popupSelectors.dossierWindow.confirmExportToPDF);
    confirmExportToPDF.waitForClickable(60000, false, `${confirmExportToPDF} is not clickable`);
    waitAndClick(confirmExportToPDF);
    this.waitForExport();
  }

  /**
   * Clicks export to Data button if presented. Will work if dossier window is presented.
   *
   * @param {String} visID Id of the visualization, for ex: '#mstr106'
   *
   */
  exportToData(visID) {
    logStep('Export to Data');
    this.showExportMenu(visID);
    const exportToData = $(popupSelectors.dossierWindow.exportToData);
    exportToData.waitForClickable(60000, false, `${exportToData} is not clickable`);
    waitAndClick(exportToData);
    this.waitForExport();
  }

  /**
   * Waits for exporting the object. If limit is reached. Will work if dossier window is presented.
   *
   * @param {Number} limit of duration for export. Assigned to 10 by default.
   *
   * @throws {Error} Export wait limit is reached.
   */
  waitForExport(limit = 10) {
    let count = 0;
    let progress = true;
    const { exportSpinner } = popupSelectors;
    exportSpinner.waitForDisplayed(60000, false, `${exportSpinner} is not displayed`);
    while (progress) {
      if (count === limit) {
        throw new Error('Export wait limit is reached. Object still could not exported');
      } else if (!exportSpinner.isDisplayed()) {
        progress = false;
      } else {
        browser.pause(1000);
        count++;
      }
    }
  }

  // TODO: Refactor to webDriverIO. This method is only used in TC39453
  // async checkSorting (order, headerName) {
  //   const columnHeaders = element.all(by.css(popupSelectors.columnHeaders));
  //   const columnTitles = columnHeaders.all(by.css());
  //   for (let i = 0; i < columnTitles.length; i++) {
  //     if (columnTitles.get(i) === headerName) {
  //       switch (order) {
  //       case 'up':
  //         await expect(columnHeaders.get(i).element(by.css(popupSelectors.sortedUp)).isPresent()).toBe(true);
  //         break;
  //       case 'down':
  //         await expect(columnHeaders.get(i).element(by.css(popupSelectors.sortedDown)).isPresent()).toBe(true);
  //         break;
  //       default:
  //         break;
  //       }
  //     }
  //   }
  // }

  // TODO: Refactor to webDriverIO. This method is only used in TC39454
  // async checkDisplayedObjectNames(searchedString) {
  //   for (let i = 0; i < popupSelectors.displayedObjects.length; i++) {
  //     await expect(popupSelectors.displayedObjects.get(i).getText().toContain(searchedString));
  //   }
  // }

  // Currently this method is not used
  checkIfFilterIsClicked(filterName) {
    expect($(`.filter-title*=${filterName}`).getCSSProperty('background-color').value).toEqual('#1890FF');
  }

  deleteFromSearch() {
    logStep(`+ Deleting from searchi...    [${fileName} - deleteFromSearch()]`);
    const searchedValue = $(popupSelectors.searchInput).getAttribute('value');
    for (let i = 0; i < searchedValue.length; i++) {
      $(popupSelectors.searchInput).setValue('\uE003');
    }
  }

  importObjectAndGetTotalTime(objectName) {
    logStep(`+ Importing object "${objectName}" and getting the total time...    [${fileName} - importObjectAndGetTotalTime()]`);
    this.importObject(objectName);
    const begin = Date.now();
    browser.pause(2000);
    let popupExists = true;
    while (popupExists) {
      switchToExcelFrame();
      const popupDiv = $('#WACDialogPanel').isExisting();
      if (!popupDiv) {
        if (!$('#WACDialogPanel').isExisting()) {
          popupExists = false;
        }
      }
    }
    const end = Date.now();
    const timeSpent = (end - begin) / 1000;
    console.log(`Total time importing "${objectName}":  ${timeSpent} secs`);
    return timeSpent;
  }

  /**
   * Returns a boolean based on the myLibrary switch state
   * @returns {boolean} true if myLibrary is on, false if myLibrary is off
   */
  getMyLibraryState() {
    const myLibrarySwitch = $(popupSelectors.myLibrary);
    myLibrarySwitch.waitForExist(5000);
    return myLibrarySwitch.getAttribute('aria-checked') === 'true';
  }

  /**
   * Swtiches the my library toggle to desired state.
   *
   * @param {Boolean} newState indicates how the state of switch should be.
   *
   */
  switchLibrary(newState) {
    logStep(`Switching "My Library" button to "${newState}"...    [${fileName} - switchLibrary()]`);
    switchToDialogFrame();
    const myLibrarySwitch = $(popupSelectors.myLibrary);
    myLibrarySwitch.waitForExist(5000);
    const checked = myLibrarySwitch.getAttribute('aria-checked');
    if ((checked === 'true') !== newState) { waitAndClick(myLibrarySwitch); }
  }

  /**
   * Opens the desired dossier window. Will work if objects window is rendered.
   *
   * @param {String} dossierName indicates the name of dossier that is wanted
   * @param {Number} timeToLoadDossier amount of time that browser will be paused for dossier to load. Is set to 10 sec by default
   * @param {Boolean} myLibrarySwitch indicates how the state of my library switch should be.
   * @param {Number} index  indicates which object should be imported.
   *
   */
  openDossier(dossierName, timeToLoadDossier = 10000, myLibrarySwitch = false, index = 1) {
    this.switchLibraryAndImportObject(dossierName, myLibrarySwitch, index);
    browser.pause(timeToLoadDossier);
  }

  /**
   * Used to import the visualization.
   * It has to be used inside the Dossier window.
   *
   * @param {String} visContainerId Id of the visualization, for ex: '#mstr114'
   */
  selectAndImportVisualization(visContainerId) {
    logStep(`+ Importing the visualization: "${visContainerId}"...    [${fileName} - selectAndImportVisualization()]`);
    this.selectVisualization(visContainerId);
    switchToPluginFrame();
    this.clickImport();
  }

  /**
   * Used to get the tooltip of the not clickable import button. Will work if dossier window is presented.
   *
   * @param {String} visContainerId Id of the visualization, for ex: '#mstr114'
   *
   */
  selectAndMoveToImportVisualization(visContainerId) {
    logStep(`+ Selecting and moving to import visualization: "${visContainerId}"...    [${fileName} - selectAndMoveToImportVisualization()]`);
    this.selectVisualization(visContainerId);
    switchToPluginFrame();
    $(popupSelectors.importBtn).moveTo();
    browser.pause(1000);
  }

  /**
   * Used to select the desired visualization. Will work if dossier window is presented.
   *
   * @param {String} visContainerId Id of the visualization, for ex: '#mstr114'
   *
   */
  selectVisualization(visContainerId) {
    logStep(`Selecting the visualization ${visContainerId}.`);
    switchToPromptFrame();
    let visSelector;
    if (typeof visContainerId === 'undefined') {
      visSelector = $(popupSelectors.visualizationSelector);
    } else {
      $(visContainerId).waitForDisplayed(60000, false, `${visContainerId} is not displayed`);
      visSelector = $(`${visContainerId} ${popupSelectors.visualizationSelector}`);
      visSelector.waitForClickable(60000, false, `${visSelector} is not clickable`);
    }
    waitAndClick(visSelector, 40000);
    browser.pause(2500);
    switchToPluginFrame();
    $(popupSelectors.importBtn).waitForEnabled(15000);
    this.clickImport();
  }

  showTotals(objectId) {
    logStep(`Showing totals: "${objectId}"...    [${fileName} - showTotals()]`);
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(popupSelectors.showTotalsButton));
    browser.pause(1000);
    waitAndClick($(popupSelectors.totalButton));
    waitAndClick($(popupSelectors.okButton));
    browser.pause(4000);
  }

  sortAscending(objectId) {
    logStep(`Sorting ascending: "${objectId}"...    [${fileName} - sortAscending()]`);
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(popupSelectors.sortAscendingButton));
    browser.pause(4000);
  }

  // TODO:
  // method is used to select attributes(to check checkboxes) and attribute forms.
  // parameters: JSON object, containing attributes as keys and attribute forms as values
  selectAttributesAndAttributeForms(elements) {
    logStep(`Selecting attributes and attributes forms: "${elements}"...    [${fileName} - selectAttributesAndAttributeForms()]`);
    switchToDialogFrame();
    for (const [attribute, attributeForm] of Object.entries(elements)) {
      waitAndClick($(`${popupSelectors.attributeCheckBox}=${attribute}`));
      if (attributeForm && attributeForm.length > 0) {
        browser.pause(500);
        waitAndClick($(`${popupSelectors.firstClosedAttributeFormSwitcher}`));
        for (let i = 0; i < attributeForm.length; i++) {
          browser.pause(500);
          waitAndClick($(`${popupSelectors.attributeCheckBox}=${attributeForm[i]}`));
        }
      }
    }
  }

  selectAttributeFormVisualisation(type) {
    logStep(`Selecting attributes attributes forms visualization: "${type}"...    [${fileName} - selectAttributeFormVisualisation()]`);
    waitAndClick($(popupSelectors.attributeFormDropdown));
    browser.pause(500);
    waitAndClick($(`${popupSelectors.attributeFormDropDownItem}=${type}`));
    browser.pause(500);
  }

  sortDescending(objectId) {
    logStep(`Sorting descending: "${objectId}"...    [${fileName} - sortDescending()]`);
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(popupSelectors.sortDescendingButton));
    browser.pause(4000);
  }

  drillByCategory(objectId) {
    logStep(`Drilling by  category: "${objectId}"...    [${fileName} - drillByCategory()]`);
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(popupSelectors.drillButton));
    browser.pause(1000);
    waitAndClick($(popupSelectors.categoryButton));
    browser.pause(4000);
  }

  /**
   * Toggles attribute elements for filter at dossier filter panel
   *
   * @param {Number} filterIndex Index of the filter on dossier filter panel (starts from 1)
   * @param {Array} valuesIndexes Indexes of elements to toggle (starts from 1)
   */
  selectValuesFromDossierListFilter(filterIndex, valuesIndexes) {
    logStep(`Selecting attribute elements for filter at dossier filter panel...    [${fileName} - selectValuesFromDossierListFilter()]`);
    const { dossierWindow } = popupSelectors;
    waitAndClick($(dossierWindow.filtersMenu.getFilterAt(filterIndex)), 1000);
    valuesIndexes.forEach(valueIndex => {
      waitAndClick($(dossierWindow.filtersMenu.selectFilterValueAt(valueIndex)), 1000);
    });
    waitAndClick($(dossierWindow.filtersMenu.getFilterAt(filterIndex)), 1000);
  }

  /**
   * Sets value for one of the inputs for slider filter in dossier filters
   *
   * @param {Number} filterIndex Index of the filter on dossier filter panel (starts from 1)
   * @param {String} position 'left' for min value in slider, 'right' for max value in slider
   * @param {String} value value that will be inserted to input
   */
  setValueOnDossierSliderFilter(filterIndex, position, value) {
    logStep(`Setting value for one of the inputs for slider filter in dossier filters...    [${fileName} - setValueOnDossierSliderFilter()]`);
    const { dossierWindow } = popupSelectors;
    const maxValueInput = $(`${dossierWindow.filtersMenu.getFilterAt(filterIndex)} ${dossierWindow.filtersMenu.getSliderInput(position)} > input`);
    maxValueInput.doubleClick();
    pressBackspace();
    maxValueInput.setValue(value);
  }

  /**
   * Sets filter (value for given input) on dossier.
   *
   * @param {String} input is a selector for given input
   * @param {Number} value is a value for given input
   */
  setFilterOnDossier(input, value) {
    logStep(`Setting value ${value} for given input`);
    const { filterBtn, filtersMenu } = popupSelectors.dossierWindow;
    waitAndClick($(filterBtn));
    browser.pause(1000);
    $(input).setValue(value);
    browser.pause(1000);
    waitAndClick($(filtersMenu.buttonApplyFilters));
    browser.pause(1000);
  }

  /**
   * Refresh Dossier to default state
   *
   */
  refreshDossier() {
    logStep(`Refreshing Dossier...    [${fileName} - refreshDossier()]`);
    const { dossierWindow } = popupSelectors;
    waitAndClick($(dossierWindow.buttonRefreshDossier), 1000);
    waitAndClick($(dossierWindow.buttonConfirmRefresh), 1000);
  }

  /**
   * Apply the selected bookmark
   *
   * @param {Number} index Index of the bookmark in dossier (starts from 1)
   */
  applyDossierBookmark(index) {
    logStep(`Applying the bokmark number ${index}...    [${fileName} - applyDossierBookmark()]`);
    const { dossierWindow } = popupSelectors;
    waitAndClick($(dossierWindow.buttonBookmarks), 1000);
    waitAndClick($(dossierWindow.getBookmarkItemAt(index)), 1000);
  }

  /**
   * Go to page/chapter in dossier
   *
   * @param {Number} index Index of the page/chapter item in dossier (starts from 1)
   */
  goToDossierPageOrChapter(index) {
    switchToPromptFrame();
    logStep(`Changing to page or chapter number ${index}...    [${fileName} - goToDossierPageOrChapter()]`);
    const { dossierWindow } = popupSelectors;
    $(dossierWindow.buttonToC).waitForExist(10000);
    browser.pause(5555);
    waitAndClick($(dossierWindow.buttonToC), 1000);
    waitAndClick($(dossierWindow.getTocItemAt(index)), 1000);
  }

  /**
   * Gets rows from Table of Objects
   * @returns {Array} array of rows
   */
  getTableRows() {
    return $$(popupSelectors.tableRows);
  }

  /**
   * copies IDs of rows in table of objects by expanding Details panel and copying IDs
   * @returns {String[]} array of IDs
   */
  copyObjectsID() {
    logStep(`Copying objects ID...    [${fileName} - copyObjectsID()]`);
    const rows = this.getTableRows();
    const idsArray = [];
    for (const row of rows) {
      const expandButton = row.$(popupSelectors.expandButton);
      expandButton.click();
      const idField = row.$(popupSelectors.idDetail);
      idField.click();
      idsArray.push(idField.getText());
    }
    return idsArray;
  }

  /**
   * expanding Details panel for an object in table of objects
   * @param {Number} index row number to expand Details panel for
   */
  expandObjectDetails(index) {
    logStep(`Expanding details for the object number ${index}...    [${fileName} - expandObjectDetails()]`);
    $(popupSelectors.expandButton).waitForExist({ timeout: 3000 });
    const expandButtons = $$(popupSelectors.expandButton);
    expandButtons[index - 1].click();
  }

  /**
   * Hovers over the expand button for the given object
   * to show the tooltip and gets the tooltip text
   *
   * @param {Number} index index of the object in the table
   * @param {Boolean} isExpanded represents row state collapsed/expanded
   * @returns {String} tooltip text for the location element
   *
   */
  getExpandButtonTooltipText(index, isExpanded = false) {
    logStep(`Hovering over the expand button for the object number ${index}...    [${fileName} - getExpandButtonTooltipText()]`);
    const expandButtonSelector = !isExpanded ? popupSelectors.expandButton : popupSelectors.expandButtonOpen;
    $(expandButtonSelector).waitForExist({ timeout: 3000 });
    const expandButtons = $$(expandButtonSelector);
    expandButtons[index - 1].moveTo();
    const expandButtonTooltips = $$(popupSelectors.expandButtonTooltip);
    return expandButtonTooltips[index - 1].getText();
  }

  /**
   * copies Object Details from Details panel to clipboard and return the detail value
   * @param {Number} index index of the Detail Table to copy from
   * @returns {String} the detail value
   */
  copyToClipboardObjectDetails(index) {
    logStep(`Copyig Object Details from Details panel of the object number ${index}...    [${fileName} - copyToClipboardObjectDetails()]`);
    const INDEX_TO_DETAIL = {
      1: popupSelectors.typeDetail, // Type
      2: popupSelectors.idDetail, // ID
      3: popupSelectors.createdDetail, // Created
      4: `${popupSelectors.detailsTable} > table ${popupSelectors.locationDetail}`, // Location
      5: `${popupSelectors.detailsTable} > table ${popupSelectors.descriptionDetail}`, // Description
    };
    const objectDetail = $(INDEX_TO_DETAIL[index]);
    objectDetail.click();
    return objectDetail.getText();
  }

  /**
   * Clicks Filter button, that opens Filter Panel
   */
  clickFilterButton() {
    logStep(`Clicking filter button...    [${fileName} - clickFilterButton()]`);
    waitAndClick($(popupSelectors.filterButton));
  }

  /**
   * Sets checkbox to checked
   * @param {String} category category in which the checbox is, like 'Application'
   * @param {String} item name of the chosen checkBox, like 'MicroStrategy Tutorial'
   */
  tickFilterCheckBox(category, item) {
    logStep(`Setting checkbox checked for the category: "${category}" and the item "${item}"...    [${fileName} - tickFilterCheckBox()]`);
    $(popupSelectors.filterCheckbox(category, item)).click();
  }

  /**
   * Pastes clipboard's content to Search box, using 'Shift' + 'Insert' key combination
   */
  pasteToSearchBox() {
    logStep(`Pasting clipboard's content to Search box, using 'Shift' + 'Insert' key combination...    [${fileName} - pasteToSearchBox()]`);
    const searchBox = $(popupSelectors.searchInput);
    searchBox.setValue(['Shift', 'Insert']);
  }

  /**
   * Compares value of Search box to a given string
   * @param {String} stringToCompare
   */
  compareSearchBoxToString(stringToCompare) {
    logStep(`Comparing value of Search box to the string "${stringToCompare}"...    [${fileName} - compareSearchBoxToString()]`);
    const searchBox = $(popupSelectors.searchInput);
    browser.pause(1111);
    return searchBox.getValue() === stringToCompare;
  }

  openPrepareData(objectName, isObjectFromLibrary = false, objectOrder = 1) {
    logStep(`+ Selecting the object "${objectName}" and opening Prepare Data...    [${fileName} - openPrepareData()]`);
    switchToDialogFrame();
    this.switchLibrary(isObjectFromLibrary);
    this.searchForObject(objectName);
    browser.pause(1111);
    this.selectObject(objectOrder);
    this.clickPrepareData();
  }

  /**
   * This function is used for prompted Dossiers. It is answering the default prompt answer and it is selecting the desired visualization and importing it
   *
   * @param {Number} index Id of the visualization, for ex: '#mstr114'
   */
  importDefaultPromptedVisualisation(visContainerId) {
    logStep(`+ Answering the default prompt answer and selecting the visualization "${visContainerId}"...    [${fileName} - importDefaultPromptedVisualisation()]`);
    // Clicking 'Run' in the prompt window
    switchToPromptFrameForImportDossier();
    $('#mstrdossierPromptEditor').waitForExist(10000);
    this.clickRunForPromptedDossier();
    console.log('it was clicked');
    browser.pause(6000);
    // Importing the selected visualization
    this.selectAndImportVisualization(visContainerId);
  }

  /**
   * This function is used for prompted dossiers.
   * It click on edit for the first object from the list.
   * After that it is clicking on reprompt inside the Dossier window and answering the default prompt answer.
   * After that it is selecting the desired visualization and importing it.
   *
   * @param {Number} index Id of the visualization, for ex: '#mstr114'
   */
  repromptDefaultVisualisation(visContainerId) {
    logStep(`+ Reprompting the default prompt answer and selecting the visualization "${visContainerId}"...    [${fileName} - repromptDefaultVisualisation()]`);
    // edit
    pluginRightPanel.editObject(1);
    browser.pause(5000);
    switchToPromptFrame();
    // click reprompt icon
    $(popupSelectors.dossierWindow.repromptDossier).waitForExist(5000);
    $(popupSelectors.dossierWindow.repromptDossier).click();
    browser.pause(3000);
    // reprompt and import
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(10000);
    this.clickRunForPromptedDossier();
    console.log('it was clicked');
    browser.pause(6000);
    this.selectAndImportVisualization(visContainerId);
  }

  /**
   * Scrolls the table by passing key strings ('End', 'Page Down' etc.)
   * @param {String[]} keyNames array of key strings e.g. ['End']
   */
  scrollTable(keyNames) {
    logStep(`Scrolling the table...    [${fileName} - scrollTable()]`);
    waitAndClick($(popupSelectors.objectTable.scrollContainer));
    browser.keys(keyNames);
    browser.pause(1999); // time to scroll to the bottom of the list
  }

  /**
   * Selects the last visible object from the tableOfObjects
   */
  selectLastObject() {
    logStep(`Selecting the last object from the table...    [${fileName} - selectLastObject()]`);
    const renderedObjects = $$('[role="option"]');
    const lastObject = renderedObjects[renderedObjects.length - 1];
    waitAndClick(lastObject);
  }

  /**
   * Imports the first available visualization from a selected dossier
   */
  importVisualization() {
    logStep(`Importing the first visualization from a selected dossier...    [${fileName} - importVisualization()]`);
    switchToPromptFrame();
    browser.pause(13000); // temp solution, time for dossier to load
    $('.mstrmojo-VizBox-selector').click();

    browser.pause(2500);
    switchToPluginFrame();
    this.clickImport();
  }

  /**
   * Opens all panel for the given section
   * @param {String} section name of the section to open all panel for, e.g 'Application'
   */
  clickAllButton(section) {
    logStep(`Opening all panel for the given section "${section}"...    [${fileName} - clickAllButton()]`);
    switch (section) {
      case 'Application':
        waitAndClick($$(popupSelectors.filterPanel.expandButton)[0]);
        break;
      case 'Owner':
        if (this.getMyLibraryState()) {
          waitAndClick($$(popupSelectors.filterPanel.expandButton)[0]);
        } else {
          waitAndClick($$(popupSelectors.filterPanel.expandButton)[1]);
        }
        break;
      case 'Modified':
        waitAndClick($('.mstr-date-range-selector-container .expand-btn'));
        break;
      default:
        break;
    }
  }

  /**
       * Clicks a checkbox on all panel by given checkboxTitle
       * @param {String} checkboxTitle title of the checkbox on the allPanel
       */
  clickAllPanelElement(checkboxTitle) {
    logStep(`Clicking the checkbox "${checkboxTitle}"...    [${fileName} - clickAllPanelElement()]`);
    waitAndClick($(popupSelectors.filterPanel.getAllPanelCheckbox(checkboxTitle)));
  }

  /**
   * Clicks selectAll button for open allPanel
   */
  clickSelectAll() {
    logStep(`Clicking the "Select all" button...    [${fileName} - clickSelectAll()]`);
    waitAndClick($(popupSelectors.filterPanel.selectAllButton));
  }

  /**
   * Clicks a disabled checkbox on all panel by given checkboxTitle
   * @param {String} checkboxTitle title of the checkbox on the allPanel
   */
  clickDisabledElement(checkboxTitle) {
    logStep(`Clicking the disabled checkbox "${checkboxTitle}"...    [${fileName} - clickDisabledElement()]`);
    waitAndClick($(popupSelectors.filterPanel.getAllPanelDisabledCheckbox(checkboxTitle)));
  }

  /**
   * Scrolls down ObjectTable by the given number of pages
   *
   * @param {Number} count Number of pages to scroll down
   *
   */
  scrollTableDownByPages(count) {
    logStep(`Scrolling down ${count} pages...    [${fileName} - scrollTableDownByPages()]`);
    const scrollContainer = $(popupSelectors.objectTable.scrollContainer);
    waitAndClick(scrollContainer);
    for (let page = 0; page < count; page++) {
      browser.keys(['PageDown']);
    }
  }

  /**
   * Expands given number of rows starting at the beginning of visible rows in Table of Objects
   *
   * @param {Number} amount Number of rows to expand
   */
  expandFirstRows(amount) {
    logStep(`Expading ${amount} rows...    [${fileName} - expandFirstRows()]`);
    $(popupSelectors.expandButton).waitForExist({ timeout: 3000 });
    const expandButtons = $$(popupSelectors.expandButton);
    for (let i = 0; i < amount; i++) {
      expandButtons[i].waitForExist({ timeout: 3000 });
      expandButtons[i].click();
    }
  }

  /**
   * Expands given number of rows starting from the end of visible rows in Table of Objects
   *
   * @param {Number} amount Number of rows to expand
   */
  expandLastRows(amount) {
    logStep(`Expading ${amount} last rows...    [${fileName} - expandLastRows()]`);
    $(popupSelectors.expandButton).waitForExist({ timeout: 3000 });
    const expandButtons = $$(popupSelectors.expandButton);
    for (let i = expandButtons.length - 1; i > expandButtons.length - 1 - amount; i--) {
      expandButtons[i].waitForExist({ timeout: 3000 });
      expandButtons[i].click();
    }
  }

  /**
   * Clicks on selector and then type a value
   *
   * @param {Number} selector selector to be clicked
   * @param {String} value value to typed
   */
  clickAndKeys(selector, value) {
    logStep(`Clicking selector and typing the value ${value}...    [${fileName} - clickAndKeys()]`);
    $(selector).click();
    $(selector).keys(value);
  }

  /**
   * Expands given number of rows at the beginning and end of Table of Objects
   *
   * @param {Number} amount Number of rows to expand
   */
  expandFirstAndLastRows(amount) {
    logStep(`Expading ${amount} rows...    [${fileName} - expandFirstAndLastRows()]`);
    const filterResults = this.getFilterResults();
    amount = filterResults < amount ? filterResults : amount;
    this.expandFirstRows(amount);
    this.scrollTable(['End']);
    this.expandLastRows(amount);
  }

  /**
   * Closes given number of rows starting at the beginning of visible rows in Table of Objects
   *
   * @param {Number} amount Number of rows to close
   */
  closeRowsFromTop(amount) {
    $(popupSelectors.expandButtonOpen).waitForExist({ timeout: 3000 });
    const openExpandButtons = $$(popupSelectors.expandButtonOpen);
    for (let i = 0; i < amount; i++) {
      openExpandButtons[i].waitForExist({ timeout: 3000 });
      openExpandButtons[i].click();
    }
  }

  /**
   * Clicks the Refresh button located at the top bar of Table of Objects
   */
  clickRefreshButton() {
    logStep(`Clicking refresh button...    [${fileName} - clickRefreshButton()]`);
    waitAndClick($(popupSelectors.refreshButton));
  }

  /**
   *  Waits for the Refresh to finish by checking if spinner animation of Refresh button ended
   */
  waitForRefresh() {
    logStep(`Waiting for refresh to finish...    [${fileName} - waitForRefresh()]`);
    $(popupSelectors.refreshButton).waitForExist({ timeout: 5000 });
    browser.pause(500);
  }

  /**
   * Checks how many rows are expanded to display Details Panel, and returns the number
   *
   * @return {Number} Number of expanded rows
   */
  findAmountOfOpenRows() {
    const openRows = $$(popupSelectors.expandButtonOpen);
    return openRows.length;
  }

  /**
   * Returns true if rows at the beginning and the end of Table of Objects are collapsed. Otherwise returns false
   * @return {Boolean}
   */
  areAllRowsCollapsed() {
    let openedRows = this.findAmountOfOpenRows();
    if (openedRows > 0) { return false; }
    this.scrollTable(['End']);
    openedRows = this.findAmountOfOpenRows();
    return !(openedRows > 0);
  }

  /**
   * Returns number of objects displayed in Table of Objects as text
   * @return {String}
   */
  getFilterResults() {
    return $(popupSelectors.filterResults).getText();
  }

  /**
   * Sets Date modified in the filter panel
   *
   * @param {String} dateFrom
   * @param {String} dateTo
   */
  filterByDate(dateFrom, dateTo) {
    logStep(`Filtering by dates from ${dateFrom} to ${dateTo}...    [${fileName} - filterByDate()]`);
    const dateFromInput = $$(popupSelectors.filterPanel.dates)[0];
    const dateToInput = $$(popupSelectors.filterPanel.dates)[1];
    dateFromInput.click();
    for (let i = 0; i < 10; i++) {
      browser.keys(['Backspace']);
    }
    browser.keys(dateFrom);

    dateToInput.click();
    for (let i = 0; i < 10; i++) {
      browser.keys(['Backspace']);
    }
    browser.keys(dateTo);
  }

  /**
   * Clicks the 'Clear all' button in the filter panel
   */
  clearAll() {
    logStep(`Clicking the 'Clear all' button in the filter panel...    [${fileName} - clearAll()]`);
    const clearAllButton = $(popupSelectors.filterPanel.clearAll);
    waitAndClick(clearAllButton);
  }

  /**
   * Returns the timestamp for the Date modified of the first object in the table
   * @return {Number}
   */
  getFirstRowTimestamp() {
    const date = $(popupSelectors.columnModified).getAttribute('Title').split(' ')[0].split('/');
    const preparedDate = new Date(date[2], date[0], date[1]);
    return Date.parse(preparedDate);
  }

  /**
   * Returns an array containing 'Date modified' timestamps as strings
   *
   * @returns {Array} array of timestamps as strings
   * @memberof PluginPopup
   */
  getObjectsTimestamps() {
    return $$(popupSelectors.columnModified).map(dateObject => {
      const [dateString, hourString] = dateObject.getAttribute('title').split(' ');
      const date = dateString.split('/');
      const hour = hourString.split(':');
      const preparedDate = new Date(date[2], date[0], date[1], hour[0], hour[1]);
      return Date.parse(preparedDate).toString();
    });
  }

  /**
   * Returns an array objects' values for the given column
   *
   * @param {String} column name of the column selector
   * @returns {Array} array of objects' values
   * @memberof PluginPopup
   */
  getColumnContents(column) {
    return $$(popupSelectors[column]).map(domObject => domObject.getAttribute('title'));
  }

  /**
   * Returns background color hex number for the given element (object on Table of Objects)
   * @param {String} selector a css selector for which we get the background color
   * @return {String}
   */
  getBackgroundColor(selector) {
    const backgroundColour = $(selector).getCSSProperty('background-color');
    return backgroundColour.parsed.hex;
  }

  /**
   * Returns the date for the Date modified of the first object in the table
   * @return {String}
   */
  getFirstRowDate() {
    return $(popupSelectors.columnModified).getAttribute('Title');
  }

  /**
   * Asserts the date modified of the first object is between passed dates
   *
   * @param {Date} dateFrom
   * @param {Date} dateTo
   * @return {Boolean}
   */
  assertFirstObjectDateIsInTheRange(dateFrom, dateTo) {
    dateFrom = Date.parse(dateFrom);
    dateTo = Date.parse(dateTo);

    const rowTimestamp = this.getFirstRowTimestamp();
    return rowTimestamp >= dateFrom && rowTimestamp <= dateTo;
  }

  /**
   * Returns true if checkbox is checked, false if not
   * @param {String} category Category in which checkbox is located, f.e. "Type"
   * @param {String} item Name of an item we want to check, f.e. "MicroStrategy Tutorial"
   * @return {Boolean}
   */
  getCheckboxState(category, item) {
    return $(popupSelectors.filterCheckboxState(category, item)).isSelected();
  }

  /**
   * Returns true if checkbox in All Panel is checked, false if not
   * @param {String} item Name of an item we want to check, f.e. "MicroStrategy Tutorial"
   * @return {Boolean}
   */
  getAllPanelCheckboxState(item) {
    return $(popupSelectors.filterPanel.getAllPanelCheckboxState(item)).isSelected();
  }

  /**
     * Finds the Details Table element with the given index from expanded Detail Tables
   *
   * @param {Number} index index of the Detail Table to find
   * @returns {Element} Details Table element
   */
  getDetailsTableByIndex(index) {
    return $$(popupSelectors.detailsTable)[index];
  }

  /**
    * Checks if the passed details table contains all required elements
    *
    * @param {Element} detailsTable Details Table to extract the tooltip from
    * @param {Boolean} [isMyLibraryOn] myLibrary switch state
    */
  assertDetailsTableDisplayedCorrectly(detailsTable, isMyLibraryOn) {
    const detailsTableText = detailsTable.getText();
    expect(detailsTableText).toContain('Type');
    expect(detailsTableText).toContain('ID');
    expect(detailsTableText).toContain('Description');
    if (!isMyLibraryOn) {
      expect(detailsTableText).toContain('Created');
      expect(detailsTableText).toContain('Location');
    }
  }

  /**
    * Navigates to particular element (ex. button), via tab and presses enter.
    *
    * @param {Number} numberOfSteps is number of steps to navigate to particular element
    */
  navigateUsingTabAndPressEnter(numberOfSteps) {
    for (let i = 0; i < numberOfSteps; i++) {
      pressTab();
      browser.pause(100);
    }
    pressEnter();
  }

  /**
    * Hovers over the ID element in the given details table
    * to show the tooltip and gets the tooltip text
    *
    * @param {Element} detailsTable Details Table to extract the tooltip from
    * @param {Number} timeout the amount of time in ms we wait for DOM to update and show tooltip on hover
    * @returns {String} tooltip text for the ID element
    *
    */
  getDetailsIDTooltipText(detailsTable, timeout = 3000) {
    detailsTable.$(popupSelectors.idDetail).moveTo();
    $(popupSelectors.idDetailTooltip).waitForDisplayed(timeout); // Wait for DOM to update and show tooltip on hover
    return $(popupSelectors.idDetailTooltip).getText();
  }

  /**
    * Hovers over the location element in the given details table
    * to show the tooltip and gets the tooltip text
    *
    * @param {Element} detailsTable Details Table to extract the tooltip from
    * @returns {String} tooltip text for the location element
    *
    */
  getLocationTooltipText(detailsTable) {
    detailsTable.$(popupSelectors.locationDetail).moveTo();
    browser.pause(1000); // Wait for DOM to update and show tooltip on hover
    return detailsTable.$(popupSelectors.locationDetailTooltip).getText();
  }

  /**
    * Gets the text for the location element in the given details table
    *
    * @param {Element} detailsTable Details Table to extract the location from
    * @returns {String} text for the location element
    *
    */
  getLocationText(detailsTable) {
    return detailsTable.$(popupSelectors.locationDetail).getText();
  }

  /**
    * Hovers over the description element in the given details table
    * to show the tooltip and gets the tooltip text
    *
    * @param {Element} detailsTable Details Table to extract the tooltip from
    * @returns {String} tooltip text for the description element
    *
    */
  getDescriptionTooltipText(detailsTable) {
    detailsTable.$(popupSelectors.descriptionDetail).moveTo();
    browser.pause(1000); // Wait for DOM to update and show tooltip on hover
    return $(popupSelectors.descriptionDetailTooltip).getText();
  }

  /**
    * Gets the text for the description element in the given details table.
    *
    * @param {Element} detailsTable Details Table to extract the description from
    * @returns {String} text for the description element
    *
    */
  getDescriptionText(detailsTable) {
    return detailsTable.$(popupSelectors.descriptionDetail).getText();
  }

  /**
    * Presses the tab key until element is focused.
    *
    * If tab limit is reached and the element is still not focused,
    * throws the error that the tab limit is reached.
    *
    * @param {Element} element that will be focused
    * @param {Number} limit for tab count
    *
    * @throws {Error} Tab limit is reached.
    *
    */
  pressTabUntilElementIsFocused(element, limit = 50) {
    logStep(`Pressing the tab key until element is focused...    [${fileName} - pressTabUntilElementIsFocused()]`);
    let count = 0;
    while (!element.isFocused()) {
      if (count === limit) {
        throw new Error('Tab limit is reached. Element still could not be focused');
      } else {
        pressTab();
        count++;
      }
    }
  }

  /**
   * Clears searchbar on prepare data by pressing backspace.
   *
   */
  clearElementSearchWithBackspace() {
    logStep(`Clearing searchbar on prepare data...    [${fileName} - clearElementSearchWithBackspace()]`);
    const searchInputInPrepareData = $(popupSelectors.searchInputPrepareDataPopup);
    waitAndClick(searchInputInPrepareData);
    while (searchInputInPrepareData.getValue() !== '') {
      pressRightArrow();
      pressBackspace();
    }
  }

  /**
   * Imports an object to particular cell, logs a message at the beginning of action and asserts whether the import was successful
   *
   * @param {String} cellValue Cell value to which the object will be imported
   * @param {String} object Name of the object that will be imported
   * @param {String} message Message logged to the console at the beginning of the import
   * @param {boolean} add Boolean value - if true, select "Add data" button, not "Import data"
   */
  importObjectToCellAndAssertSuccess(cellValue, object, message, add = false) {
    logStep(`Importing object ${object} to the cell ${cellValue}...    [${fileName} - importObjectToCellAndAssertSuccess()]`);
    console.log(message);
    OfficeWorksheet.selectCell(cellValue);
    if (add) {
      pluginRightPanel.clickAddDataButton();
    } else {
      pluginRightPanel.clickImportDataButton();
    }
    browser.pause(6000);
    this.switchLibraryAndImportObject(object);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    pluginRightPanel.closeNotificationOnHover();
  }

  /**
    * Edits imported report and click re-prompt button
    */
  editAndOpenReprompt() {
    console.log('Should click edit button');
    pluginRightPanel.editObject(1);
    browser.pause(5000);
    switchToPromptFrame();

    console.log('click reprompt icon');
    $(popupSelectors.dossierWindow.repromptDossier).waitForExist(5000);
    $(popupSelectors.dossierWindow.repromptDossier).click();
    browser.pause(3000);

    console.log('reprompt and import');
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(10000);
    switchToPromptFrameForImportDossier();
  }

  /**
 * Answer Prompts for ptompts type:
 *  Year - value prompt with value of the year, eg answerPrompt('Year', '2016', 1),
 *  Value - prompt with text box to answer eg answerPrompt('Value', '1820', 7)
 *  Object - selecting single object to add/remove form selection, eg answerPrompt('Object', 'Books', 1)
 *  Category - this prompt is having search box and table for selection eg answerPrompt('Category', 'Books', 3)
 *  Attribute elements - when you are selecting elements from attribute (moving form one side to other)
 *
 *  //TODO - rest of the prompts type and ipadete Object and Category to have ability to select more items
 *
  * @param {String} type one of type: Year, VAlue, Object, Category, Attribute elements
  * @param {String} value input for the prompt
  * @param {number} [index=1] number of prompt on list
  * @memberof PluginPopup
 */
  answerPrompt(type, value, index = 1) {
    // eslint-disable-next-line default-case
    switch (type) {
      case 'Year':
        logStep(`Answer prompt ${index} and set ${value}...`);
        this.selectPromptOnPanel(index);
        $(popupSelectors.prompts.getYearPrompt(index)).doubleClick();
        $(popupSelectors.prompts.getYearPrompt(index)).keys(value);
        pressTab();
        break;
      case 'Value':
        logStep(`Answer prompt ${index} and set ${value}...`);
        this.selectPromptOnPanel(index);
        $(popupSelectors.prompts.getValuePrompt(index)).doubleClick();
        $(popupSelectors.prompts.getValuePrompt(index)).keys(value);
        pressTab();
        break;
      case 'Object':
        logStep(`Answer prompt ${index} and select ${value}...`);
        this.selectPromptOnPanel(index);
        $(popupSelectors.prompts.getObjectsPrompt(index)).$(`.mstrListBlockItemName=${value}`).doubleClick();
        pressTab();
        break;
      case 'Category':
        logStep(`Answer prompt ${index} and select ${value}...`);
        this.selectPromptOnPanel(index);
        $(popupSelectors.prompts.getTableCategoryPrompt(index)).$(`.mstrListBlockItemName*=${value}`).click();
        $(popupSelectors.prompts.getTableCategoryPrompt(index)).$(`.mstrListBlockItemName*=${value}`).doubleClick();
        pressTab();
        break;
      case 'Attribute elements':
        logStep(`Answer prompt ${index} and select ${value}...`);
        this.selectPromptOnPanel(index);
        $(popupSelectors.prompts.getAttributeElementListPrompt(index)).$(`.mstrListBlockItemName=${value}`).click();
        $(popupSelectors.prompts.getAttributeElementListPrompt(index)).$(`.mstrListBlockItemName=${value}`).doubleClick();
        pressTab();
    }
  }

  /**
 *
 *
 * @param {number} index of prompt
 * @memberof PluginPopup
 */
  selectPromptOnPanel(index) {
    $(popupSelectors.getpromptPanel(index)).$(`.mstrPromptTOCListItemIndex=${index}`).click();
    browser.pause(1000);
  }

  /**
   * Checks if the given array of strings is sorted ascending
   *
   * @param {Array} data array of strings
   * @param {String} locale locale to be used when comparing strings
   * @returns true if data is sorted ascending, false otherwise
   */
  isSortedAsceding(data, locale = 'en') {
    for (let i = 1; i < data.length; i++) {
      if (data[i].localeCompare(data[i - 1], locale, { sensitivity: 'base' }) < 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if the given array of strings is sorted descending
   *
   * @param {Array} data array of strings
   * @param {String} locale locale to be used when comparing strings
   * @returns true if data is sorted descending, false otherwise
   */
  isSortedDesceding(data, locale = 'en') {
    for (let i = 1; i < data.length; i++) {
      if (data[i].localeCompare(data[i - 1], locale, { sensitivity: 'base' }) > 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Clicks view selected toggle in all panel
   */
  clickViewSelectedInAllPanel() {
    waitAndClick($(popupSelectors.filterPanel.viewSelected));
  }

  /**
   * Counts the number of items in the All Panel that are present in the DOM
   *
   * @returns {Number} number of items
   */
  getAllPanelItemCount() {
    return $$(popupSelectors.filterPanel.allPanelCheckbox).length;
  }
}

export default new PluginPopup();
