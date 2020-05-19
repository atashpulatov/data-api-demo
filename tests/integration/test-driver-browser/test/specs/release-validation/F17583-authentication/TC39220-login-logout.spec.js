import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';


describe('F17583 - Ability to Authenticate using Badge, SAML, LDAP and Kerberos', () => {
  beforeEach(() => {
    await OfficeWorksheet.openExcelHome();
    const url = await browser.getCurrentUrl();
    if (url.includes('login.microsoftonline')) {
      await OfficeLogin.login(officeCredentials.username, officeCredentials.password);
    }
    await OfficeWorksheet.createNewWorkbook();
    await OfficeWorksheet.openPlugin();
    await PluginRightPanel.loginToPlugin('a', '');
  });


  it('[TC39220] Logout of office plugin', async () => {
    // should log out of the plugin
    await switchToPluginFrame();
    await PluginRightPanel.logout();
    await browser.sleep(2222);
    await expect(rightPanelSelectors.pluginImage.isDisplayed()).toBe(true);
    await expect(rightPanelSelectors.loginRightPanelBtn.isDisplayed()).toBe(true);
  });
});
