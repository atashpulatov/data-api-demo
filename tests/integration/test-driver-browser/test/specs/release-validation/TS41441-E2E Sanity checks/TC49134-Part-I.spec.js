import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';

describe('TS41441 - E2E Sanity checks', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC49134] Part I - Error handling', () => {
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
});
