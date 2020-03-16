import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToRightPanelFrame, switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import settings from '../../../config';

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
    switchToPluginFrame();
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
    expect($('div.FilterResult > strong').getText())($('button.loading').isExisting())scrollTab!($('button.loading').!($('button.loading').isExisting()) highlighted
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
    PluginPopup.clickRefreshObjectTable(($('button.loading').isExisting()).loading')($('button.loading').isExisting()).loading').isExisting());
    }!($('button.loading').isExisting())g');
    $('p=None of the objects matched your search.').waitForDisplayed(1000);
    $('button.search-field__clear-button').click();
    PluginPopup.scrollTable(['En($('button.loading').isExisting())(1000);
    $('div=SQL Pass Per!($('button.loading').i($('button.loading').isExisting())ntil(() => {
      return ($('b!($('button.loading').isExisting())til(() => {
      $('category-list-row disabled');
    })
    PluginPopup.clickFilterButton();
    PluginPopup.tickFilterCheckBox('Type', 'Dossier');
    PluginPopup.clickAllButton('Owner');
    PluginPopup.clickSelectAll();
    browser.waitUntil(() => {
      return !($('button.loading')($('button.loading').isExisting())e preserved after fetching is finished
    // expect($('.all-panel__content .category-list-row.dis($('button.loading').isExisting())button.loading').isExisting())!($('button.loading').isExisting())