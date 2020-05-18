import { browser } from 'protractor';
import OfficeLogin from '../../../../helpers/office/office.login';
import OfficeWorksheet from '../../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../../helpers/utils/wait-helper';
import { dictionary } from '../../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../../constants/objects-list';
import { rightPanelSelectors } from '../../../../constants/selectors/plugin.right-panel-selectors';

describe('[TC49525] Re-prompt after import | Value | Text | Not Required | Default', () => {
  beforeAll(async () => {
    await OfficeWorksheet.openExcelHome();
    const url = await browser.getCurrentUrl();
    if (url.includes('login.microsoftonline')) {
      await OfficeLogin.login(officeCredentials.username, officeCredentials.password);
    }
    await OfficeWorksheet.createNewWorkbook();
    await OfficeWorksheet.openPlugin();
    await PluginRightPanel.loginToPlugin('a', '');
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importPromptDefault(objectsList.reports.textPromptedReport);
    await waitForNotification();
  });
  afterAll(async () => {
    await browser.close();
    const handles = await browser.getAllWindowHandles();
    await browser.switchTo().window(handles[0]);
  });

  it('should re-prompt imported report correctly, and data is changed', async () => {
    await PluginRightPanel.repromptFirstObjectFromTheList();
    await browser.sleep(5555);
    await PluginPopup.writeValueText('Music');
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    await OfficeWorksheet.selectCell('A1');
    const cellA1 = await $('#gridRows > div:nth-child(2) > div:nth-child(2) > div > div').getText();
    await expect(cellA1).toBe('Music');
  });
});
