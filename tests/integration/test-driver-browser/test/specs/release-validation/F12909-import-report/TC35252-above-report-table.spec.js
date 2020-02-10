import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';

describe('Error Handling - IMPORT', () => {
  beforeAll(async () => {
    await browser.driver.manage().window().maximize();
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

  it('[TC35252] - report above/nex to table', async () => {
    // should display proper error message for importing report above cells covering currently imported one
    await OfficeWorksheet.selectCell('A3');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(o.reports.basicReport);
    await waitForNotification();
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(o.reports.basicReport);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.rangeNotEmpty);
    await PluginRightPanel.closeNotification();

    // should display proper error message for importing report next to cells covering currently imported one
    await OfficeWorksheet.selectCell('R1');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(o.reports.basicReport);
    await waitForNotification();
    await OfficeWorksheet.selectCell('P1');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(o.reports.basicReport);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.rangeNotEmpty);
    await PluginRightPanel.closeNotification();
  });
})
