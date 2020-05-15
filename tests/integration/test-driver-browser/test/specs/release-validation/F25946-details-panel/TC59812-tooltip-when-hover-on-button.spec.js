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

  it('[TC59812] - Tooltips when hover on the button', () => {
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);

    PluginPopup.searchForObject(objectsList.reports.reportXML);

    console.log('hover over expand button in collapsed state');
    expect(PluginPopup.getExpandButtonTooltipText(1)).toEqual('Show more');
    PluginPopup.expandObjectDetails(1);

    console.log('hover over expand button in expanded state');
    expect(PluginPopup.getExpandButtonTooltipText(1, true)).toEqual('Show less');

    console.log('hover over ID details of the given object');
    const detailsTable = PluginPopup.getDetailsTableByIndex(1);
    expect(PluginPopup.getDetailsIDTooltipText(detailsTable)).toEqual('Click to Copy');

    console.log('hover over ID details of the given object after copying its value');
    PluginPopup.copyToClipboardObjectDetails(2);
    expect(PluginPopup.getDetailsIDTooltipText(detailsTable)).toEqual('Copied');
  });
});
