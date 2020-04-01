import {
  switchToPluginFrame, switchToPromptFrame, switchToPopupFrame, switchToExcelFrame, switchToPromptFrameForEditDossier
} from '../utils/iframe-helper';
import { waitAndClick, waitAndRightClick } from '../utils/click-helper';
import { popupSelectors } from '../../constants/selectors/popup-selectors';
import { waitForNotification } from '../utils/wait-helper';
import pluginRightPanel from './plugin.right-panel';
import { excelSelectors } from '../../constants/selectors/office-selectors';

const PluginPopup = function () {
  this.closeRefreshAll = function () {
    switchToPluginFrame();
    $(excelSelectors.refreshAllfinished).waitForDisplayed(5000, false);
    browser.pause(3000);
    switchToExcelFrame();
    waitAndClick($(popupSelectors.closeRefreshAll));
  };

  this.searchForObject = function (objectName) {
    $(popupSelectors.searchInput).clearValue();
    $(popupSelectors.searchInput).setValue(objectName);
  };

  this.clickImport = function () {
    waitAndClick($(popupSelectors.importBtn), 10000);
  };

  this.clickPrepareData = function () {
    waitAndClick($(popupSelectors.prepareBtn));
  };

  this.clickCancel = function () {
    waitAndClick($(popupSelectors.cancelBtn));
  };

  this.clickBack = function () {
    waitAndClick($(popupSelectors.backBtn));
  };

  this.clickDataPreview = function () {
    waitAndClick($(popupSelectors.dataPreviewBtn));
  };

  this.clickViewSelected = function () {
    waitAndClick($(popupSelectors.viewSelected));
  };

  this.clickSubtotalToggler = function () {
    waitAndClick($(popupSelectors.subtotalToggler));
  };

  this.closePreview = function () {
    waitAndClick($(popupSelectors.closePreviewBtn));
  };

  this.clickRun = function () {
    switchToPopupFrame();
    waitAndClick($(popupSelectors.runBtn));
  };

  this.clickPromptArrow = function () {
    waitAndClick($(popupSelectors.promptArrow));
  };

  this.selectAllAttributes = function () {
    waitAndClick($(popupSelectors.allAttributes));
  };

  this.selectAllMetrics = function () {
    waitAndClick($(popupSelectors.allMetrics));
  };

  this.selectAllFilters = function () {
    waitAndClick($(popupSelectors.allFilters));
  };

  this.selectObjectElementsInPrepareData = function (elements) {
    $('#search-toolbar > div > span > input').waitForExist(7777);
    for (let i = 0; i < elements.length; i++) {
      $('#search-toolbar > div > span > input').clearValue();
      $('#search-toolbar > div > span > input').setValue(`${elements[i]}`);
      waitAndClick($(`input[name="${elements[i]}"]`));
      $('#search-toolbar > div > span > input').clearValue();
    }
  };
  this.selectObjectElements = function (elements) {
    for (let i = 0; i < elements.length; i++) {
      waitAndClick($(`input[name="${elements[i]}"]`));
    }
  };

  this.changePromptQualificationItem = (value) => {
    switchToPopupFrame();
    waitAndClick($('div[title="- none -"]'));
    waitAndClick($(`div[title=${value}"]`));
  };

  this.selectFilters = function (names) {
    for (const [filterKey, filterInstances] of names) {
      const filter = $(`.filter-title*=${filterKey}`);
      waitAndClick(filter);
      this.selectObjectElements(filterInstances);
    }
  };
  this.clickHeader = function (headerName) {
    waitAndClick($(`.data-tip*=${headerName}`));
  };

  this.selectFirstObject = function () {
    browser.pause(2222);
    waitAndClick($(popupSelectors.firstObject));
  };

  this.importObject = function (objectName, myLibrarySwitch) {
    switchToPluginFrame();
    browser.pause(4000);
    this.switchLibrary(myLibrarySwitch);
    browser.pause(1000);
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectFirstObject();
    this.clickImport();
  };

  this.preparePrompt = function (objectName) {
    switchToPluginFrame();
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectFirstObject();
    this.clickPrepareData();
    browser.pause(9999); // temp solution
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(7777);
  };


  this.importPromptDefault = (objectName) => {
    this.importObject(objectName);
    browser.pause(5555); // temp solution
    $(popupSelectors.runBtn).waitForExist(3333);
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    this.clickRun();
  };

  this.importPromptDefaultNested = (objectName) => {
    this.importObject(objectName);
    browser.pause(5555); // temp solution
    for (; $(popupSelectors.runBtn).isExisting();) {
      switchToPromptFrame();
      $('#mstrdossierPromptEditor').waitForExist(7777);
      this.clickRun();
      browser.pause(3333);
    }
    switchToPluginFrame();
  };

  this.isViewSelected = () => ($(popupSelectors.viewSelected).getAttribute('class') === 'ant-switch ant-switch-checked');

  this.openPrompt = (objectName) => {
    this.importObject(objectName);
    browser.pause(9999); // temp solution
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(7777);
  };


  this.writeValueText = (value) => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(7777);
    waitAndClick($(popupSelectors.valueInput), 5555);
    $(popupSelectors.valueInput).clearValue();
    $(popupSelectors.valueInput).setValue(`${value}\uE004\uE006`);
  };

  this.writeAttrQualificationValue = (value) => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(popupSelectors.attrQualificationInput).click();
    $(popupSelectors.attrQualificationInput).clearValue();
    $(popupSelectors.attrQualificationInput).setValue(`${value}\uE004\uE004\uE006`);
  };

  this.writeMultiPrompt = (value) => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(popupSelectors.calendarInput).click();
    $(popupSelectors.calendarInput).clearValue();
    $(popupSelectors.calendarInput).setValue(`${value}\uE004\uE004\uE006`);
  };

  this.removeAllSelected = () => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(popupSelectors.promptRemoveAllSelected).click();
  };

  this.changeExpressionQualificationAndRun = (value) => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(popupSelectors.expressionInList).click();
    waitAndClick($(`.mstrListBlockItemName*=${value}`));
    this.clickRun();
  };

  this.promptSelectObject = (objectName) => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    waitAndClick($(`.mstrListBlockItem*=${objectName}`));
    browser.pause(2222);
    waitAndClick($('.mstrToolButtonRounded'));
  };

  this.prepareObject = function (objectName, elements, filters) {
    this.openPrepareData(objectName);
    this.selectObjectElements(elements);
    this.selectFilters(filters);
    browser.pause(1111);
    this.clickImport();
  };

  // TODO: Refactor to webDriverIO. This method is only used in TC39453
  this.checkSorting = async function (order, headerName) {
    const columnHeaders = element.all(by.css(popupSelectors.columnHeaders));
    const columnTitles = columnHeaders.all(by.css());
    for (let i = 0; i < columnTitles.length; i++) {
      if (columnTitles.get(i) === headerName) {
        switch (order) {
        case 'up':
          await expect(columnHeaders.get(i).element(by.css(popupSelectors.sortedUp)).isPresent()).toBe(true);
          break;
        case 'down':
          await expect(columnHeaders.get(i).element(by.css(popupSelectors.sortedDown)).isPresent()).toBe(true);
          break;
        default:
          break;
        }
      }
    }
  };

  // TODO: Refactor to webDriverIO. This method is only used in TC39454
  this.checkDisplayedObjectNames = async function (searchedString) {
    for (let i = 0; i < popupSelectors.displayedObjects.length; i++) {
      await expect(popupSelectors.displayedObjects.get(i).getText().toContain(searchedString));
    }
  };
  // Currently this method is not used
  this.checkIfFilterIsClicked = function (filterName) {
    expect($(`.filter-title*=${filterName}`).getCSSProperty('background-color').value).toEqual('#1890FF');
  };
  this.deleteFromSearch = function () {
    const searchedValue = $(popupSelectors.searchInput).getAttribute('value');
    for (let i = 0; i < searchedValue.length; i++) {
      $(popupSelectors.searchInput).setValue('\uE003');
    }
  };

  this.importObjectAndGetTotalTime = function (objectName) {
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
    const timeSpent = ((end - begin) / 1000);
    console.log(`Total time importing "${objectName}":  ${timeSpent} secs`);
    return timeSpent;
  };

  this.switchLibrary = function (newState) {
    const myLibrarySwitch = $(popupSelectors.myLibrary);
    myLibrarySwitch.waitForExist(5000);
    const checked = myLibrarySwitch.getAttribute('aria-checked');
    if ((checked === 'true') !== newState) { waitAndClick(myLibrarySwitch); }
  };

  this.openDossier = function (dossierName, timeToLoadDossier = 10000, myLibrarySwitch = false) {
    this.importObject(dossierName, myLibrarySwitch);
    browser.pause(timeToLoadDossier);
  };

  this.selectAndImportVizualiation = function (visContainerId) {
    switchToPromptFrame();
    browser.pause(10000);
    const visSelector = $(visContainerId).$(popupSelectors.visualizationSelector);
    visSelector.waitForExist(15000);
    browser.pause(3000);
    visSelector.click();
    // TODO: wait untli import button is enabled and click it
    browser.pause(2500);
    switchToPluginFrame();
    this.clickImport();
  };

  this.editAndImportVizualization = function (visContainerId) {
    switchToPromptFrameForEditDossier();
    browser.pause(10000);
    const visSelector = $(visContainerId).$(popupSelectors.visualizationSelector);
    visSelector.waitForExist(15000);
    browser.pause(3000);
    visSelector.click();
    // TODO: wait untli import button is enabled and click it
    browser.pause(2500);
    switchToPluginFrame();
    this.clickImport();
  };

  this.showTotals = (objectId) => {
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(popupSelectors.showTotalsButton));
    browser.pause(1000);
    waitAndClick($(popupSelectors.totalButton));
    waitAndClick($(popupSelectors.okButton));
    browser.pause(4000);
  };

  this.sortAscending = (objectId) => {
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(popupSelectors.sortAscendingButton));
    browser.pause(4000);
  };

  // TODO:
  // method is used to select attributes(to check checkboxes) and attribute forms.
  // parameters: JSON object, containing attributes as keys and attribute forms as values
  this.selectAttributesAndAttributeForms = (elements) => {
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
  };

  this.selectAttributeFormVisualisation = (type) => {
    waitAndClick($(popupSelectors.attributeFormDropdown));
    browser.pause(500);
    waitAndClick($(`${popupSelectors.attributeFormDropDownItem}=${type}`));
    browser.pause(500);
  };


  this.sortDescending = (objectId) => {
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(popupSelectors.sortDescendingButton));
    browser.pause(4000);
  };

  this.drillByCategory = (objectId) => {
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(popupSelectors.drillButton));
    browser.pause(1000);
    waitAndClick($(popupSelectors.categoryButton));
    browser.pause(4000);
  };

  /**
   * Toggles attribute elements for filter at dossier filter panel
   *
   * @param {Number} filterIndex Index of the filter on dossier filter panel (starts from 1)
   * @param {Array} valuesIndexes Indexes of elements to toggle (starts from 1)
   */
  this.selectValuesFromDossierListFilter = (filterIndex, valuesIndexes) => {
    const { dossierWindow } = popupSelectors;
    waitAndClick($(dossierWindow.filtersMenu.getFilterAt(filterIndex)), 1000);
    valuesIndexes.forEach(valueIndex => {
      waitAndClick($(dossierWindow.filtersMenu.selectFilterValueAt(valueIndex)), 1000);
    });
    waitAndClick($(dossierWindow.filtersMenu.getFilterAt(filterIndex)), 1000);
  };

  /**
   * Sets value for one of the inputs for slider filter in dossier filters
   *
   * @param {Number} filterIndex Index of the filter on dossier filter panel (starts from 1)
   * @param {String} position 'left' for min value in slider, 'right' for max value in slider
   * @param {String} value value that will be inserted to input
   */
  this.setValueOnDossierSliderFilter = (filterIndex, position, value) => {
    const { dossierWindow } = popupSelectors;
    const maxValueInput = $(`${dossierWindow.filtersMenu.getFilterAt(filterIndex)} ${dossierWindow.filtersMenu.getSliderInput(position)} > input`);
    maxValueInput.doubleClick();
    browser.keys('\uE003'); // Press Backspace
    maxValueInput.setValue(value);
  };

  /**
   * Refresh Dossier to default state
   *
   */
  this.refreshDossier = () => {
    const { dossierWindow } = popupSelectors;
    waitAndClick($(dossierWindow.buttonRefreshDossier), 1000);
    waitAndClick($(dossierWindow.buttonConfirmRefresh), 1000);
  };

  /**
   * Refresh Dossier to default state
   *
   * @param {Number} index Index of the bookmark in dossier (starts from 1)
   */
  this.applyDossierBookmark = (index) => {
    const { dossierWindow } = popupSelectors;
    waitAndClick($(dossierWindow.buttonBookmarks), 1000);
    waitAndClick($(dossierWindow.getBookmarkItemAt(index)), 1000);
  };

  /**
   * Go to page/chapter in dossier
   *
   * @param {Number} index Index of the page/chapter item in dossier (starts from 1)
   */
  this.goToDossierPageOrChapter = (index) => {
    const { dossierWindow } = popupSelectors;
    waitAndClick($(dossierWindow.buttonToC), 1000);
    waitAndClick($(dossierWindow.getTocItemAt(index)), 1000);
  };

  this.openPrepareData = function (objectName, isObjectFromLibrary = false) {
    switchToPluginFrame();
    this.switchLibrary(isObjectFromLibrary);
    this.searchForObject(objectName);
    browser.pause(1111);
    this.selectFirstObject();
    this.clickPrepareData();
  };
};

export default new PluginPopup();
