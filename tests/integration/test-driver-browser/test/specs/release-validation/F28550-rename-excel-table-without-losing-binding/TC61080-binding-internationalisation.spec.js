import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToDialogFrame, switchToExcelFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { removeTimestampFromTableName } from '../../../helpers/utils/tableName-helper';
import { getTextOfNthObjectOnNameBoxList } from '../../../helpers/utils/excelManipulation-helper';
import { objectsList } from '../../../constants/objects-list';
import { excelSelectors } from '../../../constants/selectors/office-selectors';
import { pressEscape } from '../../../helpers/utils/keyboard-actions';
import { dictionary } from '../../../constants/dictionaries/dictionary';

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
    const srcNAmes = Object.values(bindingInternationalisation).map(object => object.sourceName);
    const excelTableNameStarts = Object.values(bindingInternationalisation).map(object => object.excelTableNameStart);
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

      console.log(`Should import ${srcNAmes[i]}`);
      PluginPopup.switchLibrary(false);
      PluginPopup.importObject(srcNAmes[i]);
      browser.pause(10000);

      console.log('Assert binding');
      const number = Number(i) + 1;
      const importedSecondTableName = getTextOfNthObjectOnNameBoxList(number);
      const normalizedSecondTableName = removeTimestampFromTableName(importedSecondTableName);
      console.log(excelTableFullNames[i]);
      expect(normalizedSecondTableName).toEqual(excelTableFullNames[i]);

      pressEscape();
      PluginRightPanel.clickObjectInRightPanelAndAssert(1, 'A2');

      // afterEach
      browser.pause(100);
      console.log(`${srcNAmes[i]} successfully imported`);
      OfficeWorksheet.openNewSheet();
      browser.pause(1000);
    });
  });
});
