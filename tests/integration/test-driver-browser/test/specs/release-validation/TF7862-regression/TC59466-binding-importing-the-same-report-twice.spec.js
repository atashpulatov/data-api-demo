import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame, switchToRightPanelFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import settings from '../../../config';
import pluginRightPanel from '../../../helpers/plugin/plugin.right-panel';

describe('F28550 - Excel Connector Hardening: Rename Excel table without losing binding', () => {
  beforeEach(() => {
    // browser.setWindowSize(2200,900);
    browser.setWindowSize(1600, 900);
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

  it('[TC59464] - Checking binding for newly imported report', () => {
    OfficeWorksheet.selectCell('A2');
    PluginRightPanel.clickImportDataButton();
    switchToPluginFrame();
    PluginPopup.importObject('01 Basic Report', false);
    browser.pause(10000);
    switchToExcelFrame();
    waitAndClick($('#m_excelWebRenderer_ewaCtl_NameBox-Medium > a'), 4000);
    const importedFirstTableName = $('[id^=_01_Basic_Report]> span').getText(); // searches for the beginning of the id's string only because of changing timestamps at the end
    const normalizedFirstTableName = importedFirstTableName.replace(/\d{13}\b/, 'TIMESTAMP'); // searches for 13 digits at the end of the string and replaces them with "TIMESTAMP" - this is in order make the string universal for testing
    expect(normalizedFirstTableName).toEqual('_01_Basic_Report_TIMESTAMP');
    browser.keys('\uE00C');
    switchToPluginFrame();
    pluginRightPanel.clickOnObject($('#overlay > div > section > div > div.tables-container > div:nth-child(1)'), 'A2');
    OfficeWorksheet.selectCell('H2');
    switchToRightPanelFrame();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject('01 Basic Report', false);
    browser.pause(10000);
    switchToExcelFrame();
    waitAndClick($('#m_excelWebRenderer_ewaCtl_NameBox-Medium > a'), 4000);
    const importedSecondTableName = $('[id^=WacAirSpace] > div > div > div > ul > li:nth-child(2) > a > span').getText(); // more complicated selector the above due to both <li> elements having the same id (apart from the timestamp, which we cannot predict)
    const normalizedSecondTableName = importedSecondTableName.replace(/\d{13}\b/, 'TIMESTAMP'); // searches for 13 digits at the end of the string and replaces them with "TIMESTAMP" - this is in order make the string universal for testing
    expect(normalizedSecondTableName).toEqual('_01_Basic_Report_TIMESTAMP');
    browser.keys('\uE00C');
    switchToPluginFrame();
    pluginRightPanel.clickOnObject($('#overlay > div > section > div > div.tables-container > div:nth-child(1)'), 'H2');
  });
});
