/* eslint-disable class-methods-use-this */
import { waitAndClick, waitAndRightClick } from '../utils/click-helper';
import { popupSelectors } from '../../constants/selectors/popup-selectors';
import {
  switchToPluginFrame,
  switchToPromptFrame,
  switchToPopupFrame,
  switchToExcelFrame,
  switchToPromptFrameForEditDossier,
  switchToPromptFrameForEditReport
} from '../utils/iframe-helper';
import pluginRightPanel from './plugin.right-panel';

class PluginPopup {
  closeRefreshAll() {
    waitAndClick($(popupSelectors.closeRefreshAll));
  }

  searchForObject(objectName) {
    $(popupSelectors.searchInput).clearValue();
    $(popupSelectors.searchInput).setValue(objectName);
  }

  /**
   * Searches for attribute or metric inside the popup report preparation
   *
   * @param {String} elementName indicates the attribute or metric name that will be searched
   *
   * @memberof PluginPopup
   */
  searchForElements(elementName) {
    $(popupSelectors.searchInputPrepareDataPopup).clearValue();
    $(popupSelectors.searchInputPrepareDataPopup).setValue(elementName);
  }

  clickImport() {
    waitAndClick($(popupSelectors.importBtn));
  }

  clickPrepareData() {
    waitAndClick($(popupSelectors.prepareBtn));
  }

  clickCancel() {
    waitAndClick($(popupSelectors.cancelBtn));
  }

  clickBack() {
    waitAndClick($(popupSelectors.backBtn));
  }

  clickDataPreview() {
    waitAndClick($(popupSelectors.dataPreviewBtn));
  }

  clickViewSelected() {
    waitAndClick($(popupSelectors.viewSelected));
  }

  clickSubtotalToggler() {
    waitAndClick($(popupSelectors.subtotalToggler));
  }

  closePreview() {
    waitAndClick($(popupSelectors.closePreviewBtn));
  }

  clickRunForPromptedDossier() {
    switchToPromptFrameForEditDossier();
    waitAndClick($(popupSelectors.runBtnForPromptedDossier));
  }

  clickRun() {
    switchToPluginFrame();
    $(popupSelectors.runBtn).waitForExist(3333);
    waitAndClick($(popupSelectors.runBtn));
  }

  clickPromptArrow() {
    waitAndClick($(popupSelectors.promptArrow));
  }

  selectAllAttributes() {
    waitAndClick($(popupSelectors.allAttributes));
  }

  selectAllMetrics() {
    waitAndClick($(popupSelectors.allMetrics));
  }

  selectAllFilters() {
    waitAndClick($(popupSelectors.allFilters));
  }

  selectObjectElementsInPrepareData(elements) {
    $('#search-toolbar > div > span > input').waitForExist(7777);
    for (let i = 0; i < elements.length; i++) {
      $('#search-toolbar > div > span > input').clearValue();
      $('#search-toolbar > div > span > input').setValue(`${elements[i]}`);
      waitAndClick($(`input[name="${elements[i]}"]`));
      $('#search-toolbar > div > span > input').clearValue();
    }
  }

  selectObjectElements(elements) {
    for (let i = 0; i < elements.length; i++) {
      waitAndClick($(`input[name="${elements[i]}"]`));
    }
  }

  changePromptQualificationItem(value) {
    switchToPopupFrame();
    waitAndClick($('div[title="- none -"]'));
    waitAndClick($(`div[title=${value}"]`));
  }

  selectFilters(names) {
    for (const [filterKey, filterInstances] of names) {
      const filter = $(`.filter-title*=${filterKey}`);
      waitAndClick(filter);
      this.selectObjectElements(filterInstances);
    }
  }

  clickHeader(headerName) {
    waitAndClick($(`.data-tip*=${headerName}`));
  }

  selectFirstObject() {
    browser.pause(2222);
    waitAndClick($(popupSelectors.firstObject));
  }

  switchLibraryAndImportObject(objectName, myLibrarySwitch = false) {
    switchToPluginFrame();
    browser.pause(4000);
    this.switchLibrary(myLibrarySwitch);
    browser.pause(1000);
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectFirstObject();
    this.clickImport();
  }

  importObject(objectName) {
    switchToPluginFrame();
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectFirstObject();
    this.clickImport();
  }

  importAnyObject(objectName, index) {
    switchToPluginFrame();
    browser.pause(500);
    this.switchLibrary(false);
    this.searchForObject(objectName);
    browser.pause(500);
    waitAndClick($(popupSelectors.anyObject(index)));
    this.clickImport();
  }

