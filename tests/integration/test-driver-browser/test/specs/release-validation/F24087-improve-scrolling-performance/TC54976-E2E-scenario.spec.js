import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors as selectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';

describe('F24087 - Improve performance of scrolling through the object list', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('[TC54976][Object Table] End to End scenario on Excel implementation | E2E', () => {
    const pageScrollCount = 200;
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.scrollTableDownByPages(pageScrollCount);
    PluginPopup.clickHeader('Owner');
    PluginPopup.scrollTableDownByPages(pageScrollCount);
    browser.setWindowSize(1000, 800);
    PluginPopup.scrollTableDownByPages(pageScrollCount);
    PluginPopup.searchForObject('Supplier Sales Report');
    browser.pause(999); // waiting for search to filter the ObjectTable
    PluginPopup.selectFirstObject();
    PluginPopup.clickImport();
    waitForNotification();
    expect($(selectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
