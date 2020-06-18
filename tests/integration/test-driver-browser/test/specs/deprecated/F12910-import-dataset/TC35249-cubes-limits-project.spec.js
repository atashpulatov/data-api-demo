import officeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';

describe('F12910 - Ability to import a dataset from MicroStrategy', () => {
  beforeEach(() => {
    officeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC35249] Importing cubes which size exceed Project\'s rows/columns limitation', () => {
    // should display a correct error message when importing a report exceeding Project's rows/columns limitation
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.switchLibraryAndImportObject(objectsList.datasets.cubeLimitProject);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.projectLimits);
    PluginRightPanel.closeNotification();
  });
});
