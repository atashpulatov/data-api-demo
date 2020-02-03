import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { objects as o } from '../../../constants/objects-list';


describe('Prepare Data - ', () => {
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

  it('[TC39460] Insert a dataset/report with data prepare', async () => {
    // should insert a dataset with data preparation
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.prepareObject(o.datasets.basicDataset, ['Order Date', 'Country', 'Region', 'Total Cost', 'Total Revenue'], [['Country', ['Angola', 'Albania', 'Bangladesh']], ['Region', ['Europe', 'Asia']]]);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should insert a report with data preparation
    await OfficeWorksheet.selectCell('A5');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.prepareObject(o.reports.basicReport, ['Order Date', 'Country', 'Region', 'Total Cost', 'Total Revenue'], [['Country', ['Angola', 'Albania', 'Bangladesh']], ['Region', ['Europe', 'Asia']]]);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
  });
});
