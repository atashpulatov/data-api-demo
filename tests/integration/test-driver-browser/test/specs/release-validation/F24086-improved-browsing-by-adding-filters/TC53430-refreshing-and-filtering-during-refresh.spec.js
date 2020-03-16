import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToDialogFrame } from '../../../helpers/utils/iframe-helper';

describe('F24086 Improved browsing by adding filters', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });
  it('TC53430 Refreshing and filtering during refresh', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);
    PluginPopup.selectFirstObject();
    // apply filters
    PluginPopup.clickRefreshButton();
    const filterResultBefore = PluginPopup.getFilterResults();
    PluginPopup.waitUntilActionIsFinished('button.loading');
    PluginPopup.clickFilterButton();
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    PluginPopup.tickFilterCheckBox('Type', 'Report');
    const filterResultAfter = PluginPopup.getFilterResults();
    expect(filterResultBefore > filterResultAfter).toBeTruthy();
    PluginPopup.scrollTable(['End']);
    PluginPopup.selectLastObject();

    PluginPopup.clickHeader('Name');
    PluginPopup.clickFilterButton();
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clearAll();
    PluginPopup.clickFilterButton(); // TODO: Sorting is preserved check
    PluginPopup.scrollTable(['End']);
    PluginPopup.selectLastObject();

    PluginPopup.clickRefreshButton();
    PluginPopup.waitUntilActionIsFinished('button.loading');
    PluginPopup.scrollTable(['End']);
    PluginPopup.selectLastObject();

    PluginPopup.clickRefreshButton();
    PluginPopup.waitUntilActionIsFinished('button.loading');
    PluginPopup.searchForObject('something not existing');
    $('p=None of the objects matched your search.').waitForDisplayed(1000);
    $('button.search-field__clear-button').click();
    PluginPopup.scrollTable(['End']);
    PluginPopup.selectLastObject();

    PluginPopup.clickRefreshButton();
    browser.waitUntil(() => ($('button.loading').isExisting()));
    PluginPopup.clickFilterButton();
    PluginPopup.waitUntilActionIsFinished('category-list-row disabled');
    PluginPopup.tickFilterCheckBox('Type', 'Dossier');
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    browser.waitUntil(() => !($('button.loading').isExisting()));
    browser.debug();
    // TODO: Check if filters are preserved after fetching is finished
    // expect($('.all-panel__content .category-list-row.disabled input').isSelected()).toBe(false);
  });
});
