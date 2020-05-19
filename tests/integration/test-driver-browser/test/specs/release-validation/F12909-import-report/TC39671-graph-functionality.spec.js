import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { changeBrowserTab, switchToRightPanelFrame } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';

describe('F12909 - Ability to import a report from MicroStrategy', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });


  it('[TC39671] Importing graph and grid/graph reports functionality', () => {
    // should check proper functionality of a raport with graph
    // should import report with grid and graph
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.reports.gridReport);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should import report with graph
    OfficeWorksheet.selectCell('H1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.prepareObject(objectsList.reports.grpahReport, ['Profit'], [['Region', []]]);
    waitForNotification();
    switchToRightPanelFrame();
    browser.pause(1111);

    // should refresh first report on the right panel
    const firstReport = $('#overlay > div > section > div > div > div:nth-child(1)');
    PluginRightPanel.doubleClick(firstReport);
    browser.pause(1111);
    PluginRightPanel.closeAllNotificationsOnHover();
    PluginRightPanel.refreshFirstObjectFromTheList();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
  });
});
