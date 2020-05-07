import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';

describe('F21409 - Refresh All - ', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });


  it('[TC41094] - Refreshing at least 10 already imported objects with very long names', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    browser.pause(6000);
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.reportXML);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('First object is imported');

    OfficeWorksheet.selectCell('I1');
    PluginRightPanel.clickAddDataButton();
    browser.pause(6000);
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.reportXML);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Second object is imported');

    OfficeWorksheet.selectCell('Q1');
    PluginRightPanel.clickAddDataButton();
    browser.pause(6000);
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.reportXML);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Third object is imported');

    OfficeWorksheet.selectCell('A21');
    PluginRightPanel.clickAddDataButton();
    browser.pause(6000);
    PluginPopup.switchLibraryAndImportObject(objectsList.datasets.datasetSQL);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Fourth object is imported');

    OfficeWorksheet.selectCell('G21');
    PluginRightPanel.clickAddDataButton();
    browser.pause(6000);
    PluginPopup.switchLibraryAndImportObject(objectsList.datasets.datasetSQL);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Fifth object is imported');

    OfficeWorksheet.selectCell('M21');
    PluginRightPanel.clickAddDataButton();
    browser.pause(6000);
    PluginPopup.switchLibraryAndImportObject(objectsList.datasets.datasetSQL);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Sixth object is imported');

    OfficeWorksheet.selectCell('A41');
    PluginRightPanel.clickAddDataButton();
    browser.pause(6000);
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.reportWithLongName);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Seventh object is imported');

    OfficeWorksheet.selectCell('F41');
    PluginRightPanel.clickAddDataButton();
    browser.pause(6000);
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.longReportWithInvalidCharacters.sourceName);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Eighth object is imported');

    OfficeWorksheet.selectCell('L41');
    PluginRightPanel.clickAddDataButton();
    browser.pause(6000);
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.longReportWithInvalidCharacters.sourceName);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Ninth object is imported');

    OfficeWorksheet.selectCell('S41');
    PluginRightPanel.clickAddDataButton();
    browser.pause(6000);
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.reportWithLongName);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Tenth object is imported');

    PluginRightPanel.refreshAll();
    console.log('Selected "refresh all"');

    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();

    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();

    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();

    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();

    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();

    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();

    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();

    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();

    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();

    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();
    console.log('Refreshed all');
  });
});