  selectAnyObject(index) {
    browser.pause(2222);
    waitAndClick($(popupSelectors.anyObject(index)));
  }

  preparePrompt(objectName) {
    switchToPluginFrame();
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectFirstObject();
    this.clickPrepareData();
    browser.pause(9999); // temp solution
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(7777);
  }

  selectAttributeIndex(index) {
    for (let i = 0; i < index.length; i++) {
      waitAndClick($(popupSelectors.attributeSelector(index[i])));
    }
  }

  importPromptDefault(objectName) {
    this.importObject(objectName);
    browser.pause(5555); // temp solution
    $(popupSelectors.runBtn).waitForExist(3333);
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    this.clickRun();
  }

  importPromptDefaultNested(objectName) {
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

  isViewSelected() {
    return $(popupSelectors.viewSelected).getAttribute('class') === 'ant-switch ant-switch-checked';
  }

  openPrompt(objectName) {
    this.switchLibraryAndImportObject(objectName, false);
    browser.pause(9999); // temp solution
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(7777);
  }

  writeValueText(value) {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(7777);
    waitAndClick($(popupSelectors.valueInput), 5555);
    $(popupSelectors.valueInput).clearValue();
    $(popupSelectors.valueInput).setValue(`${value}\uE004\uE006`);
  }

  writeAttrQualificationValue(value) {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(popupSelectors.attrQualificationInput).click();
    $(popupSelectors.attrQualificationInput).clearValue();
    $(popupSelectors.attrQualificationInput).setValue(`${value}\uE004\uE004\uE006`);
  }

  writeMultiPrompt(value) {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(popupSelectors.calendarInput).click();
    $(popupSelectors.calendarInput).clearValue();
    $(popupSelectors.calendarInput).setValue(`${value}\uE004\uE004\uE006`);
  }

  removeAllSelected() {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(popupSelectors.promptRemoveAllSelected).click();
  }

  changeExpressionQualificationAndRun(value) {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(popupSelectors.expressionInList).click();
    waitAndClick($(`.mstrListBlockItemName*=${value}`));
    this.clickRun();
  }

  promptSelectObject(objectName) {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(7777);
    waitAndClick($(`.mstrListBlockItem*=${objectName}`));
    browser.pause(2222);
    waitAndClick($('.mstrToolButtonRounded'));
  }

  promptSelectObjectForEdit(objectName) {
    switchToPromptFrameForEditReport();
    browser.pause(10000);
    $('#mstrdossierPromptEditor').waitForExist(7777);
    waitAndClick($(`.mstrListBlockItem*=${objectName}`));
    browser.pause(2222);
    waitAndClick($('.mstrToolButtonRounded'));
  }

  prepareObject(objectName, elements, filters) {
    this.openPrepareData(objectName);
    this.selectObjectElements(elements);
    this.selectFilters(filters);
    browser.pause(1111);
    this.clickImport();
  }

  searchForPreparedObject(objectName) {
    $(popupSelectors.prepareSearchInput).clearValue();
    $(popupSelectors.prepareSearchInput).setValue(objectName);
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
  async checkDisplayedObjectNames(searchedString) {
    for (let i = 0; i < popupSelectors.displayedObjects.length; i++) {
      await expect(popupSelectors.displayedObjects.get(i).getText().toContain(searchedString));
    }
  }

  // Currently this method is not used
  checkIfFilterIsClicked(filterName) {
    expect($(`.filter-title*=${filterName}`).getCSSProperty('background-color').value).toEqual('#1890FF');
  }

  deleteFromSearch() {
    const searchedValue = $(popupSelectors.searchInput).getAttribute('value');
    for (let i = 0; i < searchedValue.length; i++) {
      $(popupSelectors.searchInput).setValue('\uE003');
    }
  }

  importObjectAndGetTotalTime(objectName) {
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

  switchLibrary(newState) {
    const myLibrarySwitch = $(popupSelectors.myLibrary);
    myLibrarySwitch.waitForExist(5000);
    const checked = myLibrarySwitch.getAttribute('aria-checked');
    if ((checked === 'true') !== newState) waitAndClick(myLibrarySwitch);
  }

  openDossier(dossierName, timeToLoadDossier = 10000, myLibrarySwitch = false) {
    this.switchLibraryAndImportObject(dossierName, myLibrarySwitch);
    browser.pause(timeToLoadDossier);
  }

  selectAndImportVizualiation(visContainerId) {
    switchToPromptFrame();
    browser.pause(10000);
    const visSelector = $(visContainerId).$(popupSelectors.visualizationSelector);
    visSelector.waitForExist(15000);
    browser.pause(3000);
    visSelector.click();
    // TODO: wait untli import button is enabled and click it
    browser.pause(2500);
    switchToPluginFrame();
    $(popupSelectors.importBtn).waitForExist(5000);
    this.clickImport();
  }

  editAndImportVizualization(visContainerId) {
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
  }

  showTotals(objectId) {
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
    waitAndClick($(popupSelectors.attributeFormDropdown));
    browser.pause(500);
    waitAndClick($(`${popupSelectors.attributeFormDropDownItem}=${type}`));
    browser.pause(500);
  }

  sortDescending(objectId) {
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(popupSelectors.sortDescendingButton));
    browser.pause(4000);
  }

  drillByCategory(objectId) {
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
   * @memberof PluginPopup
   */
  selectValuesFromDossierListFilter(filterIndex, valuesIndexes) {
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
   * @memberof PluginPopup
   */
  setValueOnDossierSliderFilter(filterIndex, position, value) {
    const { dossierWindow } = popupSelectors;
    const maxValueInput = $(`${dossierWindow.filtersMenu.getFilterAt(filterIndex)} ${dossierWindow.filtersMenu.getSliderInput(position)} > input`);
    maxValueInput.doubleClick();
    browser.keys('\uE003'); // Press Backspace
    maxValueInput.setValue(value);
  }

  /**
   * Refresh Dossier to default state
   *
   * @memberof PluginPopup
   */
  refreshDossier() {
    const { dossierWindow } = popupSelectors;
    waitAndClick($(dossierWindow.buttonRefreshDossier), 1000);
    waitAndClick($(dossierWindow.buttonConfirmRefresh), 1000);
  }

  /**
   * Refresh Dossier to default state
   *
   * @param {Number} index Index of the bookmark in dossier (starts from 1)
   * @memberof PluginPopup
   */
  applyDossierBookmark(index) {
    const { dossierWindow } = popupSelectors;
    waitAndClick($(dossierWindow.buttonBookmarks), 1000);
    waitAndClick($(dossierWindow.getBookmarkItemAt(index)), 1000);
  }

  /**
   * Go to page/chapter in dossier
   *
   * @param {Number} index Index of the page/chapter item in dossier (starts from 1)
   * @memberof PluginPopup
   */
  goToDossierPageOrChapter(index) {
    const { dossierWindow } = popupSelectors;
    waitAndClick($(dossierWindow.buttonToC), 1000);
    waitAndClick($(dossierWindow.getTocItemAt(index)), 1000);
  }

  openPrepareData(objectName, isObjectFromLibrary = false) {
    switchToPluginFrame();
    this.switchLibrary(isObjectFromLibrary);
    this.searchForObject(objectName);
    browser.pause(1111);
    this.selectFirstObject();
    this.clickPrepareData();
  }

  importDefaultPromptedVisualisation(visContainerId) {
    // reprompt
    switchToPromptFrameForEditDossier();
    $('#mstrdossierPromptEditor').waitForExist(10000);
    this.clickRunForPromptedDossier();
    browser.pause(6000);
    // select vis
    switchToPromptFrameForEditDossier();
    // for dossiers containing one vis: if no visContainerId, select the only existing vis
    let visSelector;
    if (typeof visContainerId === 'undefined') {
      visSelector = $('.mstrmojo-VizBox-selector');
    } else {
      visSelector = $(visContainerId).$('.mstrmojo-VizBox-selector');
    }
    visSelector.waitForExist(6000);
    browser.pause(3000);
    visSelector.click();
    browser.pause(2500);
    switchToPluginFrame();
    $(popupSelectors.importBtn).waitForExist(5000);
    this.clickImport();
  }

  repromptDefaultVisualisation(visContainerId) {
    // edit
    pluginRightPanel.edit();
    browser.pause(5000);
    switchToPromptFrameForEditDossier();
    // click reprompt icon
    $(popupSelectors.dossierWindow.repromptDossier).waitForExist(5000);
    $(popupSelectors.dossierWindow.repromptDossier).click();
    browser.pause(3000);
    // reprompt and import
    this.importDefaultPromptedVisualisation(visContainerId);
  }
}

export default new PluginPopup();
