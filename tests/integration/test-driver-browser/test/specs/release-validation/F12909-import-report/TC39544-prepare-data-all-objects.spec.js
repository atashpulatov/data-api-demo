import OfficeLogin from '../../../pageObjects/office/office.login';
import OfficeWorksheet from '../../../pageObjects/office/office.worksheet';
import PluginRightPanel from '../../../pageObjects/plugin/plugin.right-panel';
import PluginPopup from '../../../pageObjects/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame } from '../../../pageObjects/utils/iframe-helper';
import { waitForNotification } from '../../../pageObjects/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';

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

  it('[TC39544] Preparing data with "All" objects', async () => {
    // should import a report from preconditions
    await switchToExcelFrame();
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(o.reports.seasonalReport);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should select a supported report
    await switchToExcelFrame();
    await OfficeWorksheet.selectCell('Y1');
    await PluginRightPanel.clickAddDataButton();
    await switchToPluginFrame();
    await PluginPopup.searchForObject(o.reports.seasonalReport);
    await PluginPopup.selectFirstObject();
    await PluginPopup.clickPrepareData();

    // should select one metric from many listed
    await PluginPopup.selectObjectElements(['Month Index']);
    await expect(element(by.cssContainingText('.selector-title', 'Metrics (1/2)')).isPresent()).toBe(true);

    // should select one more metric from many listed
    await PluginPopup.selectObjectElements(['Revenue']);
    await expect(element(by.cssContainingText('.selector-title', 'Metrics (2/2)')).isPresent()).toBe(true);

    // should click on "All" object in metrics column
    await PluginPopup.selectAllMetrics();
    await expect(element(by.cssContainingText('.selector-title', 'Metrics (0/2)')).isPresent()).toBe(true);

    // should click on "All" object in metrics column again
    await PluginPopup.selectAllMetrics();
    await expect(element(by.cssContainingText('.selector-title', 'Metrics (2/2)')).isPresent()).toBe(true);

    // should click on "All" object in attributes column
    await PluginPopup.selectAllAttributes();
    await expect(element(by.cssContainingText('.selector-title', 'Attributes (2/2)')).isPresent()).toBe(true);

    // should click on "All" object in attributes column again
    await PluginPopup.selectAllAttributes();
    await expect(element(by.cssContainingText('.selector-title', 'Attributes (0/2)')).isPresent()).toBe(true);

    // should select one attribute from many listed
    await PluginPopup.selectObjectElements(['Month']);
    await expect(element(by.cssContainingText('.selector-title', 'Attributes (1/2)')).isPresent()).toBe(true);

    // should select one more attribute from many listed
    await PluginPopup.selectObjectElements(['Month of Year']);
    await expect(element(by.cssContainingText('.selector-title', 'Attributes (2/2)')).isPresent()).toBe(true);

    // should click on one of the filters and select (All) object in the last column
    await PluginPopup.selectFilters([['Month', []]]);
    await PluginPopup.selectAllFilters();
    await expect(element(by.cssContainingText('.selector-title', 'Filters (1/2)')).isPresent()).toBe(true);

    // should select (All) object in the last column once again
    await PluginPopup.selectAllFilters();
    await expect(element(by.cssContainingText('.selector-title', 'Filters (0/2)')).isPresent()).toBe(true);

    // should select one of attribute filter values in the last columnn
    await PluginPopup.selectObjectElements(['Jan 2014']);
    await expect(element(by.cssContainingText('.selector-title', 'Filters (1/2)')).isPresent()).toBe(true);

    // should select one more of attribute filter values in the last columnn
    await PluginPopup.selectObjectElements(['Feb 2014']);
    await expect(element(by.cssContainingText('.selector-title', 'Filters (1/2)')).isPresent()).toBe(true);

    // should click on a different filter and select (All) object in the last column
    await PluginPopup.selectFilters([['Month of Year', []]]);
    await browser.sleep(2000);
    await PluginPopup.selectAllFilters();
    await expect(element(by.cssContainingText('.selector-title', 'Filters (2/2)')).isPresent()).toBe(true);
  });
});
