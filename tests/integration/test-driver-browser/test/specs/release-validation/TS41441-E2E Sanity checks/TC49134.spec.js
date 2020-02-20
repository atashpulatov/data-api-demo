import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { switchToPluginFrame, switchToPromptFrame, switchToPopupFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';


describe('TS41441 - E2E Sanity checks', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('[TC49134] [E2E] Error handling', () => {
    // should try to import a report of 1,5M rows that exceeds the excelsheet limits
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.report1_5M, false);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.excelLimit);
    PluginRightPanel.closeNotification();

    // should try to import a small report but placed in the last row of the excelsheet limits
    OfficeWorksheet.selectCell('A1048575');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.reportXML);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.excelLimit);
    PluginRightPanel.closeNotification();

    // should try to import a small report but placed in the last column of the excelsheet limits
    OfficeWorksheet.selectCell('XFD1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.reportXML);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.excelLimit);
    PluginRightPanel.closeNotification();

    // should try to import a report of over 100k that exceeds the project row limitation
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.over100k);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.projectLimits);
    PluginRightPanel.closeNotification();

    // should import a report with not supported features
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.notSupportedFeatures);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should try to import a report in a non empty range
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(objectsList.reports.reportXML);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.rangeNotEmpty);
    PluginRightPanel.closeNotification();
  });

  it('[TC49134] [E2E] Subtotals | Crosstabs', () => {
    // should open a new sheet & import a report with totals/subtotals
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibraryAndImportObject('Report with Totals and Subtotals', false);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should open a new sheet & import a report with crosstabs
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject('Report with Crosstab');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });

  it('[TC49134] [E2E] Formatting | Secure Data - Additional Checks', () => {
    // should open a new sheet & import a report with number formatting
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.numberFormating, false);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    /* TODO: For the already imported objects apply some additional Excel formatting, available options are:
    - applying table formatting
    - different number formats
    - conditional formatting
    - table styles (only for Excel Desktop version)
    - cell content alignment and fonts
    */

    // should clear data
    browser.pause(1000);
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clearData();
    browser.pause(4000);

    // should assert data was cleared
    switchToExcelFrame();


    // should log out
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickLogout();

    // should log in with Tim user
    PluginRightPanel.loginToPlugin('a', '');

    // should click "View Data" and close the "Refresh All Data" pop-up
    switchToPluginFrame();
    PluginRightPanel.viewDataBtn();
    switchToExcelFrame();

    // waitForRefreshAllToFinish();
    browser.pause(10000); // TODO: wait for popup to show "Refreshing complete!" message, instead of waiting
    waitAndClick($(popupSelectors.closeRefreshAll));

    // should assert data was refreshed
    switchToExcelFrame();
  });
});
