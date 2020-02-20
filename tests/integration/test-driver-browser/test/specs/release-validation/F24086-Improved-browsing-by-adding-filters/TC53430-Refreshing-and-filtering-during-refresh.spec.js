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
    // browser.debug();
    PluginPopup.selectFirstObject();
    PluginPopup.clickRefreshObjectTable();
    // apply filters
    browser.pause(999);
    PluginPopup.clickFilterButton();
    browser.pause(999);
    // browser.debug();
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    PluginPopup.tickFilterCheckBox('Type', 'Report');
    browser.pause(150);
    // browser.debug();
    expect($('div.FilterResult > strong').getText()).toEqual('938');
    // browser.debug();
    // // scroll bottom
    // browser.pause(999);
    // PluginPopup.clickFilterButton();
    browser.pause(999);

    PluginPopup.scrollTable(['End']);
    browser.pause(999);

    $('div=SQL Pass Performance').click();
    browser.pause(999);
    PluginPopup.clickHeader('Name');
    browser.pause(999);
    PluginPopup.clickFilterButton();
    browser.pause(999);
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickClearAll();
    PluginPopup.clickFilterButton();
    PluginPopup.scrollTable(['End']);
    browser.pause(999);
    $('div=Zip Code Validation').click();
    browser.pause(999);
    PluginPopup.clickRefreshObjectTable();
    PluginPopup.clickFilterButton();
    browser.pause(5000);
    PluginPopup.scrollTable(['End']);
    browser.pause(999);
    $('div=SQL Pass Performance').click();
    PluginPopup.clickRefreshObjectTable();
    browser.pause(999);
    PluginPopup.searchForObject('something not existing'); // TODO: Assert no objects message
    expect($('p=None of the objects matched your search.')).toBeDefined();
    browser.pause(5000);
    $('button.search-field__clear-button').click();
    browser.pause(5000);
    PluginPopup.scrollTable(['End']);
    browser.pause(999);
    $('div=SQL Pass Performance').click();
    PluginPopup.clickRefreshObjectTable();
    PluginPopup.clickFilterButton();
    browser.pause(2000); // FIXME: very time dependent
    PluginPopup.tickFilterCheckBox('Type', 'Dossier');
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    // expect($('.all-panel__content .category-list-row.disabled input').isSelected()).toBe(false);
  });
});
