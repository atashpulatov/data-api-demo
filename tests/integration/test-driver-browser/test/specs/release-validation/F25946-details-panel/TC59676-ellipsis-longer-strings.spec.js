import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { changeBrowserTab, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';

describe('F25946 - Details Panel', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  const ellipsis = '...';

  it('[TC59676] - Ellipsis for longer strings', () => {
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);

    PluginPopup.searchForObject(objectsList.reports.reportXML);

    console.log('expand details for the first element');
    browser.pause(1000); // We need to wait for search to be completed to get filtered rows
    PluginPopup.expandObjectDetails(1);

    const initialDetailsTable = PluginPopup.getDetailsTableByIndex(1);

    console.log('get location text for initial window size');
    const initialLocationText = PluginPopup.getLocationText(initialDetailsTable);
    expect(initialLocationText.includes(ellipsis)).toBe(false);

    console.log('resize window to apply ellipsis');
    browser.setWindowSize(950, 850);
    browser.pause(1000); // need to wait for DOM to update to apply ellipsis

    const updatedDetailsTable = PluginPopup.getDetailsTableByIndex(1);

    console.log('get location text for updated window size');
    const updatedLocationText = PluginPopup.getLocationText(updatedDetailsTable);

    expect(updatedLocationText.includes(ellipsis)).toBe(true);
    expect(initialLocationText > updatedLocationText).toBe(true);
  });
});
