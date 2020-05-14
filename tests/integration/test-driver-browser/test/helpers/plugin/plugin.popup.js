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
import { pressTab, pressRightArrow, pressBackspace } from '../utils/keyboard-actions';
import { waitForNotification } from '../utils/wait-helper';
import { dictionary } from '../../constants/dictionaries/dictionary';
import OfficeWorksheet from '../office/office.worksheet';
import { rightPanelSelectors } from '../../constants/selectors/plugin.right-panel-selectors';


class PluginPopup {
  searchForObject(objectName) {
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
    $(popupSelectors.searchInputPrepareDataPopup).clearValue();
    $(popupSelectors.searchInputPrepareDataPopup).setValue(elementName);
  }

  clickImport() {
    console.log('Should click Import button');
    waitAndClick($(popupSelectors.importBtn));
  }

  clickPrepareData() {
    console.log('Should click prepare data button');
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
    waitAndClick($(popupSelectors.runBtnForPromptedDossier));
  }

  clickRun() {
    console.log('Should click run button');
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

  /**
   * Waits for element to show up and dissapear
   * useful to validate that action has been started and finished
   *
   * @param {String} selector a css selector to validate
   *
   */
  waitUntilActionIsFinished(selector) {
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
    for (let i = 0; i < attributes.length; i++) {
      waitAndClick($(`.item-title=${attributes[i]}`));
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

  selectFirstObjectWithoutSearch() {
    browser.pause(2222);
    waitAndClick($(popupSelectors.firstObjectWithoutSearch));
  }

  switchLibraryAndImportObject(objectName, myLibrarySwitch = false) {
    switchToDialogFrame();
    browser.pause(4000);
    this.switchLibrary(myLibrarySwitch);
    browser.pause(1000);
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectFirstObject();
    this.clickImport();
  }

  importObject(objectName) {
    switchToDialogFrame();
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectFirstObject();
    this.clickImport();
  }

  importAnyObject(objectName, index = 1) {
    switchToDialogFrame();
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
    browser.pause(500);
    this.switchLibrary(false);
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

  /**
   * This function is used for report with nested prompts.
   * It click on edit for the first object from the list.
   * After that it is clicking run for all nested default prompts.
   *
   * @param {Number} index indicates the report represented in the plugin. Starts with 1 which indicates the last imported object.
   */

  editPromptDefaultNested(index = 1) {
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
    this.switchLibraryAndImportObject(objectName, false);
    browser.pause(9999); // temp solution
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(33333);
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
    $(popupSelectors.calendarInput).waitForExist(7777);
    $(popupSelectors.calendarInput).click();
    $(popupSelectors.calendarInput).clearValue();
    $(popupSelectors.calendarInput).setValue(`${value}\uE004\uE004\uE006`);
    console.log('Prompts are answered');
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
    $('#mstrdossierPromptEditor').waitForExist(22222);
    waitAndClick($(`.mstrListBlockItem*=${objectName}`));
    browser.pause(2222);
    waitAndClick($('.mstrToolButtonRounded'));
  }

  promptSelectObjectForEdit(objectName) {
    switchToPromptFrame();
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

  /**
   * Returns a boolean based on the myLibrary switch state
   * @returns {boolean} true if myLibrary is on, false if myLibrary is off
   */
  getMyLibraryState() {
    const myLibrarySwitch = $(popupSelectors.myLibrary);
    myLibrarySwitch.waitForExist(5000);
    return myLibrarySwitch.getAttribute('aria-checked') === 'true';
  }

  switchLibrary(newState) {
    switchToDialogFrame();
    const myLibrarySwitch = $(popupSelectors.myLibrary);
    myLibrarySwitch.waitForExist(5000);
    const checked = myLibrarySwitch.getAttribute('aria-checked');
    if ((checked === 'true') !== newState) { waitAndClick(myLibrarySwitch); }
  }

  openDossier(dossierName, timeToLoadDossier = 10000, myLibrarySwitch = false) {
    this.switchLibraryAndImportObject(dossierName, myLibrarySwitch);
    browser.pause(timeToLoadDossier);
  }

  /**
   * This function is used to import the desired visualization.
   * It has to be used inside the Dossier window.
   *
   * @param {String} visContainerId Id of the visualization, for ex: '#mstr114'
   *
   */
  selectAndImportVizualiation(visContainerId) {
    switchToPromptFrame();
    let visSelector;
    if (typeof visContainerId === 'undefined') {
      visSelector = $(popupSelectors.visualizationSelector);
    } else {
      visSelector = $(visContainerId).$(popupSelectors.visualizationSelector);
    }
    waitAndClick(visSelector, 40000);
    browser.pause(2500);
    switchToPluginFrame();
    $(popupSelectors.importBtn).waitForEnabled(5000);
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
   */
  setValueOnDossierSliderFilter(filterIndex, position, value) {
    const { dossierWindow } = popupSelectors;
    const maxValueInput = $(`${dossierWindow.filtersMenu.getFilterAt(filterIndex)} ${dossierWindow.filtersMenu.getSliderInput(position)} > input`);
    maxValueInput.doubleClick();
    pressBackspace();
    maxValueInput.setValue(value);
  }

  /**
   * Refresh Dossier to default state
   *
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
   */
  goToDossierPageOrChapter(index) {
    const { dossierWindow } = popupSelectors;
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
    waitAndClick($(popupSelectors.filterButton));
  }

  /**
   * Sets checkbox to checked
   * @param {String} category category in which the checbox is, like 'Application'
   * @param {String} item name of the chosen checkBox, like 'MicroStrategy Tutorial'
   */
  tickFilterCheckBox(category, item) {
    $(popupSelectors.filterCheckbox(category, item)).click();
  }

  /**
   * Pastes clipboard's content to Search box, using 'Shift' + 'Insert' key combination
   */
  pasteToSearchBox() {
    const searchBox = $(popupSelectors.searchInput);
    searchBox.setValue(['Shift', 'Insert']);
  }

  /**
   * Compares value of Search box to a given string
   * @param {String} stringToCompare
   */
  compareSearchBoxToString(stringToCompare) {
    const searchBox = $(popupSelectors.searchInput);
    browser.pause(1111);
    return searchBox.getValue() === stringToCompare;
  }

  openPrepareData(objectName, isObjectFromLibrary = false) {
    switchToDialogFrame();
    this.switchLibrary(isObjectFromLibrary);
    this.searchForObject(objectName);
    browser.pause(1111);
    this.selectFirstObject();
    this.clickPrepareData();
  }

  /**
   * This function is used for prompted Dossiers. It is answering the default prompt answer and it is selecting the desired visualization and importing it
   *
   * @param {Number} index Id of the visualization, for ex: '#mstr114'
   */
  importDefaultPromptedVisualisation(visContainerId) {
    // Clicking 'Run' in the prompt window
    switchToPromptFrameForImportDossier();
    $('#mstrdossierPromptEditor').waitForExist(10000);
    this.clickRunForPromptedDossier();
    console.log('it was clicked');
    browser.pause(6000);
    // Importing the selected visualization
    this.selectAndImportVizualiation(visContainerId);
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
    this.selectAndImportVizualiation(visContainerId);
  }

  /**
   * Scrolls the table by passing key strings ('End', 'Page Down' etc.)
   * @param {String[]} keyNames array of key strings e.g. ['End']
   */
  scrollTable(keyNames) {
    waitAndClick($(popupSelectors.objectTable.scrollContainer));
    browser.keys(keyNames);
    browser.pause(1999); // time to scroll to the bottom of the list
  }

  /**
   * Selects the last visible object from the tableOfObjects
   */
  selectLastObject() {
    const renderedObjects = $$('[role="option"]');
    const lastObject = renderedObjects[renderedObjects.length - 1];
    waitAndClick(lastObject);
  }

  /**
   * Imports the first available visualization from a selected dossier
   */
  importVisualization() {
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
    waitAndClick($(popupSelectors.filterPanel.getAllPanelCheckbox(checkboxTitle)));
  }

  /**
   * Clicks selectAll button for open allPanel
   */
  clickSelectAll() {
    waitAndClick($(popupSelectors.filterPanel.selectAllButton));
  }

  /**
   * Clicks a disabled checkbox on all panel by given checkboxTitle
   * @param {String} checkboxTitle title of the checkbox on the allPanel
   */
  clickDisabledElement(checkboxTitle) {
    waitAndClick($(popupSelectors.filterPanel.getAllPanelDisabledCheckbox(checkboxTitle)));
  }

  /**
   * Scrolls down ObjectTable by the given number of pages
   *
   * @param {Number} count Number of pages to scroll down
   *
   */
  scrollTableDownByPages(count) {
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
    $(selector).click();
    $(selector).keys(value);
  }

  /**
   * Expands given number of rows at the beginning and end of Table of Objects
   *
   * @param {Number} amount Number of rows to expand
   */
  expandFirstAndLastRows(amount) {
    const filterResults = this.getFilterResults();
    amount = filterResults < amount ? filterResults : amount;
    this.expandFirstRows(amount);
    this.scrollTable(['End']);
    this.expandLastRows(amount);
  }

  /**
   * Clicks the Refresh button located at the top bar of Table of Objects
   */
  clickRefreshButton() {
    waitAndClick($(popupSelectors.refreshButton));
  }

  /**
   *  Waits for the Refresh to finish by checking if spinner animation of Refresh button ended
   */
  waitForRefresh() {
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
}

export default new PluginPopup();
