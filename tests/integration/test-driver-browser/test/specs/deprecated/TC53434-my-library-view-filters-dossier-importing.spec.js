import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { changeBrowserTab, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { pressEscape } from '../../../helpers/utils/keyboard-actions';

describe('F24398 - Import and refresh visualization', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('TC53434 - [MyLibrary] My Library view, Filters, Dossier importing', () => {
    // should log in, check some filters, toggle myLibrary off and on, and import a Dossier visualization
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);
    waitAndClick($('#Filter'));
    $('label[title=\'Administrator\']').click();
    pressEscape();
    PluginPopup.switchLibrary();
    PluginPopup.switchLibrary();
    PluginPopup.importObject('Dossier for interactive components');
    PluginPopup.selectAndImportVisualization('#mstr114');
    waitForNotification();
    OfficeWorksheet.selectCell('D9');
    browser.pause(2000);
    const D9 = '#gridRows > div:nth-child(9) > div:nth-child(3) > div > div';
    expect($(D9).getText()).toEqual('$2,221,721');
  });
});
