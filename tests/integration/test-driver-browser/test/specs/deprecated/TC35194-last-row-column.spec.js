import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';


describe('Error Handling - IMPORT - ', () => {
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

  it('[TC35194] Importing objects in the last row/column', async () => {
    // should display a correct error message when importing into the last row
    await OfficeWorksheet.selectCell('A1048576');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(objectsList.reports.reportXML);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.excelLimit);
    await PluginRightPanel.closeNotification();

    // should display a correct error message when importing into the last column
    await OfficeWorksheet.selectCell('XFD1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(objectsList.reports.reportXML);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.excelLimit);
    await PluginRightPanel.closeNotification();
  });
});
