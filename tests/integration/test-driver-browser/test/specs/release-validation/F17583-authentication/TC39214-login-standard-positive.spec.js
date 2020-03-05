import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';

describe('Login - ', () => {
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
    if ((await rightPanelSelectors.settingsBtn.isPresent())) {
      await PluginRightPanel.logout();
    }
    await PluginRightPanel.loginToPlugin('a', '');
    await switchToPluginFrame();
    await browser.sleep(3333);
    await expect(rightPanelSelectors.importDataBtn.isPresent()).toBe(true);
    await expect(rightPanelSelectors.settingsBtn.isPresent()).toBe(true);
  });
});
