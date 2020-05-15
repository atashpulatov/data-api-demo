import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { dictionary } from '../../../constants/dictionaries/dictionary';

describe('F25931 - Duplicate object', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
  });

  it('[TC64702] - Duplicate same object multiple times', () => {
    console.log('Import seasonalReport');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.reports.seasonalReport);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);
    console.log('Save number of worksheets');
    const initialNumberOfWorksheets = OfficeWorksheet.getNumberOfWorksheets();

    console.log('Open duplicate popup for latest imported object and click import button in it');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    console.log('Check success of duplication');
    PluginRightPanel.waitAndCloseNotification(dictionary.en.duplicateSucces);
    console.log('Check name of duplicated object');
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.seasonalReport} Copy`);

    console.log('Open duplicate popup for latest imported object and click import button in it');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    console.log('Check success of duplication');
    PluginRightPanel.waitAndCloseNotification(dictionary.en.duplicateSucces);
    console.log('Check name of duplicated object');
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.seasonalReport} Copy 2`);

    console.log('Open duplicate popup for latest imported object and click import button in it');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    console.log('Check success of duplication');
    PluginRightPanel.waitAndCloseNotification(dictionary.en.duplicateSucces);
    console.log('Check name of duplicated object');
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.seasonalReport} Copy 3`);

    console.log('Open duplicate popup for latest imported object and click import button in it');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    console.log('Check success of duplication');
    PluginRightPanel.waitAndCloseNotification(dictionary.en.duplicateSucces);
    console.log('Check name of duplicated object');
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.seasonalReport} Copy 4`);

    console.log('Check number of worksheets - should increase by 4');
    expect(OfficeWorksheet.getNumberOfWorksheets()).toBe(initialNumberOfWorksheets + 4);
  });
});
