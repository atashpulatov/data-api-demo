import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';


describe('Error Handling - LOGIN - ', () => {
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

  it('[TC39215] Standard negative login', async () => {
    // should log in with incorrect user credentials
    await switchToPluginFrame();
    if ((await se.settingsBtn.isPresent())) {
      await PluginRightPanel.logout();
    }
    await PluginRightPanel.loginToPlugin('abcd', 'abcd');
    const handles = await browser.getAllWindowHandles();
    await browser.switchTo().window(handles[2]);
    await expect(se.authErrorMessage.getAttribute('textContent')).toContain(dictionary.en.loginError);

    // should press "OK" button on the error message
    await waitAndClick(se.okButton);
    await browser.sleep(2000);
    await expect(se.authErrorBox.isDisplayed()).toBe(false);
    await expect(se.usernameInput.getAttribute('value')).toEqual('abcd');
    await expect(se.passwordInput.getAttribute('textContent')).toEqual('');
    await expect(se.pluginImage.isDisplayed()).toBe(true);
    await browser.switchTo().window(handles[1]);
  });
});
