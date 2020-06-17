import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';

describe('Smart Folder - SORT - ', () => {
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

  it('[TC39453] Sort datasets', async () => {
    // should assert datasets are sorted by Modified column in ascending order
    await PluginRightPanel.clickImportDataButton();
    await browser.sleep(3000);
    await switchToPluginFrame();
    await PluginPopup.clickHeader('Modified');
    await PluginPopup.clickHeader('Modified');
    await PluginPopup.checkSorting('up', 'modified');

    // should assert datasets are sorted by Application column in ascending order
    await PluginPopup.clickHeader('Application');
    await PluginPopup.checkSorting('up', 'application');

    // should assert datasets are sorted by Application column in descending order
    await PluginPopup.clickHeader('Application');
    await PluginPopup.checkSorting('down', 'application');

    // should assert datasets are sorted by Owner column in ascending order
    await PluginPopup.clickHeader('Owner');
    await PluginPopup.checkSorting('up', 'owner');

    // should assert datasets are sorted by Owner column in descending order
    await PluginPopup.clickHeader('Owner');
    await PluginPopup.checkSorting('down', 'owner');

    // should assert datasets are sorted by Name column in ascending order
    await PluginPopup.clickHeader('Name');
    await PluginPopup.checkSorting('up', 'name');

    // should assert datasets are sorted by Name column in descending order
    await PluginPopup.clickHeader('Name');
    await PluginPopup.checkSorting('down', 'name');
  });
});
