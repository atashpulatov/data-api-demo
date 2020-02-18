import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { switchToPluginFrame, switchToPromptFrame, switchToPopupFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('TS41441 - E2E Sanity checks', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('[TC49134] [E2E] Error handling | Subtotals | Crosstabs | Formatting | Secure Data - Additional Checks', () => {
    // should try to import a report of 1,5M rows that exceeds the excelsheet limits
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.report1_5M);
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

    // should try to import a small report but placed in the last row of the excelsheet limits
    OfficeWorksheet.selectCell('XFD1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.reportXML);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.excelLimit);
    PluginRightPanel.closeNotification();

    // should try to import a report of 1,5M rows that exceeds the project row limitation
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.over100k);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.projectLimits);
    PluginRightPanel.closeNotification();

    // should import a report with not supported features
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.notSupportedFeatures);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should try to import a report with not supported features
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.reportXML);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.rangeNotEmpty);
    PluginRightPanel.closeNotification();

    // should open a new sheet & import a report with totals/subtotals
    OfficeWorksheet.openNewSheet();
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.basicSubtotalsReport);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should open a new sheet & import a report with crosstabs
    OfficeWorksheet.openNewSheet();
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.basicSubtotalsReport);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should open a new sheet & import a report with crosstabs
    OfficeWorksheet.openNewSheet();
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.numberFormating);
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
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clearData();
    // TODO: click OK button, for the question: Are you sure you want to Clear Data?
    browser.pause(4000);

    // should assert data was cleared
    switchToExcelFrame();
    // expect(C10.getText()).toEqual('');
    // expect(C10.getText()).toEqual('');

    // should log out
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickLogout();

    // should log in with Tim user
    PluginRightPanel.loginToPlugin('Tim', '');

    // should click "View Data" and close the "Refresh All Data" pop-up
    switchToPluginFrame();
    PluginRightPanel.viewDataBtn();
    switchToExcelFrame();
    // TODO: wait for popup to show "Refreshing complete!" message
    browser.actions().mouseMove(popupSelectors.closeRefreshAll).perform();
    browser.actions().click(popupSelectors.closeRefreshAll).perform();

    // should assert data was refreshed
    switchToExcelFrame();
    // expect(C10.getText()).toEqual('$764,341');
    // expect(C10.getText()).toEqual('$764,341');
  });
});
