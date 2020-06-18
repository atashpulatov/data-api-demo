import { switchToPluginFrame, changeBrowserTab, switchToDialogFrame } from '../../helpers/utils/iframe-helper';
import OfficeLogin from '../../helpers/office/office.login';
import PluginRightPanel from '../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../helpers/plugin/plugin.popup';
import { objectsList } from '../../constants/objects-list';
import { popupSelectors } from '../../constants/selectors/popup-selectors';

describe('F12909 - Ability to import a report from MicroStrategy', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC39688] Importing not supported objects', () => {
    // should be unable to import
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);
    PluginPopup.searchForObject(objectsList.datasets.notPublished);
    browser.pause(500);
    PluginPopup.selectObject();
    expect($(popupSelectors.importBtn).isEnabled()).toBe(false);
  });
});
