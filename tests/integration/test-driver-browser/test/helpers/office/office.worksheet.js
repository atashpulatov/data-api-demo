import { switchToExcelFrame, changeBrowserTab } from '../utils/iframe-helper';
import { waitAndClick } from '../utils/click-helper';
import { excelSelectors } from '../../constants/selectors/office-selectors';
import settings from '../../config';

const OfficeWorksheet = function() {
  const pluginStartId = '#m_excelWebRenderer_ewaCtl_3D10BAF8-D37F-DCF9-711E-7D53E9DC4090MSTR.Group1'; // aws169915
  const pluginIcon = `img[src^="https://${settings.env.hostname}"]`

  this.openExcelHome = function() {
    browser.url(settings.officeOnline.url);
  };

  this.uploadAndOpenPlugin = function(pathToManifest, webServerEnvironmentID) {
    switchToExcelFrame();
    $(excelSelectors.insertBtn).click();
    $(excelSelectors.addInBtn).click();
    $(excelSelectors.officeAddInsFrame).waitForExist(19999);
    browser.switchToFrame($(excelSelectors.officeAddInsFrame));
    browser.pause(1111);
    waitAndClick($(excelSelectors.adminManagedBtn));
    waitAndClick($(excelSelectors.uploadAddInBtn));
    $(excelSelectors.manifestInput).waitForExist(9999);
    $(excelSelectors.manifestInput).setValue(pathToManifest);
    waitAndClick($(excelSelectors.confirmUpload));
    browser.pause(2222);

    switchToExcelFrame();
    $(excelSelectors.uploadPluginNotification).click();
    $(`img[src^="https://${webServerEnvironmentID}"]`).click();
    browser.pause(5555);
  };

  this.openPlugin = function() {
    switchToExcelFrame();
    try {
      // $('img[src^="https://127.0.0.1"]').waitForDisplayed(7777);
      // $('img[src^="https://127.0.0.1"]').click();173736
      $(pluginIcon).waitForDisplayed(7777);
      $(pluginIcon).click();
      $(excelSelectors.addInFrame).waitForDisplayed(7000);
    } catch (error) {
      this.addAdminManagedPlugin();
      switchToExcelFrame();
      $(excelSelectors.uploadPluginNotification).click();
      // $('img[src^="https://127.0.0.1"]').click(); // this is an alternative selector to start the plugin
      $(pluginIcon).click(); // this is an alternative selector to start the plugin
      $(excelSelectors.addInFrame).waitForDisplayed(7000);
    }
  };

  this.addAdminManagedPlugin = function() {
    $(excelSelectors.insertBtn).click();
    $(excelSelectors.addInBtn).click();
    $(excelSelectors.officeAddInsFrame).waitForExist(9999);
    browser.switchToFrame($(excelSelectors.officeAddInsFrame));
    browser.pause(1111);
    waitAndClick($(excelSelectors.adminManagedBtn));
    let envNumber = process.argv[process.argv.length - 1];
    if (!envNumber.includes('env-')) {
      envNumber = 'yi_local_ip';
    }
    waitAndClick($(excelSelectors.ribbonPlugin(envNumber)));
    waitAndClick($(excelSelectors.addBtn));
    browser.pause(2222);
  };

  this.createNewWorkbook = function() {
    waitAndClick($(excelSelectors.mainMenuBtn));
    waitAndClick($(excelSelectors.newDocumentBtn));
    waitAndClick($(excelSelectors.excelWorkbookBtn));
    changeBrowserTab(1);
  };

  this.openNewSheet = function() {
    switchToExcelFrame();
    $(excelSelectors.newSheetBtn).click();
  };

  this.selectCellAlternatively = function(cellId) {
    switchToExcelFrame();
    waitAndClick($(excelSelectors.findAndSelectBtn));
    waitAndClick($(excelSelectors.goToBtn));
    browser.pause(2000);
    waitAndClick($(excelSelectors.goToSelector));
    browser.pause(2000);
    $(excelSelectors.goToSelector).clearValue();
    $(excelSelectors.goToSelector).setValue(cellId);
    browser.keys('\uE007'); // Press Enter
  }

  this.replaceAllThatMatches = function(textToReplace, value) {
    switchToExcelFrame();
    waitAndClick($(excelSelectors.findAndSelectBtn));
    waitAndClick($(excelSelectors.replaceSelector));
    browser.pause(2000);
    waitAndClick($(excelSelectors.findWhatSelector));
    browser.pause(1000);
    $(excelSelectors.findWhatSelector).clearValue();
    $(excelSelectors.findWhatSelector).setValue(textToReplace);
    waitAndClick($(excelSelectors.replaceWithSelector));
    browser.pause(2000);
    $(excelSelectors.replaceWithSelector).clearValue();
    $(excelSelectors.replaceWithSelector).setValue(value);
    waitAndClick($(excelSelectors.replaceAllBtn));
    browser.keys('\uE00C'); // Press esc
  }

  this.selectCell = function(cellId) {
    switchToExcelFrame();
    $(excelSelectors.cellInput).click();
    browser.keys('\uE003'); // Press Backspace
    $(excelSelectors.cellInput).setValue(cellId);
    browser.keys('\uE007'); // Press Enter
  };

  this.changeTextInCell = function(cellId, text) {
    switchToExcelFrame();
    this.selectCell(cellId);
    $(excelSelectors.excelFormulaBar).click();
    browser.keys('\uE003'); // Press Backspace
    $(excelSelectors.excelFormulaBar).setValue(text);
    browser.keys('\uE007'); // Press Enter
  };

  this.clearExcelRange = (cellRange) => {
    this.selectCell(cellRange);
    browser.pause(1999);
    browser.keys(['Backspace']);
  };
};

export default new OfficeWorksheet();
