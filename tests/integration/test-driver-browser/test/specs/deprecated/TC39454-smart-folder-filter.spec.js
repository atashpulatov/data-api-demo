import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('Smart Folder - ', () => {
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

  it('[TC39454] Filter smart folder', async () => {
    const validReportName = 'seasonal';
    const validDatasetName = 'sales';
    const invalidObjectName = 'adsdfsbdjfbd';

    // should enter a valid report name into "Search objects" field
    await PluginRightPanel.clickImportDataButton();
    await browser.sleep(5000);
    await switchToPluginFrame();
    await PluginPopup.searchForObject(validReportName);
    await PluginPopup.checkDisplayedObjectNames(validReportName);

    // should enter a valid dataset name into "Search objects" field
    await browser.sleep(1000);
    await PluginPopup.searchForObject(validDatasetName);
    await PluginPopup.checkDisplayedObjectNames(validDatasetName);

    // should clear "Search objects" field
    await PluginPopup.searchForObject('');

    // should enter an invalid report name into "Search objects" field
    await browser.sleep(1000);
    await PluginPopup.searchForObject(invalidObjectName);
    await expect(popupSelectors.noDataIcon.isDisplayed()).toBe(true);

    // should enter an invalid dataset name into "Search objects" field

    await browser.sleep(1000);
    await PluginPopup.searchForObject(invalidObjectName);
    await expect(popupSelectors.noDataIcon.isDisplayed()).toBe(true);

    // should click "Cancel" button
    await PluginPopup.clickCancel();
    await browser.sleep(3333);
    await switchToPluginFrame();
    await expect(popupSelectors.cancelBtn.isPresent()).toBe(false);
  });
});
