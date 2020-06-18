import OfficeLogin from '../../helpers/office/office.login';
import OfficeWorksheet from '../../helpers/office/office.worksheet';
import PluginRightPanel from '../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../helpers/utils/wait-helper';
import { objectsList } from '../../constants/objects-list';
import { changeBrowserTab } from '../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../constants/dictionaries/dictionary';

describe('F12909 - Ability to import a report from MicroStrategy', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });


  it('[TC35250] Report ecxeeds project limits', () => {
    // should display proper error message for report exceding excel's limits
    browser.pause(3000);
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.reports.over100k);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.projectLimits);
    PluginRightPanel.closeNotification();
  });
});
