import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame, switchToRightPanelFrame, switchToPopupFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
// import { popupSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import settings from '../../../config';
import { objectsList as o } from '../../../constants/objects-list';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';

describe('TC59987 - Import attribute forms', () => {
  beforeAll(() => {
    // const incorrectPassword = 'mstr-password'
    // browser.setWindowSize(1900, 900);
    // OfficeWorksheet.openExcelHome();
    // const url = browser.getUrl();
    // if (url.includes('login.microsoftonline')) {
    //   OfficeLogin.login(settings.officeOnline.username, settings.officeOnline.password);
    // }
    // OfficeWorksheet.createNewWorkbook();
    // // OfficeWorksheet.openPlugin();
    // // PluginRightPanel.loginToPlugin(settings.env.username, incorrectPassword);
    // // browser.pause(2000);
    // // waitAndClick($('#ActionLinkContainer'));
    // // PluginRightPanel.loginToPlugin(settings.env.username, settings.env.password);
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('Display attribute forms', () => {
    switchToRightPanelFrame();
    PluginRightPanel.clickImportDataButton();
    switchToPluginFrame();
    PluginPopup.switchLibrary(false);
    PluginPopup.searchForObject(o.reports.filtered);
    PluginPopup.searchForObject('Apple');
    $(popupSelectors.searchInput).clearValue();
    PluginPopup.searchForObject(o.reports.report1k);
    PluginPopup.selectFirstObject();
    PluginPopup.clickPrepareData();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.selectFilters([['Country', []]]);
    $('#root > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-12 > div > div:nth-child(2) > div > div.checkbox-list.all-showed > div > div > label > input[type=checkbox]').waitForDisplayed(1000, false)
    PluginPopup.selectAllFilters();

    PluginPopup.searchForElements('Item Type');
    PluginPopup.searchForElements('Invalid metric');
    $(popupSelectors.searchInputPrepareDataPopup).clearValue();
    PluginPopup.clickViewSelected();
    PluginPopup.clickDataPreview();
    ($(popupSelectors.closePreviewBtn)).waitForDisplayed(1000, false)
    PluginPopup.closePreview();
    browser.pause(1000);
    PluginPopup.clickImport();
    waitForNotification();
    browser.pause(1000);
    OfficeWorksheet.selectCellAlternatively('M1');
    browser.pause(1000);
    PluginRightPanel.clickAddDataButton();
    switchToPluginFrame();
    PluginPopup.switchLibrary(false);
    waitAndClick($('#Filter'));
    ($('label=Dataset')).waitForDisplayed(1000, false)
    waitAndClick($('label=Dataset'));
    PluginPopup.searchForObject(o.datasets.cubeLimitProject);
    PluginPopup.searchForObject('Google')
    $(popupSelectors.searchInput).clearValue();
    PluginPopup.searchForObject(o.datasets.basicDataset);
    PluginPopup.selectFirstObject();
    PluginPopup.clickPrepareData();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.selectFilters([['Region', []]]);
    $('#root > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-12 > div > div:nth-child(2) > div > div.checkbox-list.all-showed > div > div > label > input[type=checkbox]').waitForDisplayed(3000, false)
    PluginPopup.selectAllFilters();
    $(popupSelectors.searchInputPrepareDataPopup).waitForDisplayed(3000, false);
    PluginPopup.searchForElements('Total Revenue');
    PluginPopup.searchForElements('Invalid attribute');
    $(popupSelectors.searchInputPrepareDataPopup).clearValue();
    PluginPopup.clickViewSelected();
    PluginPopup.clickDataPreview();
    ($(popupSelectors.closePreviewBtn)).waitForDisplayed(1000, false)
    PluginPopup.closePreview();
    browser.pause(1000);
    PluginPopup.clickImport();
    waitForNotification();
    browser.pause(1000);
    switchToRightPanelFrame();
    // $(rightPanelSelectors.importedObjectNameList).doubleClick();
    $(rightPanelSelectors.importedObjectNameList).moveTo();
    browser.pause(1000);
    const firstRefreshIcon = $('#overlay > div > section > div > div.tables-container > div:nth-child(1) > div.refresh-icons-row > span.object-icons > span:nth-child(2) > span');
    firstRefreshIcon.waitForDisplayed(3000, false);
    firstRefreshIcon.moveTo();
    waitAndClick(firstRefreshIcon);
    browser.pause(5000);
    ($('.mstr-icon.edit')).waitForDisplayed(3000, false);
    PluginRightPanel.edit();
    switchToPluginFrame();
    browser.pause(5000);
    // PluginPopup.selectObjectElements(['Country', 'Unit Cost']);
    // PluginPopup.prepareObject(o.datasets.basicDataset, ['Country', 'Unit Cost'], [['Country', ['Angola', 'Albania', 'Bangladesh']], ['Region', ['Europe', 'Asia']]]);
    // waitAndClick($('span=Country'));
    // waitAndClick($('span=Unit Cost'));
    // PluginPopup.clickImport();
    // waitForNotification();
    browser.pause(4000);
    // waitAndClick($('.mstr-icon.trash'));
    // browser.pause(2000);
    // switchToPluginFrame();
    // PluginRightPanel.logout();
    // browser.pause(2000);
  });
});
