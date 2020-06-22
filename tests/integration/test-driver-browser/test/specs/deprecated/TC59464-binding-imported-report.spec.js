import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToDialogFrame, switchToExcelFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { objectsList } from '../../../constants/objects-list';
import { removeTimestampFromTableName } from '../../../helpers/utils/tableName-helper';
import { excelSelectors } from '../../../constants/selectors/office-selectors';

describe('F28550 - Excel Connector Hardening: Rename Excel table without losing binding', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC59464] - Checking binding for newly imported report', () => {
    const { longReportWithInvalidCharacters } = objectsList.reports;
    OfficeWorksheet.selectCell('A2');

    PluginRightPanel.clickImportDataButton();
    browser.pause(4000);

    switchToDialogFrame();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(longReportWithInvalidCharacters.sourceName);
    browser.pause(4000);

    switchToExcelFrame();
    waitAndClick($(excelSelectors.nameBoxDropdownButton), 4000);

    const importedTableName = $(`[id^=${longReportWithInvalidCharacters.excelTableNameStart}]> span`).getText();
    const normalizedTableName = removeTimestampFromTableName(importedTableName);
    expect(normalizedTableName).toEqual(longReportWithInvalidCharacters.excelTableFullName);
  });
});
