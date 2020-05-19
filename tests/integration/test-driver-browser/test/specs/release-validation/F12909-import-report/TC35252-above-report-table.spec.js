import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { objectsList } from '../../../constants/objects-list';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';

describe('F12909 - Ability to import a report from MicroStrategy', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });


  it('[TC35252] - report above/next to table', () => {
    // should display proper error message for importing report above cells covering currently imported one
    OfficeWorksheet.selectCell('A3');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
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
});
