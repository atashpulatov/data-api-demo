import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import settings from '../../../config';

describe('F12909 - Ability to import a report from MicroStrategy report', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });


  it('[TC36826] Importing not supported objects', () => {
    // should display a correct error message for a report with all data filtered out
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.filtered);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.emptyObject);
    PluginRightPanel.closeNotification();
  });
});
