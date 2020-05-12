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
    // OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    // browser.closeWindow();
    // changeBrowserTab(0);
  });

  it('[TC61080] - Internationalisation', () => {
    const { bindingInternationalisation } = objectsList.reports;
    const sourceName = Object.keys(bindingInternationalisation).map(key => ({ [key]: bindingInternationalisation[key].sourceName }));
    OfficeWorksheet.selectCell('A2');

    Object.keys(sourceName).forEach(i => {
      OfficeWorksheet.selectCell('A1');
      let isFirstReport = true;
      if (isFirstReport) {
        PluginRightPanel.clickImportDataButton();
        isFirstReport = false;
      } else {
        PluginRightPanel.clickAddDataButton();
      }
      const excelTableNameStart = Object.keys(bindingInternationalisation).map(key => ({ [key]: bindingInternationalisation[key].excelTableNameStart }));
      console.log(excelTableNameStart[i]);
      const test = Object.keys(sourceName[i])[0];
      const visSelector = sourceName[i][test];

      PluginPopup.switchLibrary(false);
      PluginPopup.importObject(visSelector);

      // switchToExcelFrame();
      // waitAndClick($(excelSelectors.nameBoxDropdownButton), 4000);

      // const importedTableName = $(`[id^=${bindingInternationalisation.excelTableNameStart}]> span`).getText();
      // const normalizedTableName = removeTimestampFromTableName(importedTableName);
      // expect(normalizedTableName).toEqual(bindingInternationalisation.excelTableFullName);

    });
    // console.log(bindingInternationalisation.language[1]);

    // PluginRightPanel.clickImportDataButton();
    // browser.pause(4000);

    // PluginPopup.importAnyObject(bindingInternationalisation.sourceName);
    // browser.pause(4000);

    // switchToExcelFrame();
    // waitAndClick($(excelSelectors.nameBoxDropdownButton), 4000);

    // const importedTableName = $(`[id^=${bindingInternationalisation.excelTableNameStart}]> span`).getText();
    // const normalizedTableName = removeTimestampFromTableName(importedTableName);
    // expect(normalizedTableName).toEqual(bindingInternationalisation.excelTableFullName);
    browser.pause(100);
    console.log(`${test} successfully imported`);
    OfficeWorksheet.openNewSheet();
    browser.pause(1000);
  });
});
