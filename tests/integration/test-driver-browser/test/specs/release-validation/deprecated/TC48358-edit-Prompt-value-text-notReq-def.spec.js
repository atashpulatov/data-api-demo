import OfficeLogin from '../../../pageObjects/office/office.login';
import OfficeWorksheet from '../../../pageObjects/office/office.worksheet';
import PluginRightPanel from '../../../pageObjects/plugin/plugin.right-panel';
import PluginPopup from '../../../pageObjects/plugin/plugin.popup';
import { waitForNotification } from '../../../pageObjects/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { browser } from 'protractor';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import {excelSelectors as ex} from '../../../constants/selectors/office-selectors';

describe('[TC48358] [Edit data] Editing a prompted report (with prompt - Value|Text|Not required|Default answer)', function() {
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

  it('[TC48358] should edit a report', async () => {
    //should import prompted report
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importPromptDefault(o.reports.textPromptedReport);
    await waitForNotification();

    await PluginRightPanel.editFirstObjectFromTheList();
    await PluginPopup.selectObjectElements(['Region', 'Profit']);
    await PluginPopup.clickImport();
    await browser.sleep(3000);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    await browser.sleep(5555);

    // should check if the report was edited properly
    await OfficeWorksheet.selectCell('A2');
    const A2 = await ex.A2.getText();
    await expect(A2).toContain('Books');
  });
});
