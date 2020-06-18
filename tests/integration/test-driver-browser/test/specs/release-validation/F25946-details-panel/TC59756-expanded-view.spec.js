import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { changeBrowserTab, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';

describe('F25946 - Object Details Panel', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC59756] - [Object Details] Expanded view for Table of Objects', () => {
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);

    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Application', 'MicroStrategy Tutorial');
    PluginPopup.clickFilterButton();

    PluginPopup.searchForObject(objectsList.reports.detailsReport);
    browser.pause(1000); // We need to wait for search to be completed to get filtered rows
    const idsArray = PluginPopup.copyObjectsID();
    expect(idsArray[0]).not.toEqual(idsArray[1]);

    PluginPopup.pasteToSearchBox(); // We paste clipboard content to searchbox for easier comparison
    expect(PluginPopup.compareSearchBoxToString(idsArray[idsArray.length - 1])).toBe(true);
    PluginPopup.selectObject();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
  });
});
