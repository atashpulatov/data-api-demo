import { switchToExcelFrame } from '../utils/iframe-helper';
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
      browser.pause(5555);
    } catch (error) {
      this.addAdminManagedPlugin();
      switchToExcelFrame();
      $(excelSelectors.uploadPluginNotification).click();
      // $('img[src^="https://127.0.0.1"]').click(); // this is an alternative selector to start the plugin
      $(pluginIcon).click(); // this is an alternative selector to start the plugin
      browser.pause(5555);
    }
  };

  this.addAdminManagedPlugin = function() {
    $(excelSelectors.insertBtn).click();
    $(excelSelectors.addInBtn).click();
    $(excelSelectors.officeAddInsFrame).waitForExist(9999);
    $(excelSelectors.officeAddInsFrame).waitForExist(9999);
    browser.switchToFrame($(excelSelectors.officeAddInsFrame));
    browser.pause(1111);
    waitAndClick($(excelSelectors.adminManagedBtn));
    waitAndClick($(excelSelectors.adminManagedPlugin));
    waitAndClick($(excelSelectors.addBtn));
    browser.pause(2222);
  };

  this.createNewWorkbook = function() {
    waitAndClick($(excelSelectors.mainMenuBtn));
    waitAndClick($(excelSelectors.newDocumentBtn));
    waitAndClick($(excelSelectors.excelWorkbookBtn));
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[1]); // TODO: create help function to switch tabs
    browser.pause(5000); // TODO: replace with waiting for the excelsheet to be loaded
  };

  this.openNewSheet = function() {
    switchToExcelFrame();
    $(excelSelectors.newSheetBtn).click();
  };

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
};

export default new OfficeWorksheet();
