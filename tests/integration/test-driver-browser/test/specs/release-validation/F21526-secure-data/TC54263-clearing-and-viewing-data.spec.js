import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification, waitForPopup, waitByClass, waitById } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { switchToPluginFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { objectsList } from '../../../constants/objects-list';
import { excelSelectors } from '../../../constants/selectors/office-selectors'

const EC = protractor.ExpectedConditions;
const clearingLoadingClass = 'loading-text-container';
const showDataBtnClass = 'show-data-btn';


describe('[TC54263] Secure data - clearing data', () => {
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

  it('[TC54263] should clear data', async () => {
    // should import 'Revenue by Region and Category - secure data' report
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(objectsList.reports.secureDataFiltering);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should import 'Secure data - always working' report
    await switchToExcelFrame();
    await OfficeWorksheet.selectCell('E1');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(objectsList.reports.secureDataAlwaysWorking);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should clear data
    await switchToPluginFrame();
    await PluginRightPanel.clickSettings();
    await PluginRightPanel.clearData();
    await browser.sleep(4000);

    // should assert data was cleared
    await switchToExcelFrame();
    await browser.wait(EC.textToBePresentInElement(excelSelectors.A2, ''), 10000);
    await browser.wait(EC.textToBePresentInElement(excelSelectors.E2, ''), 5000);

    // should log out
    await switchToPluginFrame();
    await PluginRightPanel.clickSettings();
    await PluginRightPanel.clickLogout();

    // should log in with Tim user
    await PluginRightPanel.loginToPlugin('Tim', '');

    // should click "View Data" and close the "Refresh All Data" pop-up
    await switchToPluginFrame();
    await PluginRightPanel.viewDataBtn();
    await waitForPopup();
    await switchToExcelFrame();
    await browser.actions().mouseMove(popupSelectors.closeRefreshAll).perform();
    await browser.actions().click(popupSelectors.closeRefreshAll).perform();

    // should assert data was refreshed
    await switchToExcelFrame();
    await browser.wait(EC.textToBePresentInElement(excelSelectors.A2, 'Central'), 5000);
    await browser.wait(EC.textToBePresentInElement(excelSelectors.E2, 'Albania'), 5000);

    // should clear data
    await switchToPluginFrame();
    await PluginRightPanel.clickSettings();
    await PluginRightPanel.clearData();
    await browser.sleep(4000);

    // should assert data was cleared
    await switchToExcelFrame();
    await browser.wait(EC.textToBePresentInElement(excelSelectors.E2, ''), 5000);
    await browser.wait(EC.textToBePresentInElement(excelSelectors.A2, ''), 10000);

    // should log out
    await switchToPluginFrame();
    await PluginRightPanel.clickSettings();
    await PluginRightPanel.clickLogout();

    // should log in with Jeff user
    await PluginRightPanel.loginToPlugin('Jeff', '');

    // should click "View Data" and close the "Refresh All Data" pop-up
    await switchToPluginFrame();
    await PluginRightPanel.viewDataBtn();
    await waitForPopup();
    await switchToExcelFrame();
    await browser.actions().mouseMove(popupSelectors.closeRefreshAll).perform();
    await browser.actions().click(popupSelectors.closeRefreshAll).perform();

    // assert data was refreshed
    await switchToExcelFrame();
    await browser.wait(EC.textToBePresentInElement(excelSelectors.A2, 'Mid-Atlantic'), 5000);
    await browser.wait(EC.textToBePresentInElement(excelSelectors.E2, 'Albania'), 5000);

    // should clear data
    await switchToPluginFrame();
    await PluginRightPanel.clickSettings();
    await PluginRightPanel.clearData();
    await browser.sleep(4000);

    // should assert data was cleared
    await switchToExcelFrame();
    await browser.wait(EC.textToBePresentInElement(excelSelectors.A2, ''), 5000);
    await browser.wait(EC.textToBePresentInElement(excelSelectors.E2, ''), 5000);

    // should log out
    await switchToPluginFrame();
    await PluginRightPanel.clickSettings();
    await PluginRightPanel.clickLogout();

    // should log in with Martyna user
    await PluginRightPanel.loginToPlugin('Martyna', '');

    // should click "View Data" and close the "Refresh All Data" pop-up
    await switchToPluginFrame();
    await PluginRightPanel.viewDataBtn();
    await waitForPopup();
    await switchToExcelFrame();
    await browser.actions().mouseMove(popupSelectors.closeRefreshAll).perform();
    await browser.actions().click(popupSelectors.closeRefreshAll).perform();

    // assert data was refreshed
    await browser.wait(EC.textToBePresentInElement(excelSelectors.A2, ''), 5000);
    await browser.wait(EC.textToBePresentInElement(excelSelectors.E2, 'Albania'), 5000);
  });
});
