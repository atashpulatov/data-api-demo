import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import {
  switchToDialogFrame, switchToExcelFrame, switchToRightPanelFrame, changeBrowserTab
} from '../../../helpers/utils/iframe-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { removeTimestampFromTableName } from '../../../helpers/utils/tableName-helper';
import { getTextOfNthObjectOnNameBoxList } from '../../../helpers/utils/excelManipulation-helper';
import { objectsList } from '../../../constants/objects-list';
import { excelSelectors } from '../../../constants/selectors/office-selectors';
import { pressEscape } from '../../../helpers/utils/keyboard-actions';


describe('F28550 - Excel Connector Hardening: Rename Excel table without losing binding', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC59464] - Checking binding for newly imported report with special characters and binding for importing the same report twice', () => {
    const { longReportWithInvalidCharacters } = objectsList.reports;
    OfficeWorksheet.selectCell('A2');
    PluginRightPanel.clickImportDataButton();

    switchToDialogFrame();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(longReportWithInvalidCharacters.sourceName);
    browser.pause(10000);

    switchToExcelFrame();
    waitAndClick($(excelSelectors.nameBoxDropdownButton), 4000);
    const importedFirstTableName = $(`[id^=${longReportWithInvalidCharacters.excelTableNameStart}]> span`).getText(); // searches for the beginning of the id's string only because of changing timestamps at the end
    const normalizedFirstTableName = removeTimestampFromTableName(importedFirstTableName);
    expect(normalizedFirstTableName).toEqual(longReportWithInvalidCharacters.excelTableFullName);

    pressEscape();
    PluginRightPanel.clickObjectInRightPanelAndAssert(1, 'A2');

    OfficeWorksheet.selectCell('I2');

    switchToRightPanelFrame();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject(longReportWithInvalidCharacters.sourceName);
    browser.pause(10000);

    const importedSecondTableName = getTextOfNthObjectOnNameBoxList(2);
    const normalizedSecondTableName = removeTimestampFromTableName(importedSecondTableName);
    expect(normalizedSecondTableName).toEqual(longReportWithInvalidCharacters.excelTableFullName);

    pressEscape();
    PluginRightPanel.clickObjectInRightPanelAndAssert(1, 'I2');
  });
});
