import OfficeLogin from '../../../pageObjects/office/office.login';
import OfficeWorksheet from '../../../pageObjects/office/office.worksheet';
import PluginRightPanel from '../../../pageObjects/plugin/plugin.right-panel';
import PluginPopup from '../../../pageObjects/plugin/plugin.popup';
import { waitForNotification } from '../../../pageObjects/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o} from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';



describe('Error Handling - IMPORT - ', function() {
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

  it('[TC34506] [Insert Objects] [Error Handling] Importing a not supported cubes', async () => {
    // should display a correct error message when importing not supported cube
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(o.datasets.notSupportedCube);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.emptyObject);
    await PluginRightPanel.closeNotification();
  });
});
