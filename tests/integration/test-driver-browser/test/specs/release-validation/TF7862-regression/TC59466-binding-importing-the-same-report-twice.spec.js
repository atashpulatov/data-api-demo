import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame, switchToRightPanelFrame } from '../../../helpers/utils/iframe-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { removeTimestampFromTableName } from '../../../helpers/utils/tableName-helper';
import { getTextOfNthObjectOnNameBoxList } from '../../../helpers/utils/excelManipulation-helper';
import { objectsList } from '../../../constants/objects-list';
import { excelSelectors } from '../../../constants/selectors/office-selectors';


describe('F28550 - Excel Connector Hardening: Rename Excel table without losing binding', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('[TC59464] - Checking binding for newly imported report', () => {
    const { basic01Report } = objectsList.reports;
    OfficeWorksheet.selectCell('A2');
    PluginRightPanel.clickImportDataButton();

    switchToPluginFrame();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(basic01Report.sourceName);
    browser.pause(10000);

    switchToExcelFrame();
    waitAndClick($(excelSelectors.nameBoxDropdownButton), 4000);
    const importedFirstTableName = $(`[id^=${basic01Report.excelTableNameStart}]> span`).getText(); // searches for the beginning of the id's string only because of changing timestamps at the end
    const normalizedFirstTableName = removeTimestampFromTableName(importedFirstTableName);
    expect(normalizedFirstTableName).toEqual(basic01Report.excelTableFullName);

    browser.keys('\uE00C');
    PluginRightPanel.clickOnObject(PluginRightPanel.SelectNthPlaceholder(1), 'A2');
    OfficeWorksheet.selectCell('I2');

    switchToRightPanelFrame();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(basic01Report.sourceName);
    browser.pause(10000);

    const importedSecondTableName = getTextOfNthObjectOnNameBoxList(2);
    const normalizedSecondTableName = removeTimestampFromTableName(importedSecondTableName);
    expect(normalizedSecondTableName).toEqual(basic01Report.excelTableFullName);

    browser.keys('\uE00C'); // Escape key
    PluginRightPanel.clickOnObject(PluginRightPanel.SelectNthPlaceholder(1), 'I2');
  });
});
