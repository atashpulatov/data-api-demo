import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { objects as o } from '../../../constants/objects-list';
import { selectors as s } from '../../../constants/selectors/popup-selectors';


describe('Prepare Data - ', function() {
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

  it('[TC39583] Preparing data with "View selected"', async () => {
    // should import a report
    await switchToExcelFrame();
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(o.reports.seasonalReport);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should select a supported report
    await switchToExcelFrame();
    await OfficeWorksheet.selectCell('Y1');
    await switchToPluginFrame();
    await PluginRightPanel.clickAddDataButton();
    await switchToPluginFrame();
    await PluginPopup.searchForObject(o.reports.basicReport);
    await PluginPopup.selectFirstObject();
    await PluginPopup.clickPrepareData();

    // should select some metrics, attrobutes and valuies for filters
    await PluginPopup.selectObjectElements(['Units Sold', 'Unit Price', 'Region']);
    await PluginPopup.selectFilters([['Region', ['Europe', 'Asia']]]);
    await browser.sleep(1000);

    // should click "View selected"
    await PluginPopup.clickViewSelected();
    await expect(PluginPopup.isViewSelected());

    // should enter a string
    await PluginPopup.searchForObject('Unit');
    const list = element.all(by.className('checkbox'));
    await expect(list.count()).toBe(2);

    // should click "Back"
    await PluginPopup.clickBack();
  });
});
