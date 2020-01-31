import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';

describe('[TC49529] Re-Prompt after import | Expression | Hierarchy Qualification | Not required | Default answer', function() {
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
    await PluginPopup.importPromptDefault(o.reports.hierarchyExpPromptedReport);
  });

  afterAll(async () => {
    await browser.close();
    const handles = await browser.getAllWindowHandles();
    await browser.switchTo().window(handles[0]);
  });

  it('[TC49529] should re-prompt a report with different data', async () => {
    await browser.sleep(2222);
    await waitForNotification();
    await OfficeWorksheet.selectCell('A1');
    const oldCellC2 = await $('#gridRows > div:nth-child(2) > div:nth-child(3) > div > div').getText();
    await PluginRightPanel.repromptFirstObjectFromTheList();
    await browser.sleep(5555);
    await PluginPopup.changeExpressionQualificationAndRun('Not In List');
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    await OfficeWorksheet.selectCell('A1');
    const newCellC2 = await $('#gridRows > div:nth-child(2) > div:nth-child(3) > div > div').getText();
    await expect(oldCellC2).not.toEqual(newCellC2);
  });
});
