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
    await PluginRightPanel.loginToPlugin('a', '');
  });

  afterAll(async () => {
    await browser.close();
    const handles = await browser.getAllWindowHandles();
    await browser.switchTo().window(handles[0]);
  });


  it('[TC39220] Logout of office plugin', async () => {
    // should log out of the plugin
    await switchToPluginFrame();
    await PluginRightPanel.logout();
    await browser.sleep(2222);
    await expect(se.pluginImage.isDisplayed()).toBe(true);
    await expect(se.loginRightPanelBtn.isDisplayed()).toBe(true);
  });
});
