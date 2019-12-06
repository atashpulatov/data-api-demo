import {switchToPluginFrame, switchToPromptFrame, switchToPopupFrame, switchToExcelFrame} from '../utils/iframe-helper';
import {waitAndClick} from '../utils/click-helper';
import {waitById} from '../utils/wait-helper';
import {selectors as s} from '../../constants/selectors/popup-selectors';

const PluginPopup = function() {

  this.closeRefreshAll = async function() {
    await waitAndClick(s.closeRefreshAll());
  }

  this.searchForObject = function(objectName) {
    $(s.searchInput).clearValue();
    $(s.searchInput).setValue(objectName);
  };

  this.clickImport = function() {
    waitAndClick($(s.importBtn));
  };

  this.clickPrepareData = async function() {
    await waitAndClick(s.prepareBtn);
  };

  this.clickCancel = async function() {
    await waitAndClick(s.cancelBtn);
  };

  this.clickBack = async function() {
    await waitAndClick(s.backBtn);
  };

  this.clickDataPreview = async function() {
    await waitAndClick(s.dataPreviewBtn);
  };

  this.clickViewSelected = async function() {
    await waitAndClick(s.viewSelected);
  };

  this.closePreview = async function() {
    await waitAndClick(s.closePreviewBtn);
  };

  this.clickRun = async () => {
    await switchToPopupFrame();
    await waitAndClick(s.runBtn);
  };

  this.clickPromptArrow = async function() {
    await s.promptArrow.click();
  };

  this.selectAllAttributes = async function() {
    await waitAndClick(s.allAttributes);
  };

  this.selectAllMetrics = async function() {
    await waitAndClick(s.allMetrics);
  };

  this.selectAllFilters = async function() {
    await waitAndClick(s.allFilters);
  };

  this.selectObjectElements = async function(elements) {
    for (let i = 0; i < elements.length; i++) {
      await waitAndClick($(`input[name="${elements[i]}"]`));
    }
  };

  this.changePromptQualificationItem = async (value) => {
    await switchToPopupFrame();
    await waitAndClick($('div[title="- none -"]'));
    await waitAndClick($('div[title=' + value + '"]'));
  };

  this.selectFilters = async function(names) {
    for (const [filterKey, filterInstances] of names) {
      const filter = element(by.cssContainingText('.filter-title', filterKey));
      await waitAndClick(filter);
      await this.selectObjectElements(filterInstances);
    }
  };
  this.clickHeader = async function(headerName) {
    await waitAndClick(element(by.cssContainingText('.data-tip', `${headerName}`)));
  };

  this.selectFirstObject = function() {
    waitAndClick($(s.firstObject));
  };

  this.importObject = function(objectName) {
    switchToPluginFrame();
    this.searchForObject(objectName);
    browser.pause(500);
    this.selectFirstObject();
    this.clickImport();
  };

  this.preparePrompt = async function(objectName) {
    await switchToPluginFrame();
    await this.searchForObject(objectName);
    await browser.sleep(500);
    await this.selectFirstObject();
    await this.clickPrepareData();
    await browser.sleep(9999); // temp solution
    await switchToPromptFrame();
    await waitById('mstrdossierPromptEditor', 7777);
  }


  this.importPromptDefault = async (objectName) => {
    await this.importObject(objectName);
    await browser.sleep(5555); // temp solution
    await s.runBtn.isPresent()
    await switchToPromptFrame();
    await waitById('mstrdossierPromptEditor', 3333);
    await this.clickRun();
  };

  this.importPromptDefaultNested = async (objectName) => {
    await this.importObject(objectName);
    await browser.sleep(5555); // temp solution
    for (; await s.runBtn.isPresent();) {
      await switchToPromptFrame();
      await waitById('mstrdossierPromptEditor', 7777);
      await this.clickRun();
      await browser.sleep(3333);
    }
    await switchToPluginFrame();
  }

  this.isViewSelected = async () => {
    return (await s.viewSelected.getAttribute('class') === 'ant-switch ant-switch-checked');
  }

  this.openPrompt = (objectName) => {
    this.importObject(objectName);
    browser.pause(9999); // temp solution
    switchToPromptFrame();
    await waitById('mstrdossierPromptEditor', 7777);
  };


  this.writeValueText = async (value) => {
    await switchToPromptFrame();
    await waitById('mstrdossierPromptEditor', 3333);
    await s.valueInput.click();
    await s.valueInput.clear();
    await s.valueInput.sendKeys(value + '\uE004\uE006');
  };

  this.writeAttrQualificationValue = async (value) => {
    await switchToPromptFrame();
    await waitById('mstrdossierPromptEditor', 3333);
    await s.attrQualificationInput.click();
    await s.attrQualificationInput.clear();
    await s.attrQualificationInput.sendKeys(value + '\uE004\uE004\uE006');
  };

  this.writeMultiPrompt = async (value) => {
    await switchToPromptFrame();
    await waitById('mstrdossierPromptEditor', 3333);
    await s.calendarInput.click();
    await s.calendarInput.clear();
    await s.calendarInput.sendKeys(value + '\uE004\uE004\uE006');
  };

  this.removeAllSelected = async () => {
    await switchToPromptFrame();
    await waitById('mstrdossierPromptEditor', 3333);
    await element(by.css(s.promptRemoveAllSelected)).click();
  };

  this.changeExpressionQualificationAndRun = async (value) => {
    await switchToPromptFrame();
    await waitById('mstrdossierPromptEditor', 3333);
    await s.expressionInList.click();
    await element(by.cssContainingText('div[class^=mstrListBlockItem]', value)).click();
    await this.clickRun();
  };

  this.promptSelectObject = async (objectName) => {
    await switchToPromptFrame();
    await waitById('mstrdossierPromptEditor', 3333);
    await element(by.cssContainingText('div[class^=mstrListBlockItem]', objectName)).click();
    await browser.sleep(2222);
    await element(by.css('.mstrToolButtonRounded')).click();
  };

  this.prepareObject = async function(objectName, elements, filters) {
    await switchToPluginFrame();
    await this.searchForObject(objectName);
    await browser.sleep(1111);
    await this.selectFirstObject();
    await this.clickPrepareData();
    await this.selectObjectElements(elements);
    await this.selectFilters(filters);
    await browser.sleep(1111);
    await this.clickImport();
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
  this.deleteFromSearch = async function() {
    const searchedValue = await s.searchInput.getAttribute('value');
    for (let i = 0; i < searchedValue.length; i++) {
      await s.searchInput.sendKeys(protractor.Key.BACK_SPACE);
    }
  };
  // this.importObjectAndGetTotalTime = async function(objectName) {
  //   await this.importObject(objectName);
  //   const begin = Date.now();
  //   await browser.sleep(2000);
  //   let popupExists = true;
  //   while (popupExists) {
  //     await switchToExcelFrame();
  //     const popupDiv = await element(by.id('WACDialogPanel')).isPresent();
  //     if (!popupDiv) {
  //       if (!await element(by.id('WACDialogPanel')).isPresent()) {
  //         popupExists = false;
  //       }
  //     }
  //   }
  //   const end = Date.now();
  //   const timeSpent = (((end - begin) / 1000) - 1); // 1 second is substracted because it is more less the difference time with the value displayed in the console
  //   console.log(`Total time importing "${objectName}":  ${timeSpent} secs`);
  //   return timeSpent;
  // };
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
    const timeSpent = (((end - begin) / 1000) - 1); // 1 second is substracted because it is more less the difference time with the value displayed in the console
    console.log(`Total time importing "${objectName}":  ${timeSpent} secs`);
    return timeSpent;
  };
};

export default new PluginPopup();
