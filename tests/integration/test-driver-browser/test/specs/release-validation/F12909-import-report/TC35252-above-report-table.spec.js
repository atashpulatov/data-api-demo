import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import settings from '../../../config';

describe('F12909 - Ability to import a report from MicroStrategy report', () => {
  beforeEach(() => {
    browser.setWindowSize(1500, 900);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login(settings.officeOnline.username, settings.officeOnline.password);
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    PluginRightPanel.loginToPlugin(settings.env.username, settings.env.password);
  });
  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });


  it('[TC35252] - report above/next to table', () => {
    // should display proper error message for importing report above cells covering currently imported one
    OfficeWorksheet.selectCell('A3');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.basicReport);
    waitForNotification();
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(objectsList.reports.basicReport);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.rangeNotEmpty);
    PluginRightPanel.closeNotification();

    // should display proper error message for importing report next to cells covering currently imported one
    OfficeWorksheet.selectCell('R1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(objectsList.reports.basicReport);
    waitForNotification();
    OfficeWorksheet.selectCell('P1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(objectsList.reports.basicReport);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.rangeNotEmpty);
    PluginRightPanel.closeNotification();
  });
})
