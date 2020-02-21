import { switchToExcelFrame } from '../utils/iframe-helper';
import { waitAndClick } from '../utils/click-helper';
import { excelSelectors as exSe } from '../../constants/selectors/office-selectors';
import settings from '../../config';

const OfficeWorksheet = function() {
  const pluginStartId = '#m_excelWebRenderer_ewaCtl_3D10BAF8-D37F-DCF9-711E-7D53E9DC4090MSTR.Group1'; // aws169915
  const pluginIcon = `img[src^="https://${settings.env.hostname}"]`

  this.openExcelHome = function() {
    browser.url(settings.officeOnline.url);
  };

  this.uploadAndOpenPlugin = function(pathToManifest, webServerEnvironmentID) {
    switchToExcelFrame();
    $(exSe.insertBtn).click();
    $(exSe.addInBtn).click();
    $(exSe.officeAddInsFrame).waitForExist(19999);
    browser.switchToFrame($(exSe.officeAddInsFrame));
    browser.pause(1111);
    waitAndClick($(exSe.adminManagedBtn));
    waitAndClick($(exSe.uploadAddInBtn));
    $(exSe.manifestInput).waitForExist(9999);
    $(exSe.manifestInput).setValue(pathToManifest);
    waitAndClick($(exSe.confirmUpload));
    browser.pause(2222);

    switchToExcelFrame();
    $(exSe.uploadPluginNotification).click();
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
      $(exSe.uploadPluginNotification).click();
      // $('img[src^="https://127.0.0.1"]').click(); // this is an alternative selector to start the plugin
      $(pluginIcon).click(); // this is an alternative selector to start the plugin
      browser.pause(5555);
    }
  };

  this.addAdminManagedPlugin = function() {
    $(exSe.insertBtn).click();
    $(exSe.addInBtn).click();
    $(exSe.officeAddInsFrame).waitForExist(9999);
    $(exSe.officeAddInsFrame).waitForExist(9999);
    browser.switchToFrame($(exSe.officeAddInsFrame));
    browser.pause(1111);
    waitAndClick($(exSe.adminManagedBtn));
    waitAndClick($(exSe.adminManagedPlugin));
    waitAndClick($(exSe.addBtn));
    browser.pause(2222);
  };

  this.createNewWorkbook = function() {
    waitAndClick($(exSe.mainMenuBtn));
    waitAndClick($(exSe.newDocumentBtn));
    waitAndClick($(exSe.excelWorkbookBtn));
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[1]); // TODO: create help function to switch tabs
    browser.pause(5000); // TODO: replace with waiting for the excelsheet to be loaded
  };

  this.openNewSheet = function() {
    switchToExcelFrame();
    $(exSe.newSheetBtn).click();
  };

  this.selectCell = function(cellId) {
    switchToExcelFrame();
    $(exSe.cellInput).click();
    browser.keys('\uE003'); // Press Backspace
    $(exSe.cellInput).setValue(cellId);
    browser.keys('\uE007'); // Press Enter
  };

  this.changeTextInCell = function(cellId, text) {
    switchToExcelFrame();
    this.selectCell(cellId);
    $(exSe.excelFormulaBar).click();
    browser.keys('\uE003'); // Press Backspace
    $(exSe.excelFormulaBar).setValue(text);
    browser.keys('\uE007'); // Press Enter
  };

  this.clearExcelRange = (cellRange) => {
    this.selectCell(cellRange);
    browser.pause(1999);
    browser.keys(['Backspace']);
  };
};

export default new OfficeWorksheet();
