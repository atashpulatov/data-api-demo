import { switchToPluginFrame, switchToPromptFrame, switchToPopupFrame, switchToExcelFrame } from '../utils/iframe-helper';
import { waitAndClick, waitAndRightClick } from '../utils/click-helper';
import { selectors as s } from '../../constants/selectors/popup-selectors';
import { selectors } from '../../constants/selectors/plugin.right-panel-selectors';

const PluginPopup = function() {
  this.closeRefreshAll = function() {
    waitAndClick($(s.closeRefreshAll));
  }

  this.searchForObject = function(objectName) {
    switchToPluginFrame();
    $(s.searchInput).clearValue();
    $(s.searchInput).setValue(objectName);
  };

  this.clearSearchInput = () => {
    switchToPluginFrame();
    waitAndClick(s.clearSearchInput);
  };

  this.checkIfSearchIsEmpty = () => {
    return s.searchInput.getValue == undefined;
  };

  this.clickImport = function() {
    waitAndClick($(s.importBtn));
  };

  this.clickPrepareData = function() {
    waitAndClick($(s.prepareBtn));
  };

  this.clickCancel = function() {
    waitAndClick($(s.cancelBtn));
  };

  this.clickBack = function() {
    waitAndClick($(s.backBtn));
  };

  this.clickDataPreview = function() {
    waitAndClick($(s.dataPreviewBtn));
  };

  this.clickRefreshObjectTable = function() {
    waitAndClick($(s.refreshObjectTable));
  }

  this.getTableRows = () => {
    const w = $$(s.tableRows);
    return w;
  };

  this.copyObjectsID = () => {
    const rows = this.getTableRows();
    const idsArray = [];
    for (let row of rows) {
      const expandButton = row.$(s.expandButton);
      expandButton.click();
      // browser.pause(2000);
      const idField = row.$(s.idDetail);
      idField.click();
      idsArray.push(idField.getText());
    }; 
    return idsArray;
  };

  this.pasteToSearchBox = () => {
    const searchBox = $(s.searchInput);
    searchBox.setValue(["Shift","Insert"]);
  
  };

  this.compareClipboardToRow = (stringToCompare) => {
    const searchBox = $(s.searchInput);
    return searchBox.getText() === stringToCompare;
  }

  this.expandRows = () => {
    const rows = this.getTableRows();
    for (let row of rows) {
      const expandButton = row.$(s.expandButton);
      expandButton.click();
    }; 
  };

  this.clickFilterButton = async () => {
    await switchToPopupFrame();
    await waitAndClick(s.filterButton);
  };

  this.tickFilterCheckBox = (section, item) => {
    waitAndClick(element(By.css('.category-list-header[aria-label="' + section + '"] + .category-list-table > .category-list-row > .checkbox-cell > label > input[aria-label="Checkbox for ' + item + '."] + span')));
  }

  this.checkIfColumnIsExactly = async (columnToCheck, expectedValue) => {
    const rows = await this.getTableRows();
    for (let row of rows) {
      const columnValue = await row.findElement(By.css(columnToCheck)).then(async (element) => {return element.getAttribute('Title')});
      if(columnValue != expectedValue) return false;
    }; 
    await browser.sleep(1111);
    return true;
  };

  this.checkIfNamesContainString = async (stringToCheck) => {
    const rows = await this.getTableRows();
    for (let row of rows) {
      const columnValue = await row.findElement(By.css(s.columnName)).then(async (element) => {return element.getAttribute('Title')});
      if (columnValue.toLowerCase().indexOf(stringToCheck) == -1) return false;
    }; 
    await browser.sleep(1111);
    return true;
  };



  this.clickViewSelected = function() {
    waitAndClick($(s.viewSelected));
  };

  this.closePreview = function() {
    waitAndClick($(s.closePreviewBtn));
  };

  this.clickRun = function() {
    switchToPopupFrame();
    waitAndClick($(s.runBtn));
  };

  this.clickPromptArrow = function() {
    waitAndClick($(s.promptArrow));
  };

  this.selectAllAttributes = function() {
    waitAndClick($(s.allAttributes));
  };

  this.selectAllMetrics = function() {
    waitAndClick($(s.allMetrics));
  };

  this.selectAllFilters = function() {
    waitAndClick($(s.allFilters));
  };

  this.selectObjectElementsInPrepareData = function(elements) {
    $('#search-toolbar > div > span > input').waitForExist(7777);
    for (let i = 0; i < elements.length; i++) {
      $('#search-toolbar > div > span > input').clearValue();
      $('#search-toolbar > div > span > input').setValue(`${elements[i]}`);
      waitAndClick($(`input[name="${elements[i]}"]`));
      $('#search-toolbar > div > span > input').clearValue();
    }
  };
  this.selectObjectElements = function(elements) {
    for (let i = 0; i < elements.length; i++) {
      waitAndClick($(`input[name="${elements[i]}"]`));
    }
  };

  this.changePromptQualificationItem = (value) => {
    switchToPopupFrame();
    waitAndClick($('div[title="- none -"]'));
    waitAndClick($(`div[title=${value}"]`));
  };

  this.selectFilters = function(names) {
    for (const [filterKey, filterInstances] of names) {
      const filter = $(`.filter-title*=${filterKey}`);
      waitAndClick(filter);
      this.selectObjectElements(filterInstances);
    }
  };
  this.clickHeader = function(headerName) {
    waitAndClick($(`.data-tip*=${headerName}`));
  };

  this.selectFirstObject = function() {
    browser.pause(2222);
    waitAndClick($(s.firstObject));
  };

  this.importObject = function(objectName) {
    switchToPluginFrame();
    browser.pause(1000);
    this.switchLibrary(false);
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectFirstObject();
    this.clickImport();
  };

  this.preparePrompt = function(objectName) {
    switchToPluginFrame();
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectFirstObject();
    this.clickPrepareData();
    browser.pause(9999); // temp solution
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(7777);
  }


  this.importPromptDefault = (objectName) => {
    this.importObject(objectName);
    browser.pause(5555); // temp solution
    $(s.runBtn).waitForExist(3333);
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    this.clickRun();
  };

  this.importPromptDefaultNested = (objectName) => {
    this.importObject(objectName);
    browser.pause(5555); // temp solution
    for (; $(s.runBtn).isExisting();) {
      switchToPromptFrame();
      $('#mstrdossierPromptEditor').waitForExist(7777);
      this.clickRun();
      browser.pause(3333);
    }
    switchToPluginFrame();
  }

  this.isViewSelected = () => ($(s.viewSelected).getAttribute('class') === 'ant-switch ant-switch-checked')

  this.openPrompt = (objectName) => {
    this.importObject(objectName);
    browser.pause(9999); // temp solution
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(7777);
  };


  this.writeValueText = (value) => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(7777);
    waitAndClick($(s.valueInput), 5555);
    $(s.valueInput).clearValue();
    $(s.valueInput).setValue(`${value}\uE004\uE006`);
  };

  this.writeAttrQualificationValue = (value) => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(s.attrQualificationInput).click();
    $(s.attrQualificationInput).clearValue();
    $(s.attrQualificationInput).setValue(`${value}\uE004\uE004\uE006`);
  };

  this.writeMultiPrompt = (value) => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(s.calendarInput).click();
    $(s.calendarInput).clearValue();
    $(s.calendarInput).setValue(`${value}\uE004\uE004\uE006`);
  };

  this.removeAllSelected = () => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(s.promptRemoveAllSelected).click();
  };

  this.changeExpressionQualificationAndRun = (value) => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(s.expressionInList).click();
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

  this.prepareObject = function(objectName, elements, filters) {
    switchToPluginFrame();
    this.searchForObject(objectName);
    browser.pause(1111);
    this.selectFirstObject();
    this.clickPrepareData();
    this.selectObjectElements(elements);
    this.selectFilters(filters);
    browser.pause(1111);
    this.clickImport();
  };

  // TODO: Refactor to webDriverIO. This method is only used in TC39453
  this.checkSorting = async function(order, headerName) {
    const columnHeaders = element.all(by.css(s.columnHeaders));
    const columnTitles = columnHeaders.all(by.css());
    for (let i = 0; i < columnTitles.length; i++) {
      if (columnTitles.get(i) === headerName) {
        switch (order) {
        case 'up':
          await expect(columnHeaders.get(i).element(by.css(s.sortedUp)).isPresent()).toBe(true);
          break;
        case 'down':
          await expect(columnHeaders.get(i).element(by.css(s.sortedDown)).isPresent()).toBe(true);
          break;
        default:
          break;
        }
      }
    }
  };

  // TODO: Refactor to webDriverIO. This method is only used in TC39454
  this.checkDisplayedObjectNames = async function(searchedString) {
    for (let i = 0; i < s.displayedObjects.length; i++) {
      await expect(s.displayedObjects.get(i).getText().toContain(searchedString));
    }
  };
  // Currently this method is not used
  this.checkIfFilterIsClicked = function(filterName) {
    expect($(`.filter-title*=${filterName}`).getCSSProperty('background-color').value).toEqual('#1890FF');
  };
  this.deleteFromSearch = function() {
    const searchedValue = $(s.searchInput).getAttribute('value');
    for (let i = 0; i < searchedValue.length; i++) {
      $(s.searchInput).setValue('\uE003');
    }
  };

  this.importObjectAndGetTotalTime = function(objectName) {
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

  this.getMyLibraryState = () => {
    const myLibrarySwitch = $(s.myLibrary);
    myLibrarySwitch.waitForExist(5000);
    return myLibrarySwitch.getAttribute('aria-checked') === 'true';
  };

  this.switchLibrary = function(newState) {
    switchToPluginFrame();
    const checked = this.getMyLibraryState();
    if ((checked === true) !== newState) waitAndClick($(s.myLibrary))
  };

  this.openDossier = function(dossierName, timeToLoadDossier = 10000) {
    this.importObject(dossierName);
    browser.pause(timeToLoadDossier);
  }

  this.clickFilterButton = () => {
    switchToPluginFrame();
    const filterButton = $(s.filterButton);
    filterButton.click();
  };

  this.tickFilterCheckBox = (section, item) => {
    waitAndClick($('.category-list-header[aria-label="' + section + '"] + .category-list-table > .category-list-row > .checkbox-cell > label > input[aria-label="Checkbox for ' + item + '."] + span'));
  };

  this.clickAllButton = (section) => {
    switch (section) {
    case 'Application':
      waitAndClick($$(s.filterPanel.expandButton)[0]);
      break;
    case 'Owner':
      if (this.getMyLibraryState()) {
        waitAndClick($$(s.filterPanel.expandButton)[0]);
      } else {
        waitAndClick($$(s.filterPanel.expandButton)[1]);
      }
      break;
    case 'Modified':
      waitAndClick($('.mstr-date-range-selector-container .expand-btn'));
      break;
    default:
      break;
    }
  };

  this.clickSelectAll = () => {
    waitAndClick($(s.filterPanel.selectAllButton));
  };

  this.uncheckDisabledElement = (checkboxTitle) => {
    waitAndClick($(`.all-panel__content .category-list-row.disabled label[title="${checkboxTitle}"]`));
  };

  this.selectAndImportVizualiation = function(visContainerId) {
    switchToPromptFrame();
    const visSelctor = $(visContainerId).$('.mstrmojo-VizBox-selector');
    visSelctor.click();

    // TODO: wait untli import button is enabled and click it
    browser.pause(2500);
    switchToPluginFrame();
    this.clickImport();
  }

  this.showTotals = (objectId) => {
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(s.showTotalsButton));
    browser.pause(1000);
    waitAndClick($(s.totalButton));
    waitAndClick($(s.okButton));
    browser.pause(4000);
  }

  this.sortAscending = (objectId) => {
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(s.sortAscendingButton));
    browser.pause(4000);
  }

  this.sortDescending = (objectId) => {
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(s.sortDescendingButton));
    browser.pause(4000);
  }

  this.drillByCategory = (objectId) => {
    switchToPromptFrame();
    waitAndRightClick($(`${objectId}`));
    browser.pause(1000);
    waitAndClick($(s.drillButton));
    browser.pause(1000);
    waitAndClick($(s.categoryButton));
    browser.pause(4000);
  }

  
};

export default new PluginPopup();
