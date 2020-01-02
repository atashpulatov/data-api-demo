import OfficeLogin from '../../../pageObjects/office/office.login';
import OfficeWorksheet from '../../../pageObjects/office/office.worksheet';
import PluginRightPanel from '../../../pageObjects/plugin/plugin.right-panel';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToPluginFrame } from '../../../pageObjects/utils/iframe-helper';

describe('Login - ', function() {
  beforeAll(async () => {
    await OfficeWorksheet.openExcelHome();
    const url = await browser.getCurrentUrl();
    if (url.includes('login.microsoftonline')) {
      await OfficeLogin.login(officeCredentials.username, officeCredentials.password);
    }
    await OfficeWorksheet.createNewWorkbook();
    await OfficeWorksheet.openPlugin();
  });

  afterAll(async () => {
    await browser.close();
    const handles = await browser.getAllWindowHandles();
    await browser.switchTo().window(handles[0]);
  });

  it('[TC39214] Standard positive login', async () => {
    // should login to plugin
    if ((await se.settingsBtn.isPresent())) {
      await PluginRightPanel.logout();
    }
    await PluginRightPanel.loginToPlugin('a', '');
    await switchToPluginFrame();
    await browser.sleep(3333);
    await expect(se.importDataBtn.isPresent()).toBe(true);
    await expect(se.settingsBtn.isPresent()).toBe(true);
  });
});
