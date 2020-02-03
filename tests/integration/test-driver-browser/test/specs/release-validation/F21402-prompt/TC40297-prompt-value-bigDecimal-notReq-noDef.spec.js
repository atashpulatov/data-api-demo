import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { selectors as s } from '../../../constants/selectors/popup-selectors';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';


describe('[TC40297] Prompt | Value | Big Decimal | Not Required | No Default Answer', () => {
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

  it('[TC40297] should import a report', async () => {
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.openPrompt(o.reports.bigDecimalPromptedReport);
    await s.valueInput.sendKeys('1820\uE004\uE004\uE006'); // sends value, tab, enter to press Run
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
