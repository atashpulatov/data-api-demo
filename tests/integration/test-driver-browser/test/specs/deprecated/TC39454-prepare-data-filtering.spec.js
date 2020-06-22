import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';

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

  it('[TC39454] Filtering prepare data', async () => {
    const list = element.all(by.className('checkbox'));

    // (1)should import a report from preconditions
    await switchToExcelFrame();
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(objectsList.reports.seasonalReport);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // (2,3)should select a supported report
    await switchToExcelFrame();
    await OfficeWorksheet.selectCell('Y1');
    await switchToPluginFrame();
    await PluginRightPanel.clickAddDataButton();
    await switchToPluginFrame();
    await PluginPopup.searchForObject(objectsList.reports.basicReport);
    await PluginPopup.selectObject();
    await PluginPopup.clickPrepareData();

    // (4) should enter a string that matches a name of some listed metrics
    await browser.sleep(2000);
    await PluginPopup.searchForObject('Units');
    await expect(list.count()).toBe(2);

    // (5) should click on "All" object in metrics column
    await PluginPopup.selectAllMetrics();
    await expect(element(by.cssContainingText('.selector-title', 'Metrics (1/6)')).isPresent()).toBe(true);

    // (6) should clear Search objects field
    await PluginPopup.deleteFromSearch();
    await browser.sleep(1000);
    await expect(list.count()).toBe(15);

    // (7) should enter a string that matches a name of some listed attributes
    await PluginPopup.searchForObject('Region');
    await expect(list.count()).toBe(2);

    // (8) should select one attribute
    await PluginPopup.selectObjectElements(['Region']);
    await expect(element(by.cssContainingText('.selector-title', 'Attributes (1/7)')).isPresent()).toBe(true);

    // (9) should clear Search objects field
    await PluginPopup.deleteFromSearch();
    await browser.sleep(1000);
    await expect(list.count()).toBe(15);

    // (10) should click on one filter
    await PluginPopup.selectFilters([['Region', []]]);

    // (11) should select one attribute
    await PluginPopup.selectObjectElements(['Country']);
    await expect(element(by.cssContainingText('.selector-title', 'Attributes (2/7)')).isPresent()).toBe(true);

    // (12) should click on one filter
    await PluginPopup.selectFilters([['Region', []]]);

    // (13)should enter a string that matches a name of some listed filter instances
    await PluginPopup.searchForObject('Asia');

    // (14) should select All in the last column
    await PluginPopup.selectAllFilters();
    await expect(element(by.cssContainingText('.selector-title', 'Filters (1/7)')).isPresent()).toBe(true);

    // (15) should clear Search objects field
    await PluginPopup.deleteFromSearch();
    await browser.sleep(1000);
    await expect(list.count()).toBe(23);

    // (16) should press Back button
    await PluginPopup.clickBack();
    await browser.sleep(1000);
  });
});
