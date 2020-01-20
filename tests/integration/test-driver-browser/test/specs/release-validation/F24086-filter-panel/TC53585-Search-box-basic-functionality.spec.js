import OfficeLogin from '../../../pageObjects/office/office.login';
import OfficeWorksheet from '../../../pageObjects/office/office.worksheet';
import PluginRightPanel from '../../../pageObjects/plugin/plugin.right-panel';
import PluginPopup from '../../../pageObjects/plugin/plugin.popup';
import { waitForNotification, waitAndClick } from '../../../pageObjects/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o} from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { selectors as ExSe } from '../../../constants/selectors/popup-selectors';


describe('[TC53585] Search box basic functionality', () => {
  beforeEach(() => {
    browser.setWindowSize(1900,900);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login('test3@mstrtesting.onmicrosoft.com', 'FordFocus2019');
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    PluginRightPanel.loginToPlugin('administrator', '');
  });
  afterAll(() => {
    browser.closeWindow();
    const handles =  browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('[TC53585] Search box basic functionality', () => {
    console.log("Wololo");
    PluginRightPanel.clickImportDataButton();
    PluginPopup.searchForObject('seasonal');
    browser.pause(1111); //Without waits it checks names before searching is completed, still not filtered items are present
    PluginPopup.clickHeader('Name');
    expect(PluginPopup.checkIfNamesContainString('seasonal')).toBe(true);
    PluginPopup.clickHeader('Application');
    expect(PluginPopup.checkIfNamesContainString('seasonal')).toBe(true);
    PluginPopup.clickHeader('Owner');
    expect(PluginPopup.checkIfNamesContainString('seasonal')).toBe(true);
    PluginPopup.clearSearchInput();
    expect(PluginPopup.checkIfSearchIsEmpty()).toBe(true);
    PluginPopup.searchForObject(o.reports.seasonalReportID);
    browser.pause(1111);
    expect(PluginPopup.checkIfColumnIsExactly(ExSe.columnName, 'Seasonal Report')).toBe(true);
  });
});
