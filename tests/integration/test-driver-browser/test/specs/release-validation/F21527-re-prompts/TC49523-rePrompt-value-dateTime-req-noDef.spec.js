import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';


describe('[TC49523] Re-Prompt after import | Value | Date & Time | Not required | No Default Answer', () => {
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
    await PluginPopup.openPrompt(objectsList.reports.valueDayPromptReport);
    await PluginPopup.writeValueText('07/07/2015\uE004\uE004'); // function presses tab only once for re-prompt to work
  });

  afterAll(async () => {
    await browser.close();
    const handles = await browser.getAllWindowHandles();
    await browser.switchTo().window(handles[0]);
  });

  it('[TC49523] should re-prompt a report', async () => {
    await waitForNotification();
    await OfficeWorksheet.selectCell('A1');
    const oldCellA1 = await $('#gridRows > div:nth-child(2) > div:nth-child(4) > div > div').getText();
    await PluginRightPanel.repromptFirstObjectFromTheList();
    await browser.sleep(5555);
    await PluginPopup.writeValueText('9/9/2016\uE004');
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    await OfficeWorksheet.selectCell('A1');
    const newCellA1 = await $('#gridRows > div:nth-child(2) > div:nth-child(4) > div > div').getText();
    await expect(oldCellA1).not.toEqual(newCellA1);
  });
});
