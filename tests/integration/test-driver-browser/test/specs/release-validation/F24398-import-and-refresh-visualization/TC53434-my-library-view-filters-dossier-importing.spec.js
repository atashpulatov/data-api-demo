import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { changeBrowserTab, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';

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
    waitAndClick($('#Filter'));
    $('label[title=\'Administrator\']').click();
    browser.keys('\uE00c');
    PluginPopup.switchLibrary();
    PluginPopup.switchLibrary();
    PluginPopup.importObject('Dossier for interactive components');
    PluginPopup.selectAndImportVizualiation('#mstr123');
  });
});
