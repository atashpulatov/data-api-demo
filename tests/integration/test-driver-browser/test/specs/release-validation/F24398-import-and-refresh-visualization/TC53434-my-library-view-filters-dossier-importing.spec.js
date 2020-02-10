import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import settings from '../../../config';

describe('F24398 - Import and refresh visualization', () => {
  beforeEach(() => {
    // browser.setWindowSize(2200,900);
    browser.setWindowSize(1900, 900);
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

  it('TC53434 - [MyLibrary] My Library view, Filters, Dossier importing', () => {
    // should log in, check some filters, toggle myLibrary off and on, and import a Dossier visualization
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    switchToPluginFrame();
    waitAndClick($('#Filter'));
    $('label[title=\'Administrator\']').click();
    browser.keys('\uE00c');
    PluginPopup.switchLibrary();
    PluginPopup.switchLibrary();
    PluginPopup.importObject('Dossier for interactive components');
    PluginPopup.selectAndImportVizualiation('#mstr123');
  });
});
