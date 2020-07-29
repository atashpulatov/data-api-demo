import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { changeBrowserTab, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';

const clipboardy = require('clipboardy');

function copyAndCheckObjectDetailValue(index) {
  // Copy the objects detail value to clippboard
  const objectDetailValue = PluginPopup.copyToClipboardObjectDetails(index);

  const clipBoardContent = clipboardy.readSync();

  // Assertion - compare string from clipboard with the object detail string
  expect(objectDetailValue === clipBoardContent).toBe(true);
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

  it('[TC59673] Copy to clipboard', () => {
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();

    // Switching to non My Libray view
    PluginPopup.switchLibrary(false);

    // Searching for an object with all details fields popuplated
    PluginPopup.searchForObject(objectsList.reports.categorySubCategory);
    browser.pause(1000); // We need to wait for search to be completed to get filtered rows

    // Select and expand details for the first found object
    PluginPopup.expandObjectDetails(1);

    // Copy object details values to clippboard, paste them in Bing and assert
    for (let i = 1; i < 6; i++) {
      copyAndCheckObjectDetailValue(i);
    }
  });
});
