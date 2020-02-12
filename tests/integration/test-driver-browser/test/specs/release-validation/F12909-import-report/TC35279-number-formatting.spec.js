import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';

const B2 = $('#gridRows > div:nth-child(2) > div:nth-child(2) > div > div');
const C2 = $('#gridRows > div:nth-child(2) > div:nth-child(3) > div > div');
const D2 = $('#gridRows > div:nth-child(2) > div:nth-child(4) > div > div');
const E2 = $('#gridRows > div:nth-child(2) > div:nth-child(5) > div > div');
const F2 = $('#gridRows > div:nth-child(2) > div:nth-child(6) > div > div');
const G2 = $('#gridRows > div:nth-child(2) > div:nth-child(7) > div > div');
const H2 = $('#gridRows > div:nth-child(2) > div:nth-child(8) > div > div');
const I2 = $('#gridRows > div:nth-child(2) > div:nth-child(9) > div > div');
const J2 = $('#gridRows > div:nth-child(2) > div:nth-child(10) > div > div');
const K2 = $('#gridRows > div:nth-child(2) > div:nth-child(11) > div > div');
const L2 = $('#gridRows > div:nth-child(2) > div:nth-child(12) > div > div');

describe('Import report', () => {
  beforeAll(async () => {
    browser.driver.manage().window().maximize();
    await OfficeWorksheet.openExcelHome();
    const url = await browser.getCurrentUrl();
    if (url.includes('login.microsoftonline')) {
      await OfficeLogin.login(officeCredentials.username, officeCredentials.password);
    }
    await OfficeWorksheet.createNewWorkbook();
    await OfficeWorksheet.openPlugin();
    await PluginRightPanel.loginToPlugin('a', '');
  });

  afterAll(async () => {
    await browser.close();
    const handles = await browser.getAllWindowHandles();
    await browser.switchTo().window(handles[0]);
  });

  it('Number Formatting', async () => {
    // should import Number Formatting object
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(objectsList.reports.numberFormating);
    await waitForNotification();
    await browser.sleep(2000);

    // should check if each section has specific number formating
    await OfficeWorksheet.selectCell('B2');
    const B2 = await rightPanelSelectors.B2.getText();
    await expect(B2).toContain('$4,560.00');

    await OfficeWorksheet.selectCell('C2');
    const C2 = await rightPanelSelectors.C2.getText();
    await expect(C2).toContain('34.67%');

    await OfficeWorksheet.selectCell('D2');
    const D2 = await rightPanelSelectors.D2.getText();
    await expect(D2).toContain('12/12/2019');

    await OfficeWorksheet.selectCell('E2');
    const E2 = await rightPanelSelectors.E2.getText();
    await expect(E2).toContain('5:11:29 PM');

    await OfficeWorksheet.selectCell('F2');
    const F2 = await rightPanelSelectors.F2.getText();
    await expect(F2).toContain('45/56');

    await OfficeWorksheet.selectCell('G2');
    const G2 = await rightPanelSelectors.G2.getText();
    await expect(G2).toContain('1.27E+08');

    await OfficeWorksheet.selectCell('H2');
    const H2 = await rightPanelSelectors.H2.getText();
    await expect(H2).toContain('1.23');

    await OfficeWorksheet.selectCell('I2');
    const I2 = await rightPanelSelectors.I2.getText();
    await expect(I2).toContain('1,345,654');

    await OfficeWorksheet.selectCell('J2');
    const J2 = await rightPanelSelectors.J2.getText();
    await expect(J2).toContain('-123');

    await OfficeWorksheet.selectCell('K2');
    const K2 = await rightPanelSelectors.K2.getText();
    await expect(K2).toContain('35');

    await OfficeWorksheet.selectCell('L2');
    const L2 = await rightPanelSelectors.L2.getText();
    await expect(L2).toContain('1,232 PLN ');
  });
});
