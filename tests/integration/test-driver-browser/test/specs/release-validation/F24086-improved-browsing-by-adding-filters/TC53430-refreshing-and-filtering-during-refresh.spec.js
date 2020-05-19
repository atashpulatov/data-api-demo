import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('F24086 - Improved browsing by adding filters', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });
  it('[TC53430] Refreshing and filtering during refresh', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);
    PluginPopup.selectFirstObjectWithoutSearch();
    // apply filters
    PluginPopup.clickRefreshButton();
    const filterResultBefore = PluginPopup.getFilterResults();
    PluginPopup.waitUntilActionIsFinished(popupSelectors.buttonLoading);
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
    PluginPopup.clickFilterButton();
    PluginPopup.scrollTable(['End']);
    PluginPopup.selectLastObject();

    PluginPopup.clickRefreshButton();
    PluginPopup.waitUntilActionIsFinished(popupSelectors.buttonLoading);
    PluginPopup.scrollTable(['End']);
    PluginPopup.selectLastObject();

    PluginPopup.clickRefreshButton();
    PluginPopup.waitUntilActionIsFinished(popupSelectors.buttonLoading);
    PluginPopup.searchForObject('something not existing');
    $(popupSelectors.emptySearchResults).waitForDisplayed(1000);
    $(popupSelectors.clearSearchInput).click();
    PluginPopup.scrollTable(['End']);
    PluginPopup.selectLastObject();

    PluginPopup.clickRefreshButton();
    browser.waitUntil(() => ($(popupSelectors.buttonLoading).isExisting()));
    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Type', 'Dossier');
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    browser.waitUntil(() => !($(popupSelectors.buttonLoading).isExisting()));
    browser.pause(5000);
    expect(PluginPopup.getCheckboxState('Type', 'Dossier')).toBe(false);
    expect(PluginPopup.getCheckboxState('Owner', 'Administrator')).toBe(false);
  });
});
