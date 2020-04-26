import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import {
  switchToPluginFrame, switchToExcelFrame, switchToRightPanelFrame, changeBrowserTab, switchToDialogFrame
} from '../../../helpers/utils/iframe-helper';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import {
  waitForNotification, waitForPopup, waitForSuccessNotification, waitForAllNotifications
} from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { excelSelectors } from '../../../constants/selectors/office-selectors';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { removeTimestampFromTableName } from '../../../helpers/utils/tableName-helper';
import { getTextOfNthObjectOnNameBoxList } from '../../../helpers/utils/excelManipulation-helper';


describe('Smart Folder - IMPORT -', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('Import object (1st time)', () => {
    /**
     * Testing refactor 11.2.2
     */


    // should import a report
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importAnyObject(objectsList.reports.reportXML, 1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(1000);
    OfficeWorksheet.selectCell('J1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(objectsList.reports.reportXML);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(1000);
    switchToPluginFrame();
    pluginRightPanel.refreshAll();
    waitForAllNotifications();
    pluginRightPanel.closeAllNotificationsOnHover();

    // ///////////////////
    // waitForNotification();
    // switchToPluginFrame();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
    // expect($('.notification-text').getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
    // // '.ant-notification-notice-description',


    // OfficeWorksheet.selectCell('A1048576');
    // PluginRightPanel.clickAddDataButton();
    // PluginPopup.switchLibrary(false);
    // PluginPopup.importObject(objectsList.reports.report1k);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.excelLimit);
    // PluginRightPanel.closeNotification();

    // // should import report which is exactly at the excel limit
    // OfficeWorksheet.selectCell('A1');
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.importAnyObject(objectsList.reports.marginReport, 2);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);


    // // should display a correct error message when importing a report exceeding Excel row limit
    // OfficeWorksheet.selectCell('A1');
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.switchLibrary(false);
    // PluginPopup.importObject(objectsList.reports.report1_5M);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.excelLimit);
    // PluginRightPanel.closeNotification();

    // // should display proper error message for report exceding excel's limits
    // OfficeWorksheet.selectCell('A1');
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.switchLibrary(false);
    // PluginPopup.importObject(objectsList.reports.over100k);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.projectLimits);
    // PluginRightPanel.closeNotification();


    // // should display proper error message for importing report above cells covering currently imported one
    // OfficeWorksheet.selectCell('A3');
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.switchLibrary(false);
    // PluginPopup.importObject(objectsList.reports.basicReport);
    // waitForNotification();
    // OfficeWorksheet.selectCell('A1');
    // PluginRightPanel.clickAddDataButton();
    // PluginPopup.importObject(objectsList.reports.basicReport);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.rangeNotEmpty);
    // PluginRightPanel.closeNotification();

    // // should display proper error message for importing report next to cells covering currently imported one
    // OfficeWorksheet.selectCell('R1');
    // PluginRightPanel.clickAddDataButton();
    // PluginPopup.importObject(objectsList.reports.basicReport);
    // waitForNotification();
    // OfficeWorksheet.selectCell('P1');
    // PluginRightPanel.clickAddDataButton();
    // PluginPopup.importObject(objectsList.reports.basicReport);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.rangeNotEmpty);
    // PluginRightPanel.closeNotification();

    // // should display a correct error message for a report with all data filtered out
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.switchLibrary(false);
    // PluginPopup.importObject(objectsList.reports.filtered);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.emptyObject);
    // PluginRightPanel.closeNotification();

    // // should import a dataset
    // OfficeWorksheet.selectCell('A1');
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.switchLibrary(false);
    // PluginPopup.importObject(objectsList.datasets.datasetSQL);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // //  assert that cell D19 contain the value 44.659
    // OfficeWorksheet.selectCell('D19');
    // browser.pause(2000);
    // const cellD19 = $(excelSelectors.getCell(4, 19)).getText();
    // expect(cellD19).toBe('44.659');

    // // should insert a dataset with data preparation
    // OfficeWorksheet.selectCell('A1');
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.switchLibrary(false);
    // PluginPopup.prepareObject(objectsList.datasets.basicDataset, ['Order Date', 'Country', 'Region', 'Total Cost', 'Total Revenue'], [['Country', ['Angola', 'Albania', 'Bangladesh']], ['Region', ['Europe', 'Asia']]]);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // // should insert a report with data preparation
    // OfficeWorksheet.selectCell('A5');
    // PluginRightPanel.clickAddDataButton();
    // PluginPopup.prepareObject(objectsList.reports.basicReport, ['Total Cost', 'Total Revenue'], [['Country', ['Angola', 'Albania', 'Bangladesh']], ['Region', ['Europe', 'Asia']]]);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // // should check proper functionality of a raport with graph
    // // should import report with grid and graph
    // OfficeWorksheet.selectCell('A1');
    // PluginRightPanel.clickImportDataButton();
    // PluginPopup.switchLibrary(false);
    // PluginPopup.importObject(objectsList.reports.gridReport);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // // should import report with graph
    // OfficeWorksheet.selectCell('H1');
    // PluginRightPanel.clickAddDataButton();
    // PluginPopup.prepareObject(objectsList.reports.grpahReport, ['Profit'], [['Region', []]]);
    // waitForNotification();
    // switchToRightPanelFrame();
    // browser.pause(1111);

    // // should refresh first report on the right panel
    // const firstReport = $('#overlay > div > section > div > div > div:nth-child(1)');
    // PluginRightPanel.doubleClick(firstReport);
    // browser.pause(1111);
    // pluginRightPanel.closeAllNotificationsOnHover();

    // // PluginRightPanel.refreshFirstObjectFromTheList();
    // PluginRightPanel.refreshObject(2);
    // PluginRightPanel.removeObject(1);
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);


    // const { basic01Report } = objectsList.reports;
    // OfficeWorksheet.selectCell('A2');
    // PluginRightPanel.clickImportDataButton();


    // switchToDialogFrame();
    // PluginPopup.switchLibrary(false);
    // PluginPopup.importObject(basic01Report.sourceName);
    // browser.pause(10000);
    // pluginRightPanel.closeAllNotificationsOnHover();

    // switchToExcelFrame();
    // waitAndClick($(excelSelectors.nameBoxDropdownButton), 4000);
    // const importedFirstTableName = $(`[id^=${basic01Report.excelTableNameStart}]> span`).getText(); // searches for the beginning of the id's string only because of changing timestamps at the end
    // const normalizedFirstTableName = removeTimestampFromTableName(importedFirstTableName);
    // expect(normalizedFirstTableName).toEqual(basic01Report.excelTableFullName);

    // browser.keys('\uE00C');
    // PluginRightPanel.clickOnObject(PluginRightPanel.SelectNthPlaceholder(1), 'A2');
    // OfficeWorksheet.selectCell('I2');

    // switchToRightPanelFrame();
    // PluginRightPanel.clickAddDataButton();
    // PluginPopup.importObject(basic01Report.sourceName);
    // browser.pause(10000);

    // const importedSecondTableName = getTextOfNthObjectOnNameBoxList(2);
    // const normalizedSecondTableName = removeTimestampFromTableName(importedSecondTableName);
    // expect(normalizedSecondTableName).toEqual(basic01Report.excelTableFullName);

    // browser.keys('\uE00C'); // Escape key
    // PluginRightPanel.clickOnObject(PluginRightPanel.SelectNthPlaceholder(1), 'I2');

    // switchToRightPanelFrame();
    // PluginRightPanel.clickObjectInRightPanel(1);
    // browser.pause(1000);
    // switchToExcelFrame();
    // expect($(excelSelectors.cellInput).getValue()).toEqual('A2');


    // // clear data then view data
    // switchToRightPanelFrame();
    // PluginRightPanel.clickSettings();
    // browser.pause(1555); // wait for success notification to disappear
    // PluginRightPanel.clearData();
    // PluginRightPanel.viewDataBtn();

    // // PluginPopup.closeRefreshAll();
    // waitForNotification();
    // pluginRightPanel.closeAllNotificationsOnHover();
    // switchToRightPanelFrame();


    // PluginRightPanel.refreshAll();
    // // waitForPopup();
    // // browser.pause(7000);
    // // switchToExcelFrame();
    // // PluginPopup.closeRefreshAll();
    // waitForNotification();
    // PluginRightPanel.closeAllNotificationsOnHover();
    // browser.pause(3000);


    // // should click "View Data" and close the "Refresh All Data" pop-up
    // browser.pause(1000);
    // switchToPluginFrame();
    // PluginRightPanel.viewDataBtn();
    // switchToExcelFrame();

    // // waitForRefreshAllToFinish();
    // // browser.pause(10000); // TODO: wait for popup to show "Refreshing complete!" message, instead of waiting
    // // waitAndClick($(popupSelectors.closeRefreshAll));
    // waitForNotification();
    // PluginRightPanel.closeAllNotificationsOnHover();

    // should log out
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickLogout();

    // //////////////////////
    // browser.pause(5000);
  });
});
