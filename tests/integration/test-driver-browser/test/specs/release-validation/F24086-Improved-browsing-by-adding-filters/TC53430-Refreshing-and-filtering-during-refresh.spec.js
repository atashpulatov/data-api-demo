import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import settings from '../../../config';

describe('F24086 Improved browsing by adding filters', () => {
  beforeEach(() => {
    browser.setWindowSize(1500, 1100);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login(settings.officeOnline.username, settings.officeOnline.password);
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    PluginRightPanel.loginToPlugin(settings.env.username, settings.env.password);
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('TC53430 Refreshing and filtering during refresh', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.selectFirstObject();
    // apply filters

    PluginPopup.clickRefreshObjectTable();
    browser.waitUntil(() => {
      return ($('button.loading').isExisting());
    });
    browser.waitUntil(() => {
      return !($('button.loading').isExisting());
    });

    PluginPopup.clickFilterButton();
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    PluginPopup.tickFilterCheckBox('Type', 'Report');
    expect($('div.FilterResult > strong').getText()).toEqual('938'); // TODO: get number of elements and compare

    PluginPopup.scrollTable(['End']);
    $('div=SQL Pass Performance').waitForDisplayed(1000); // TODO: Check if whole row is highlighted
    $('div=SQL Pass Performance').click();
    PluginPopup.clickHeader('Name');
    PluginPopup.clickFilterButton();
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickClearAll();
    PluginPopup.clickFilterButton(); // TODO: Sorting is preserved check
    PluginPopup.scrollTable(['End']);
    $('div=Zip Code Validation').waitForDisplayed(1000)
    $('div=Zip Code Validation').click();
    PluginPopup.clickRefreshObjectTable();
    browser.waitUntil(() => {
      return ($('button.loading').isExisting());
    });
    browser.waitUntil(() => {
      return !($('button.loading').isExisting());
    });
    PluginPopup.scrollTable(['End']);
    $('div=SQL Pass Performance').waitForDisplayed(1000);
    $('div=SQL Pass Performance').click(); // TODO: Check if filters are preserved
    PluginPopup.clickRefreshObjectTable();
    browser.waitUntil(() => {
      return ($('button.loading').isExisting());
    });
    browser.waitUntil(() => {
      return !($('button.loading').isExisting());
    });
    PluginPopup.searchForObject('something not existing');
    $('p=None of the objects matched your search.').waitForDisplayed(1000);
    $('button.search-field__clear-button').click();
    PluginPopup.scrollTable(['End']);
    $('div=SQL Pass Performance').waitForDisplayed(1000);
    $('div=SQL Pass Performance').click();
    browser.debug();
    PluginPopup.clickRefreshObjectTable();
    browser.waitUntil(() => {
      return ($('button.loading').isExisting());
    });
    browser.waitUntil(() => {
      $('category-list-row disabled');
    })
    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Type', 'Dossier');
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    browser.waitUntil(() => {
      return !($('button.loading').isExisting());
    });
    // TODO: Check if filters are preserved after fetching is finished
    // expect($('.all-panel__content .category-list-row.disabled input').isSelected()).toBe(false);
  });
});
