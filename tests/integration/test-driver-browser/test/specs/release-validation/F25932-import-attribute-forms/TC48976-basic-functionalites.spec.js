import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame, switchToRightPanelFrame, switchToPopupFrame, switchToPromptFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import settings from '../../../config';
import { objectsList as o } from '../../../constants/objects-list';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';

describe('TC59987 - Import attribute forms', () => {
  beforeAll(() => {
    browser.setWindowSize(1700, 900);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login(settings.officeOnline.username, settings.officeOnline.password);
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    switchToPluginFrame();
    $(rightPanelSelectors.loginRightPanelBtn).waitForDisplayed(7777);
    if ($(rightPanelSelectors.loginRightPanelBtn).isExisting()) {
      PluginRightPanel.clickLoginRightPanelBtn();
      const handles = browser.getWindowHandles();
      browser.switchToWindow(handles[2]); // TODO: create help function to switch tabs
      $(rightPanelSelectors.usernameInput).setValue('Invalid Username');
      $(rightPanelSelectors.passwordInput).setValue('Invalid Password');
      PluginRightPanel.clickLoginPopUpBtn();
      browser.pause(2222);
      waitAndClick($('#ActionLinkContainer'));
      $(rightPanelSelectors.usernameInput).setValue('b');
      $(rightPanelSelectors.passwordInput).setValue('');
      PluginRightPanel.clickLoginPopUpBtn();
      browser.switchToWindow(handles[1]);
    }
    browser.pause(2222);
    switchToRightPanelFrame();
    waitAndClick($('#accept-cookies-btn'));
    browser.pause(2222);
    PluginRightPanel.clickLoginRightPanelBtn();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[2]);
    $(rightPanelSelectors.usernameInput).setValue('a');
    $(rightPanelSelectors.passwordInput).setValue('');
    PluginRightPanel.clickLoginPopUpBtn();
    browser.pause(2222);
    browser.switchToWindow(handles[1]);
  });


  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('Display attribute forms', () => {
    const firstObject = '#overlay > div > section > div > div.tables-container > div:nth-child(1)';
    const firstRefreshIcon = $('#overlay > div > section > div > div.tables-container > div:nth-child(1) > div.refresh-icons-row > span.object-icons > span:nth-child(2) > span');
    const datasetFilter = 'label=Dataset';
    const removeIcon = '.mstr-icon.trash';
    const O3 = '#gridRows > div:nth-child(3) > div:nth-child(15) > div > div';
    switchToRightPanelFrame();
    $(rightPanelSelectors.importDataBtn).waitForDisplayed(3000, false);
    PluginRightPanel.clickImportDataButton();
    switchToPluginFrame();
    $(popupSelectors.myLibrary).waitForDisplayed(2000, false);
    PluginPopup.switchLibrary(false);
    PluginPopup.searchForObject(o.reports.filtered);
    PluginPopup.searchForObject('Invalid report');
    browser.pause(500);
    $(popupSelectors.searchInput).clearValue();
    PluginPopup.searchForObject(o.reports.report1k);
    PluginPopup.selectFirstObject();
    PluginPopup.clickPrepareData();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.selectFilters([['Sales Channel', []]])
    browser.pause(500);
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
    $(datasetFilter).waitForDisplayed(1000, false)
    waitAndClick($(datasetFilter));
    PluginPopup.searchForObject(o.datasets.cubeLimitProject);
    PluginPopup.searchForObject('Invalid Object')
    $(popupSelectors.searchInput).clearValue();
    PluginPopup.searchForObject(o.datasets.basicDataset);
    PluginPopup.selectFirstObject();
    PluginPopup.clickPrepareData();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.selectFilters([['Region', ['Europe', 'Asia']]])
    browser.pause(1000);
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
    switchToExcelFrame();
    OfficeWorksheet.selectCell('O3')
    expect($(O3).getText()).toEqual('2/23/2015');
    browser.pause(1000);
    switchToRightPanelFrame();
    waitAndClick($(firstObject));
    $(rightPanelSelectors.importedObjectNameList).doubleClick();
    $(rightPanelSelectors.importedObjectNameList).moveTo();
    browser.pause(1000);
    firstRefreshIcon.waitForDisplayed(3000, false);
    firstRefreshIcon.moveTo();
    waitAndClick(firstRefreshIcon);
    browser.pause(5000);
    waitAndClick($(firstObject));
    ($(rightPanelSelectors.editBtn)).waitForDisplayed(5000, false);
    PluginRightPanel.edit();
    browser.pause(1000);
    switchToPluginFrame();
    browser.pause(1000);
    PluginPopup.selectObjectElements(['Country', 'Item Type', 'Sales Channel', 'Ship Date', 'Units Sold']);
    PluginPopup.selectFilters([['Country', ['Angola', 'Albania', 'Bangladesh']]])
    PluginPopup.clickImport();
    waitForNotification();
    $(removeIcon).moveTo();
    waitAndClick($(removeIcon));
    browser.pause(2000);
    switchToPluginFrame();
    PluginRightPanel.logout();
    browser.pause(2000);
  });
});
