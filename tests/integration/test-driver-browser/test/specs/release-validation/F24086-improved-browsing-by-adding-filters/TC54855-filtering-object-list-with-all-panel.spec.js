import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToDialogFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('F24086 - Improved browsing by adding filters', () => {
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

    PluginPopup.clickFilterButton();
    PluginPopup.clickAllButton('Owner');

    console.log('Select 3 owners from the list');
    PluginPopup.clickAllPanelElement('Administrator.');
    PluginPopup.clickAllPanelElement('MSTR User.');
    PluginPopup.clickAllPanelElement('a.');
    PluginPopup.clickViewSelectedInAllPanel();

    console.log('Scroll to the end, select object and sort by name');
    PluginPopup.scrollTable(['End']);
    browser.pause(2222);
    PluginPopup.selectLastObject();
    PluginPopup.clickHeader('Name');

    console.log('Filter by date and last quarter');
    PluginPopup.clickFilterButton();
    PluginPopup.filterByDate('02/04/2008', '05/13/2020');
    PluginPopup.clickAllButton('Modified');
    PluginPopup.clickAllPanelElement('Last Quarter.');

    console.log('Select all owners');
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    const expandButtonText = $$(popupSelectors.filterPanel.expandButton)[1].getText();
    expect(`+${PluginPopup.getAllPanelItemCount() - 2}`).toEqual(expandButtonText);
    expect(PluginPopup.getAllPanelCheckboxState('Administrator')).toBe(true);
    expect(PluginPopup.getAllPanelCheckboxState('MSTR User')).toBe(true);
    expect(PluginPopup.getAllPanelCheckboxState('a')).toBe(true);

    console.log('Clear all selections in Date Modified panel');
    PluginPopup.clickAllButton('Modified');
    PluginPopup.clearAll();
    expect(PluginPopup.getAllPanelCheckboxState('Today')).toBe(false);
    expect(PluginPopup.getAllPanelCheckboxState('Yesterday')).toBe(false);
    expect(PluginPopup.getAllPanelCheckboxState('Last 7 Days')).toBe(false);
    expect(PluginPopup.getAllPanelCheckboxState('Last Month')).toBe(false);
    expect(PluginPopup.getAllPanelCheckboxState('Last Quarter')).toBe(false);
    expect(PluginPopup.getAllPanelCheckboxState('Last Year')).toBe(false);
  });
});
