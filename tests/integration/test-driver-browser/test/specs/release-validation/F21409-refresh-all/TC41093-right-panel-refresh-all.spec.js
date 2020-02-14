import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';


describe('Right Panel - ', () => {
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

  it('[TC41093] Refresh All', async () => {
    // should import a report
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(objectsList.reports.reportXML);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should import a dataset
    await OfficeWorksheet.selectCell('I1');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(objectsList.datasets.datasetSQL);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should import a report
    await OfficeWorksheet.selectCell('Q1');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(objectsList.reports.reportXML);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should refresh all
    await PluginRightPanel.refreshAll();
    await waitForPopup();
    const refreshedObjects = await element.all(by.css('.report-name')); // const refreshedObjects = $$('.report-name'); <- webdriverio
    await expect(refreshedObjects).toHaveLength(3);
    await browser.sleep(4444);
  });
});
