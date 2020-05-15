import OfficeLogin from '../../../../helpers/office/office.login';
import OfficeWorksheet from '../../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../../helpers/utils/wait-helper';
import { dictionary } from '../../../../constants/dictionaries/dictionary';
import { waitAndClick } from '../../../../helpers/utils/click-helper';
import { objectsList } from '../../../../constants/objects-list';
import { rightPanelSelectors } from '../../../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../../../constants/selectors/popup-selectors';

describe('[TC49530] Re-Prompt after import | Expression | Metric Qualification | Required | No Default Answer', () => { // WORK IN PROGRESS
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
    await PluginPopup.openPrompt(objectsList.reports.metricExpPromptedReport);
    await waitAndClick($('div[title="- none -"]'));
    await waitAndClick($('div[title="Revenue"]'));
    await popupSelectors.promptTextBox.sendKeys('1000\uE004\uE004\uE004\uE006');
  });

  afterAll(async () => {
    await browser.close();
    const handles = await browser.getAllWindowHandles();
    await browser.switchTo().window(handles[0]);
  });

  it('[TC49530] should re-prompt a report with different data', async () => {
    await browser.sleep(2222);
    await waitForNotification();
    await OfficeWorksheet.selectCell('A1');
    const oldCellD2 = await $('#gridRows > div:nth-child(2) > div:nth-child(4) > div > div').getText();
    await PluginRightPanel.repromptFirstObjectFromTheList();
    await browser.sleep(5555);
    await PluginPopup.writeAttrQualificationValue(10000);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    await OfficeWorksheet.selectCell('A1');
    const newCellD2 = await $('#gridRows > div:nth-child(2) > div:nth-child(4) > div > div').getText();
    await expect(oldCellD2).not.toEqual(newCellD2);
  });
});
