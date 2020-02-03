import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';


describe('[TC40298] Prompt | Attribute Element | Required | No Default Answer', () => {
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

  it('[TC40298] should import a report', async () => {
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.openPrompt(o.reports.attributePromptedReport);
    await waitAndClick($('.mstrBGIcon_tbAdd'));
    await PluginPopup.clickRun();
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
