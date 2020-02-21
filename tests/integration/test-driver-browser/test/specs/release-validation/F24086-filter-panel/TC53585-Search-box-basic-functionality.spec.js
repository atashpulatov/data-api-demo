import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { writeDataIntoFile, getJsonData } from '../../../helpers/utils/benchmark-helper';
import { objects as o } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { selectors as s } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import settings from '../../../config';


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
    PluginRightPanel.loginToPlugin('a', '');
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
