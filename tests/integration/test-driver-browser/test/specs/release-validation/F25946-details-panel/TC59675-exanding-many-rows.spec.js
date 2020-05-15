import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { changeBrowserTab, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { pressEnter, pressDownArrow } from '../../../helpers/utils/keyboard-actions';

describe('F25946 - details panel', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC59725] - [Object Details] Expanding multiple rows', () => {
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);

    // expand fist 2 rows
    PluginPopup.expandFirstRows(2);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(2);

    PluginPopup.assertDetailsTableDisplayedCorrectly(PluginPopup.getDetailsTableByIndex(1));
    PluginPopup.assertDetailsTableDisplayedCorrectly(PluginPopup.getDetailsTableByIndex(2));

    // expand last row
    PluginPopup.scrollTable(['End']);
    PluginPopup.expandLastRows(1);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(1);
    PluginPopup.assertDetailsTableDisplayedCorrectly(PluginPopup.getDetailsTableByIndex(1));

    // check if first two rows are still expanded
    PluginPopup.scrollTable(['Home']);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(2);

    // hide first row
    PluginPopup.closeFirstRows(1);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(1);
  });
});
