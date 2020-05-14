import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { changeBrowserTab, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';

describe('F24087 - Improve performance of scrolling through the object list', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC54976][Object Table] End to End scenario on Excel implementation | E2E', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();

    switchToDialogFrame();
    PluginPopup.switchLibrary(false);

    PluginPopup.scrollTableDownByPages(200);
    PluginPopup.clickHeader('Owner');
    PluginPopup.scrollTableDownByPages(200);
    browser.setWindowSize(1000, 800);
    PluginPopup.scrollTableDownByPages(200);

    PluginPopup.searchForObject('Supplier Sales Report');
    browser.pause(999); // waiting for search to filter the ObjectTable
    PluginPopup.selectObject();
    PluginPopup.clickImport();

    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
