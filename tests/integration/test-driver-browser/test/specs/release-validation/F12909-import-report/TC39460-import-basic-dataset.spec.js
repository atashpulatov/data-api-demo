import OfficeLogin from '../../../pageObjects/office/office.login';
import OfficeWorksheet from '../../../pageObjects/office/office.worksheet';
import PluginRightPanel from '../../../pageObjects/plugin/plugin.right-panel';
import PluginPopup from '../../../pageObjects/plugin/plugin.popup';
import { waitForNotification } from '../../../pageObjects/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o} from '../../../constants/objects-list';
import { selectors as se} from '../../../constants/selectors/plugin.right-panel-selectors';

describe('Smart Folder - IMPORT - ', function() {
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

  it('[TC39460] Import a dataset', async () => {
    // should import a dataset
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(o.datasets.datasetSQL);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    //  assert that cell D19 contain the value 44.659
    await OfficeWorksheet.selectCell('D19');
    await browser.sleep(2000);
    const cellD19 = await $('#gridRows > div:nth-child(19) > div:nth-child(4) > div > div').getText();
    await expect(cellD19).toBe('44.659');
  });
});