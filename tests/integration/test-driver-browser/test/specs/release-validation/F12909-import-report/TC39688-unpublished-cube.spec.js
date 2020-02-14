import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { selectors } from '../../../constants/selectors/popup-selectors';
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

  it('[TC39688] Importing not supported objects', () => {
    // should be unable to import
    PluginRightPanel.clickImportDataButton();
    switchToPluginFrame();
    browser.pause(500);
    PluginPopup.switchLibrary(false);
    PluginPopup.searchForObject(objectsList.datasets.notPublished);
    browser.pause(500);
    PluginPopup.selectFirstObject();
    expect($(selectors.importBtn).isEnabled()).toBe(false);

  });
});
