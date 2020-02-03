import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o } from '../../../constants/objects-list';
import { selectors as s } from '../../../constants/selectors/popup-selectors';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';

describe('[TC40294] Prompt | Value | Date & Time | Not required | No Default Answer', () => {
  beforeAll(async () => {
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

  it('[TC40294] should import a report', async () => {
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.openPrompt(o.reports.valueDayPromptReport);
    await s.valueInput.sendKeys('07/07/2015\uE004\uE004\uE004\uE006'); // sends date, tab, tab, enter to press Run
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
