import OfficeLogin from '../../helpers/office/office.login';
import OfficeWorksheet from '../../helpers/office/office.worksheet';
import PluginRightPanel from '../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame, changeBrowserTab } from '../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../helpers/utils/wait-helper';
import { dictionary } from '../../constants/dictionaries/dictionary';
import { objectsList } from '../../constants/objects-list';
import { rightPanelSelectors } from '../../constants/selectors/plugin.right-panel-selectors';

describe('F12909 - Ability to import a report from MicroStrategy', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC39603] Import multiple objects', () => {
    // first worksheet
    // should import a supported report
    switchToExcelFrame();
    OfficeWorksheet.selectCell('A1');
    switchToPluginFrame();
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
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
