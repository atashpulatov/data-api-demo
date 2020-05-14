import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToDialogFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('F24086 Improved browsing by adding filters', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });
  it('[TC54855] [Object filtering] Filtering object list with "All" panel', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);

    console.log('Mouse click on the filter icon');
    PluginPopup.clickFilterButton();

    console.log('Click "All" Button under "Owner" category');
    PluginPopup.clickAllButton('Owner');

    console.log('Select 3 owners from the list');
    PluginPopup.clickAllPanelElement('Administrator.');
    PluginPopup.clickAllPanelElement('MSTR User.');
    PluginPopup.clickAllPanelElement('a.');

    PluginPopup.clickViewSelectedInAllPanel();

    PluginPopup.scrollTable(['End']);
    browser.pause(2222);
    PluginPopup.selectLastObject();

    PluginPopup.clickHeader('Name');
    PluginPopup.clickFilterButton();
    PluginPopup.filterByDate('02/04/2008', '05/13/2020');
    PluginPopup.clickAllButton('Modified');
    PluginPopup.clickAllPanelElement('Last Quarter.');
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    PluginPopup.clickAllButton('Modified');
    PluginPopup.clearAll();

    browser.pause(5555);
  });
});
