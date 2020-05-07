import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';


describe('[TC40301] Prompt | Expression | Metric Qualification | Required | No Default Answer', () => { // WORK IN PROGRESS
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

  it('[TC40301] should import a report', async () => {
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.openPrompt(objectsList.reports.metricExpPromptedReport);
    await waitAndClick($('div[title="- none -"]'));
    await waitAndClick($('div[title="Revenue"]'));
    await popupSelectors.promptTextBox.sendKeys('10000\uE004\uE004\uE004\uE006');
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
