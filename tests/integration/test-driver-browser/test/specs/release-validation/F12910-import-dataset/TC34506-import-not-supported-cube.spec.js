import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import officeLogin from '../../../helpers/office/office.login';

describe('[F12910] - Ability to import a dataset from MicroStrategy', () => {
  beforeEach(() => {
    officeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC34506] [Insert Objects] [Error Handling] Importing a not supported cubes', () => {
    // should display a correct error message when importing not supported cube
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.switchLibraryAndImportObject(objectsList.datasets.notSupportedCube);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.emptyObject);
    PluginRightPanel.closeNotification();
  });
});
