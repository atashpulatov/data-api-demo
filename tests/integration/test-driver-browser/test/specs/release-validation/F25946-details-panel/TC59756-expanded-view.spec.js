import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';

describe('Expanded view E2E workflow', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('Imports an object after checking details', () => {
    PluginRightPanel.clickImportDataButton();
    switchToPluginFrame();
    PluginPopup.switchLibrary(false);

    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Application', 'MicroStrategy Tutorial');
    PluginPopup.clickFilterButton();

    PluginPopup.searchForObject(objectsList.reports.detailsReport);
    browser.pause(1000); // We need to wait for search to be completed to get filtered rows
    const idsArray = PluginPopup.copyObjectsID();
    expect(idsArray[0]).not.toEqual(idsArray[1]);

    PluginPopup.pasteToSearchBox(); // We paste clipboard content to searchbox for easier comparison
    expect(PluginPopup.compareSearchBoxToString(idsArray[1])).toBe(true);

    PluginPopup.selectFirstObject();
    PluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
