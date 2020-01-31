import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';

describe('Refresh - ', function() {
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

    it('TC48136 [Refresh] Refresh a report with prompt - Multiple prompts', async () => {
        // should import a report
        await OfficeWorksheet.selectCell('A1');
        await PluginRightPanel.clickImportDataButton();
        await PluginPopup.openPrompt(o.reports.multiplePromptsReport);
        await PluginPopup.writeMultiPrompt('07/07/2015\uE004\uE004');
        await waitForNotification();
        await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    
        // should refresh the report
        await PluginRightPanel.refreshFirstObjectFromTheList();
        await waitForNotification();
        await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.reportRefreshed);
      });
    });