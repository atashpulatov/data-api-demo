import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame, switchToPopupFrame } from '../../../helpers/utils/iframe-helper';
import { writeDataIntoFile, getJsonData } from '../../../helpers/utils/benchmark-helper';
import { objects as o } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { excelSelectors as es } from '../../../constants/selectors/office-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import settings from '../../../config';

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
    OfficeWorksheet.selectCell('A3');
    PluginRightPanel.clickImportDataButton();
    browser.pause(5000);
    switchToPluginFrame();
    PluginPopup.importObject('01. • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«». • !#$%&\'()*+,-:;<=>@^`{|}~¢£¥¬«» Report for testing binding and special characters . • !#$%&\'()*+,-:;<=>@/`testtesttes/km123456', false);
    waitForNotification();
    switchToExcelFrame();
    waitAndClick($('#m_excelWebRenderer_ewaCtl_NameBox-Medium > a'), 4000);
    // browser.keys('\uE05B');
    const importedTableName = $('[id^=_01___________________________________Report_for_testing_binding_and_special_characters]> span').getText();
    const normalizedTableName = importedTableName.replace(/\d{13}\b/, 'TIMESTAMP'); // searches for 13 digits at the end of the string and replaces them with "TIMESTAMP" - this is in order make the string universal for testing
    expect(normalizedTableName).toEqual('_01___________________________________Report_for_testing_binding_and_special_characters______________________________________________________________________Report_for_testing_binding_and_special_characters_________________________testtestt_TIMESTAMP');
  });
});
