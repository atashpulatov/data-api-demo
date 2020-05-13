import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { removeTimestampFromTableName } from '../../../helpers/utils/tableName-helper';
import { getTextOfNthObjectOnNameBoxList } from '../../../helpers/utils/excelManipulation-helper';
import { objectsList } from '../../../constants/objects-list';
import { pressEscape } from '../../../helpers/utils/keyboard-actions';

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
    const language = Object.keys(bindingInternationalisation).map(key => ({ [key]: bindingInternationalisation[key] }));
    const sourceNames = Object.values(bindingInternationalisation).map(object => object.sourceName);
    const excelTableFullNames = Object.values(bindingInternationalisation).map(object => object.excelTableFullName);
    let isFirstReport = true;


    Object.keys(language).forEach(i => {
      OfficeWorksheet.selectCell('A2');
      if (isFirstReport) {
        PluginRightPanel.clickImportDataButton();
        isFirstReport = false;
      } else {
        PluginRightPanel.clickAddDataButton();
      }

      console.log(`Should import ${sourceNames[i]}`);
      PluginPopup.switchLibrary(false);
      PluginPopup.importObject(sourceNames[i]);
      browser.pause(10000);

      console.log('Assert binding');
      const number = Number(i) + 1;
      const importedSecondTableName = getTextOfNthObjectOnNameBoxList(number);
      const normalizedSecondTableName = removeTimestampFromTableName(importedSecondTableName);
      expect(normalizedSecondTableName).toEqual(excelTableFullNames[i]);

      pressEscape();
      PluginRightPanel.clickObjectInRightPanelAndAssert(1, 'A2');

      console.log('Should open new sheet');
      browser.pause(100);
      console.log(`${sourceNames[i]} successfully imported`);
      OfficeWorksheet.openNewSheet();
      browser.pause(1000);
    });
  });
});
