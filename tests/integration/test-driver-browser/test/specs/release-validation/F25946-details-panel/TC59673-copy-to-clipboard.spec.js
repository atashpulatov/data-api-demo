import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { changeBrowserTab, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';
import { externalSelectors } from '../../../constants/selectors/external-selectors';

function copyPasteObjectDetailValue(index, pluginWindowHandle) {
  // Copy the objects detail value to clippboard
  const objectDetailValue = PluginPopup.copyToClipboardObjectDetails(index);

  // Open new window with Bing
  browser.newWindow('https://bing.com');
  browser.pause(1000); // Wait for new window to be ready

  // Paste string from clipboard to Bing search field
  $(externalSelectors.bingSearchField).setValue(['Shift', 'Insert', 'Enter']);
  browser.pause(1000); // Wait for Bing search to be executed

  // Assertion - compare string from Bing with the object detail string
  expect(objectDetailValue === $(externalSelectors.bingSearchBox).getAttribute('value')).toBe(true);

  // close the Bing window and switch back to the plugin browser window
  browser.closeWindow();
  browser.switchToWindow(pluginWindowHandle);
  switchToDialogFrame();
}

describe('F25946 - Object Details Panel', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC59673] Imports an object after checking details', () => {
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();

    // Get handle for the plugin browser window
    const pluginWindowHandle = browser.getWindowHandle();

    // Switching to non My Libray view
    PluginPopup.switchLibrary(false);

    // Searching for an object with all details fields popuplated
    PluginPopup.searchForObject(objectsList.reports.categorySubCategory);
    browser.pause(1000); // We need to wait for search to be completed to get filtered rows

    // Select and expand details for the first found object
    PluginPopup.expandObjectDetails(1);

    // Copy object details values to clippboard, paste them in Bing and assert
    for (let i = 1; i < 6; i++) {
      copyPasteObjectDetailValue(i, pluginWindowHandle);
    }
  });
});
