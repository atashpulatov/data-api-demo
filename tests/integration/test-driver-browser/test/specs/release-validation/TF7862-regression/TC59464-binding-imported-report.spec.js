import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import settings from '../../../config';
import { objects } from '../../../constants/objects-list';
import { selectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { removeTimestampFromTableName } from '../../../helpers/utils/tableName-helper';

describe('F28550 - Excel Connector Hardening: Rename Excel table without losing binding', () => {
  beforeEach(() => {
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
    browser.pause(4000);
    switchToPluginFrame();
    PluginPopup.importObject(objects.reports.longReportWithInvalidCharacters, false);
    browser.pause(4000);
    waitForNotification();
    switchToExcelFrame();
    waitAndClick($('#m_excelWebRenderer_ewaCtl_NameBox-Medium > a'), 4000);
    const importedTableName = $('[id^=_01___________________________________Report_for_testing_binding_and_special_characters]> span').getText();
    const normalizedTableName = removeTimestampFromTableName(importedTableName);
    expect(normalizedTableName).toEqual('_01___________________________________Report_for_testing_binding_and_special_characters______________________________________________________________________Report_for_testing_binding_and_special_characters_________________________testtestt_TIMESTAMP');
  });
});
