import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { changeBrowserTab, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';

describe('F24087 - Improve performance of scrolling through the object list', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC55130][Object Table] Sorting the table', () => {
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();

    console.log('filter for testcase objects');
    PluginPopup.switchLibrary(false);
    PluginPopup.searchForObject('TC55130');
    browser.pause(1000);

    console.log('sort by date modified ascending');
    PluginPopup.clickHeader('Modified');
    const timestamps = PluginPopup.getObjectsTimestamps();
    expect(PluginPopup.isSortedAsceding(timestamps)).toBe(true);

    console.log('sort by owners descending');
    PluginPopup.clickHeader('Owner');
    PluginPopup.clickHeader('Owner'); // Click twice to sort descending
    const owners = PluginPopup.getColumnContents('columnOwner');
    expect(PluginPopup.isSortedDesceding(owners)).toBe(true);

    console.log('sort by applications ascending');
    PluginPopup.clickHeader('Application');
    const applications = PluginPopup.getColumnContents('columnProject');
    expect(PluginPopup.isSortedAsceding(applications)).toBe(true);

    console.log('sort by name descending');
    PluginPopup.clickHeader('Name');
    PluginPopup.clickHeader('Name'); // Click twice to sort descending
    const names = PluginPopup.getColumnContents('columnName');
    expect(PluginPopup.isSortedDesceding(names)).toBe(true);
  });
});
