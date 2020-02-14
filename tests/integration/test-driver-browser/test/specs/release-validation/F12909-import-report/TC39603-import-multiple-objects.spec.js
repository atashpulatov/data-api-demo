import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
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

  it('[TC39603] Import multiple objects', () => {
    // first worksheet
    // should import a supported report
    switchToExcelFrame();
    OfficeWorksheet.selectCell('A1');
    switchToPluginFrame();
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.reportXML);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should import a supported dataset
    OfficeWorksheet.selectCell('Y1');
    switchToPluginFrame();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(objectsList.datasets.datasetSQL);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // Second worksheet
    // should import a supported report on a second sheet
    OfficeWorksheet.openNewSheet();
    switchToPluginFrame();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(objectsList.reports.reportXML);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should import a supported dataset on a second sheet
    OfficeWorksheet.selectCell('Y1');
    switchToPluginFrame();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(objectsList.datasets.datasetSQL);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // Third worksheet
    // should import a supported report on a third sheet
    OfficeWorksheet.openNewSheet();
    switchToPluginFrame();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(objectsList.reports.reportXML);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should import a supported dataset on a third sheet
    OfficeWorksheet.selectCell('Y1');
    switchToPluginFrame();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(objectsList.datasets.datasetSQL);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
