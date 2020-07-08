import OfficeLogin from '../../helpers/office/office.login';
import OfficeWorksheet from '../../helpers/office/office.worksheet';
import PluginRightPanel from '../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../helpers/utils/wait-helper';
import { dictionary } from '../../constants/dictionaries/dictionary';
import { changeBrowserTab } from '../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../constants/selectors/plugin.right-panel-selectors';
import { objectsList } from '../../constants/objects-list';

describe('F12909 - Ability to import a report from MicroStrategy', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });


  it('[TC35090] - Importing the report right under Exel limits', () => {
    // should import report which is exactly at the excel limit
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importAnyObject(objectsList.reports.marginReport, 2);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
