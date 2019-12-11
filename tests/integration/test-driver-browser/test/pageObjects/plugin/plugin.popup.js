import {switchToPluginFrame, switchToPromptFrame, switchToPopupFrame, switchToExcelFrame} from '../utils/iframe-helper';
import {waitAndClick} from '../utils/click-helper';
import {selectors as s} from '../../constants/selectors/popup-selectors';

const PluginPopup = function() {

  this.closeRefreshAll = function() {
    waitAndClick($(s.closeRefreshAll));
  }

  this.searchForObject = function(objectName) {
    $(s.searchInput).clearValue();
    $(s.searchInput).setValue(objectName);
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

  this.selectObjectElements = function(elements) {
    for (let i = 0; i < elements.length; i++) {
      waitAndClick($(`input[name="${elements[i]}"]`));
    }
  };

  this.changePromptQualificationItem = (value) => {
    witchToPopupFrame();
    waitAndClick($('div[title="- none -"]'));
    waitAndClick($('div[title=' + value + '"]'));
  };

  this.selectFilters = function(names) {
    for (const [filterKey, filterInstances] of names) {
      const filter = $(`.filter-title*=${filterKey}`);
      waitAndClick(filter);
      this.selectObjectElements(filterInstances);
    }
  };
  this.clickHeader = function(headerName) {
    // await waitAndClick(element(by.cssContainingText('.data-tip', `${headerName}`)));
    waitAndClick($(`.data-tip*=${headerName}`));

  };

  this.selectFirstObject = function() {
    browser.pause(2222);
    waitAndClick($(s.firstObject));
  };

  this.importObject = function(objectName) {
    switchToPluginFrame();
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

  this.isViewSelected = () => {
    return ($(s.viewSelected).getAttribute('class') === 'ant-switch ant-switch-checked');
  }

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
    $(s.valueInput).setValue(value + '\uE004\uE006');
  };

  this.writeAttrQualificationValue = (value) => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(s.attrQualificationInput).click();
    $(s.attrQualificationInput).clearValue();
    $(s.attrQualificationInput).setValue(value + '\uE004\uE004\uE006');
  };

  this.writeMultiPrompt = (value) => {
    switchToPromptFrame();
    $('#mstrdossierPromptEditor').waitForExist(3333);
    $(s.calendarInput).click();
    $(s.calendarInput).clearValue();
    $(s.calendarInput).setValue(value + '\uE004\uE004\uE006');
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
    };
  };

  this.checkDisplayedObjectNames = async function(searchedString) {
    for (let i = 0; i < s.displayedObjects.length; i++) {
      await expect(s.displayedObjects.get(i).getText().toContain(searchedString));
    }
  };
  // checks if the filter was clicked
  this.checkIfClicked = async function(filterName) {
    expect(element(by.cssContainingText('.filter-title', filterName)).getCssValue('background-color')).toBe('#1890FF');
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
        if (! $('#WACDialogPanel').isExisting()) {
          popupExists = false;
        }
      }
    }
    const end = Date.now();
    const timeSpent = ((end - begin) / 1000);
    console.log(`Total time importing "${objectName}":  ${timeSpent} secs`);
    return timeSpent;
  };
};

export default new PluginPopup();
