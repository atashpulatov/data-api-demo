import {switchToExcelFrame} from '../utils/iframe-helper';
import {waitAndClick} from '../utils/click-helper';
// import {protractor} from 'protractor';
import {waitById} from '../utils/wait-helper';
import {excelSelectors as exSe} from '../../constants/selectors/office-selectors';
// const EC = protractor.ExpectedConditions;

const OfficeWorksheet = function() {
  const pluginStartId = '#m_excelWebRenderer_ewaCtl_3D10BAF8-D37F-DCF9-711E-7D53E9DC4090MSTR.Group1'; // aws169915

  this.openWorksheet = async function() {
    await browser.get(worksheetUrl);
  };

  this.openExcelHome = function() {
    // await browser.get('https://www.office.com/launch/excel?auth=2');
    browser.url('https://www.office.com/launch/excel?auth=2');

  };

  // This method is not used at all. It is used to upload a manifest stored in the file system
  // this.uploadPlugin = function() {
  //   switchToExcelFrame();
  //   $(exSe.insertBtn).click();
  //   $(exSe.addInBtn).click();
  //   browser.pause(1000);
  //   $(exSe.addInBtn).click();
  //   $(exSe.officeAddInsFrame).waitForExist(9999);
  //   browser.pause(7777);
  //   browser.switchToFrame($(exSe.officeAddInsFrame));
  //   browser.pause(1111);
  //   waitAndClick($(exSe.uploadAddInBtn));
  //   $(exSe.manifestInput).waitForExist(7777);
  //   browser.pause(7777);
  //   exSe.manifestInput.sendKeys(pathToManifest); 
  //   waitAndClick($(exSe.confirmUpload));
  // };

  this.openPlugin = function() {
    switchToExcelFrame();
    try {
      $('img[src^="https://env-169915."]').waitForDisplayed(7777);
      $('img[src^="https://env-169915."]').click();
      browser.pause(5555);
    } catch (error) {
      this.addAdminManagedPlugin();
      switchToExcelFrame();
      $(exSe.uploadPluginNotification).click();
      $('img[src^="https://env-169915."]').click(); // this is an alternative selector to start the plugin
      browser.pause(5555);
    }
  };


  this.addAdminManagedPlugin = function() {
    // switchToExcelFrame();
    $(exSe.insertBtn).click();
    $(exSe.addInBtn).click();
    $(exSe.officeAddInsFrame).waitForExist(9999);
    browser.pause(7777);
    browser.switchToFrame($(exSe.officeAddInsFrame));
    browser.pause(1111);
    waitAndClick($(exSe.adminManagedBtn));
    browser.pause(6666);
    $(exSe.adminManagedPlugin).click();
    waitAndClick($(exSe.addBtn));
    browser.pause(2222);
  };

  this.createNewWorkbook = function() {
    waitAndClick($(exSe.mainMenuBtn));
    waitAndClick($(exSe.newDocumentBtn));
    waitAndClick($(exSe.excelWorkbookBtn));
    const handles =  browser.getWindowHandles();
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
    browser.keys('\uE003'); //Press Backspace
    $(exSe.cellInput).setValue(cellId); 
    browser.keys('\uE007'); //Press Enter
  };
};

export default new OfficeWorksheet();
