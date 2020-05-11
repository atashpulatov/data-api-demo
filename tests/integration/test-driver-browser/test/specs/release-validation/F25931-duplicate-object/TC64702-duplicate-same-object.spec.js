import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';

describe('F25931 - Duplicate object', () => {
  // let originalTimeout;
  // beforeEach(() => {
  // originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  // jasmine.DEFAULT_TIMEOUT_INTERVAL = 2 * 60 * 1000;
  //   OfficeLogin.openExcelAndLoginToPlugin();
  // });

  // afterEach(() => {
  //   browser.closeWindow();
  //   changeBrowserTab(0);
  // jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  // });

  it('[TC64702] - Duplicate same object multiple times', () => {
    console.log('Import seasonalReport');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.reports.seasonalReport);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('Save number of worksheets');
    const initialNumberOfWorksheets = OfficeWorksheet.getNumberOfWorksheets();

    console.log('Open duplicate popup for latest imported object and click import button in it');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    console.log('Check success of duplication');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Check name of duplicated object');
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.seasonalReport} Copy`);

    console.log('Open duplicate popup for latest imported object and click import button in it');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    console.log('Check success of duplication');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Check name of duplicated object');
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.seasonalReport} Copy 2`);

    console.log('Open duplicate popup for latest imported object and click import button in it');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    console.log('Check success of duplication');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Check name of duplicated object');
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.seasonalReport} Copy 3`);

    console.log('Open duplicate popup for latest imported object and click import button in it');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    console.log('Check success of duplication');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Check name of duplicated object');
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.seasonalReport} Copy 4`);

    console.log('Check number of worksheets - should increase by 4');
    expect(OfficeWorksheet.getNumberOfWorksheets()).toBe(initialNumberOfWorksheets + 4);
  });
});
