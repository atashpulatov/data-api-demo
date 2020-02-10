import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';


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
  it('[TC39600] Data preview', async () => {
    // should import a report
    await switchToExcelFrame();
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(o.reports.seasonalReport);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should select a supported report
    await OfficeWorksheet.selectCell('Y1');
    await switchToPluginFrame();
    await PluginRightPanel.clickAddDataButton();
    await switchToPluginFrame();
    await PluginPopup.searchForObject(o.reports.basicReport);
    await PluginPopup.selectFirstObject();
    await PluginPopup.clickPrepareData();

    // should select some metrics, attributes and values for filters
    await PluginPopup.selectObjectElements(['Units Sold', 'Region']);
    await PluginPopup.selectFilters([['Region', ['Europe', 'Asia']]]);

    // should click "Data Preview"
    await PluginPopup.clickDataPreview();
    await browser.sleep(2000);
    await expect($('#rcDialogTitle0').isDisplayed()).toBe(true);

    // should click "Close Preview"
    await PluginPopup.closePreview();
    await browser.sleep(2000);
    await expect($('#rcDialogTitle0').isDisplayed()).toBe(false);

    // should click "Cancel"
    await PluginPopup.clickCancel();
  });
});
