import { switchToExcelFrame, changeBrowserTab } from '../utils/iframe-helper';
import { waitAndClick, waitAndRightClick } from '../utils/click-helper';
import { excelSelectors } from '../../constants/selectors/office-selectors';
import settings from '../../config';
import { pressEnter, pressBackspace, pressEscape } from '../utils/keyboard-actions';
import { logStep } from '../utils/allure-helper';

const OfficeWorksheet = function () {
  const pluginStartId = '#m_excelWebRenderer_ewaCtl_3D10BAF8-D37F-DCF9-711E-7D53E9DC4090MSTR.Group1'; // aws169915
  const pluginIcon = `img[src^="https://${settings.args.env}"]`;
  const fileName = 'office.worksheet.js';

  this.openExcelHome = function () {
    logStep(`Opening Excel...    [${fileName} - openExcelAndLoginToPlugin()]`);
    browser.url(settings.officeOnline.url);
  };

  this.uploadAndOpenPlugin = function (pathToManifest, webServerEnvironmentID) {
    logStep(`Uploading manifest and opening add-in...    [${fileName} - uploadAndOpenPlugin()]`);
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

  this.openPlugin = () => {
    logStep(`Opening MSTR Add-in...    [${fileName} - openPlugin()]`);
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

  this.addAdminManagedPlugin = () => {
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

  this.createNewWorkbook = () => {
    logStep(`Creating a new workbook...    [${fileName} - createNewWorkbook()]`);
    waitAndClick($(excelSelectors.mainMenuBtn));
    waitAndClick($(excelSelectors.newDocumentBtn));
    waitAndClick($(excelSelectors.excelWorkbookBtn));
    changeBrowserTab(1);
  };

  this.openNewSheet = () => {
    logStep(`Opening a new sheet in the workbook...    [${fileName} - openNewSheet()]`);
    switchToExcelFrame();
    $(excelSelectors.newSheetBtn).click();
  };

  this.getNumberOfWorksheets = () => {
    logStep(`Getting number of worksheets...    [${fileName} - getNumberOfWorksheets()]`);
    switchToExcelFrame();
    return $$(excelSelectors.worksheetsTabs).length;
  };

  this.openSheet = (index) => {
    logStep(`Opening the sheet number ${index}...    [${fileName} - openSheet()]`);
    switchToExcelFrame();
    waitAndClick($(excelSelectors.selectsheet(index)));
  };

  this.deleteSheet = (index) => {
    logStep(`Deleting the sheet number ${index}...    [${fileName} - openSheet()]`);
    switchToExcelFrame();
    waitAndRightClick($(excelSelectors.selectsheet(index)));
    waitAndClick($(excelSelectors.deleteSheet));
    waitAndClick($(excelSelectors.acceptDeletingSheet));
  };

  this.selectCellAlternatively = (cellId) => {
    logStep(`Selecting the cell "${cellId}"...    [${fileName} - selectCellAlternatively()]`);
    switchToExcelFrame();
    waitAndClick($(excelSelectors.findAndSelectBtn));
    waitAndClick($(excelSelectors.goToBtn));
    browser.pause(2000);
    waitAndClick($(excelSelectors.goToSelector));
    browser.pause(2000);
    $(excelSelectors.goToSelector).clearValue();
    $(excelSelectors.goToSelector).setValue(cellId);
    pressEnter();
  };

  this.replaceAllThatMatches = (textToReplace, value) => {
    logStep(`Replacing all the texts "${textToReplace}" with the text"${value}"...    [${fileName} - selectCellAlternatively()]`);
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
    pressEscape();
  };

  this.selectCell = (cellId) => {
    logStep(`Selecting the cell "${cellId}"...    [${fileName} - selectCell()]`);
    switchToExcelFrame();
    $(excelSelectors.cellInput).click();
    pressBackspace();
    $(excelSelectors.cellInput).setValue(cellId);
    pressEnter();
  };

  this.changeTextInCell = (cellId, text) => {
    logStep(`Changing text in the cell "${cellId}"...    [${fileName} - changeTextInCell()]`);
    switchToExcelFrame();
    this.selectCell(cellId);
    $(excelSelectors.excelFormulaBar).click();
    pressBackspace();
    $(excelSelectors.excelFormulaBar).setValue(text);
    pressEnter();
  };

  this.clearExcelRange = (cellRange) => {
    logStep(`Clearing the excel range of cells "${cellRange}"...    [${fileName} - clearExcelRange()]`);
    this.selectCell(cellRange);
    browser.pause(1999);
    browser.keys(['Backspace']);
  };

  /**
   * Applies the first available table formatting to the selected table
   * Table should be selected prior to calling this function
   *
   */
  this.formatTable = () => {
    switchToExcelFrame();
    $(excelSelectors.formatAsTable).click();
    $(excelSelectors.lightGrayTableFormat).click();
  };
};

export default new OfficeWorksheet();
