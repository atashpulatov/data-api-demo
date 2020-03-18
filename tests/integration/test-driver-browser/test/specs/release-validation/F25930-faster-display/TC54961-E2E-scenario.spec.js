
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import { switchToPluginFrame, changeBrowserTab, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import pluginPopup from '../../../helpers/plugin/plugin.popup';
import officeLogin from '../../../helpers/office/office.login';
import { objectsList } from '../../../constants/objects-list';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import pluginRightPanel from '../../../helpers/plugin/plugin.right-panel';


describe('F25930 - Faster display of data sources by caching object list', () => {
  beforeEach(() => {
    officeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC54961] [Display objects quick] E2E scenario for typical Object Browsing', () => {
    OfficeWorksheet.selectCell('A1');
    browser.pause(5000); // Pause for the plugin to cache all the objects TODO: a method that takes the information from the console
    pluginRightPanel.clickImportDataButton();
    browser.pause(1000);

    switchToDialogFrame();
    pluginPopup.switchLibrary(false);
    browser.pause(1000);
    browser.keys('\uE00c'); // Press Escape to close the Smart Data window
    pluginRightPanel.clickImportDataButton();
    browser.pause(1000);

    switchToPluginFrame();
    const filterResult = $(popupSelectors.smartFolderTable.availableObjectNumber);
    filterResult.waitForDisplayed();
    const onlyNumberObjects = (filterResult.getText()).replace(/(^\d+)(.+$)/i, '$1');
    expect(onlyNumberObjects).toBeGreaterThan(1000);

    switchToPluginFrame();
    pluginPopup.searchForObject(objectsList.datasets.salesRecords1k);
    browser.pause(1111);
    pluginPopup.selectFirstObject();
    pluginPopup.clickPrepareData();

    const begin = Date.now();
    $(popupSelectors.prepareData.getAttributeAt(8)).waitForDisplayed();
    const end = Date.now();
    const milisecondsToDisplayAttAndMetrics = end - begin;
    expect(milisecondsToDisplayAttAndMetrics).toBeLessThan(3000);
  });
});
