import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { changeBrowserTab, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';

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

    console.log('expand fist 2 rows');
    PluginPopup.expandFirstRows(2);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(2);

    PluginPopup.assertDetailsTableDisplayedCorrectly(PluginPopup.getDetailsTableByIndex(1));
    PluginPopup.assertDetailsTableDisplayedCorrectly(PluginPopup.getDetailsTableByIndex(2));

    console.log('expand last row');
    PluginPopup.scrollTable(['End']);
    PluginPopup.expandLastRows(1);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(1);
    PluginPopup.assertDetailsTableDisplayedCorrectly(PluginPopup.getDetailsTableByIndex(1));

    console.log('check if first two rows are still expanded');
    PluginPopup.scrollTable(['Home']);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(2);

    console.log('hide first row');
    PluginPopup.closeRowsFromTop(1);
    expect(PluginPopup.findAmountOfOpenRows()).toEqual(1);
  });
});
