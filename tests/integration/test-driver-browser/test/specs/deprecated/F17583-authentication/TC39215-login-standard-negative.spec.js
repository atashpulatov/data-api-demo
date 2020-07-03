import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';


describe('F17583 - Ability to Authenticate using Badge, SAML, LDAP and Kerberos', () => {
  beforeEach(() => {
    await OfficeWorksheet.openExcelHome();
    const url = await browser.getCurrentUrl();
    if (url.includes('login.microsoftonline')) {
      await OfficeLogin.login(officeCredentials.username, officeCredentials.password);
    }
    await OfficeWorksheet.createNewWorkbook();
    await OfficeWorksheet.openPlugin();
  });

  it('[TC39215] Standard negative login', async () => {
    // should log in with incorrect user credentials
    await switchToPluginFrame();
    if ((await rightPanelSelectors.settingsBtn.isPresent())) {
      await PluginRightPanel.logout();
    }
    await PluginRightPanel.loginToPlugin('abcd', 'abcd');
    const handles = await browser.getAllWindowHandles();
    await browser.switchTo().window(handles[2]);
    await expect(rightPanelSelectors.authErrorMessage.getAttribute('textContent')).toContain(dictionary.en.loginError);

    // should press "OK" button on the error message
    await waitAndClick(rightPanelSelectors.okButton);
    await browser.sleep(2000);
    await expect(rightPanelSelectors.authErrorBox.isDisplayed()).toBe(false);
    await expect(rightPanelSelectors.usernameInput.getAttribute('value')).toEqual('abcd');
    await expect(rightPanelSelectors.passwordInput.getAttribute('textContent')).toEqual('');
    await expect(rightPanelSelectors.pluginImage.isDisplayed()).toBe(true);
    await browser.switchTo().window(handles[1]);
  });
});
