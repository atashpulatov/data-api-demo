import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToDialogFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';

describe('F25946 - Object Details Panel', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC59677] - Altering Table of Objects with rows expanded', () => {
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();

    // Refreshing
    PluginPopup.switchLibrary(false);
    PluginPopup.expandFirstAndLastRows(2);
    PluginPopup.clickRefreshButton();
    PluginPopup.waitForRefresh();
    expect(PluginPopup.areAllRowsCollapsed()).toEqual(true);

    // Searching
    PluginPopup.expandFirstAndLastRows(2);
    PluginPopup.searchForObject(objectsList.reports.detailsReport);
    browser.pause(1000); // necessary pause for search to finish
    expect(PluginPopup.areAllRowsCollapsed()).toEqual(true);

    // Filtering
    PluginPopup.expandFirstAndLastRows(1);
    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Application', 'MicroStrategy Tutorial');
    PluginPopup.clickFilterButton();
    expect(PluginPopup.areAllRowsCollapsed()).toEqual(true);

    // Sorting
    PluginPopup.expandFirstAndLastRows(1);
    PluginPopup.clickHeader('Owner');
    expect(PluginPopup.areAllRowsCollapsed()).toEqual(true);
  });
});
