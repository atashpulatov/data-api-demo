import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToPopupFrame } from '../../../helpers/utils/iframe-helper';
import { writeDataIntoFile, getJsonData } from '../../../helpers/utils/benchmark-helper';
import { objects as o } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { selectors as s } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import settings from '../../../config';

describe('TC53434 - [MyLibrary] My Library view, Filters, Dossier importing', () => {
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

  it('Select Dossier', () => {
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
