import OfficeLogin from '../../helpers/office/office.login';
import OfficeWorksheet from '../../helpers/office/office.worksheet';
import PluginRightPanel from '../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../helpers/plugin/plugin.popup';
import { changeBrowserTab } from '../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../helpers/utils/wait-helper';
import { objectsList } from '../../constants/objects-list';
import { excelSelectors } from '../../constants/selectors/office-selectors';

describe('F12909 - Ability to import a report from MicroStrategy', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('Number Formatting', () => {
    // should import Number Formatting object
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importAnyObject(objectsList.reports.numberFormating, 1);
    waitForNotification();
    browser.pause(2000);

    // should check if each section has specific number formating
    OfficeWorksheet.selectCell('B2');
    const B2 = $(excelSelectors.getCell(2, 2)).getText();
    expect(B2).toContain('$4,560.00');

    OfficeWorksheet.selectCell('C2');
    const C2 = $(excelSelectors.getCell(3, 2)).getText();
    expect(C2).toContain('34.67%');

    OfficeWorksheet.selectCell('D2');
    const D2 = $(excelSelectors.getCell(4, 2)).getText();
    expect(D2).toContain('12/12/2019');

    OfficeWorksheet.selectCell('E2');
    const E2 = $(excelSelectors.getCell(5, 2)).getText();
    expect(E2).toContain('5:11:29 PM');

    OfficeWorksheet.selectCell('F2');
    const F2 = $(excelSelectors.getCell(6, 2)).getText();
    expect(F2).toContain('45/56');

    OfficeWorksheet.selectCell('G2');
    const G2 = $(excelSelectors.getCell(7, 2)).getText();
    expect(G2).toContain('1.27E+08');

    OfficeWorksheet.selectCell('H2');
    const H2 = $(excelSelectors.getCell(8, 2)).getText();
    expect(H2).toContain('1.23');

    OfficeWorksheet.selectCell('I2');
    const I2 = $(excelSelectors.getCell(9, 2)).getText();
    expect(I2).toContain('1,345,654');

    OfficeWorksheet.selectCell('J2');
    const J2 = $(excelSelectors.getCell(10, 2)).getText();
    expect(J2).toContain('-123');

    OfficeWorksheet.selectCell('K2');
    const K2 = $(excelSelectors.getCell(11, 2)).getText();
    expect(K2).toContain('35');

    OfficeWorksheet.selectCell('L2');
    const L2 = $(excelSelectors.getCell(12, 2)).getText();
    expect(L2).toContain('1,232 PLN ');
  });
});
