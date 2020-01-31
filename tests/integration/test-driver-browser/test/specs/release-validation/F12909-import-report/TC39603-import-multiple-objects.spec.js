import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary.js';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';

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


  it('[TC39603] Import multiple objects', async () => {
    // first worksheet
    // should import a supported report
    await switchToExcelFrame();
    await OfficeWorksheet.selectCell('A1');
    await switchToPluginFrame();
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(o.reports.reportXML);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should import a supported dataset
    await OfficeWorksheet.selectCell('Y1');
    await switchToPluginFrame();
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(o.datasets.datasetSQL);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // Second worksheet
    // should import a supported report on a second sheet
    await OfficeWorksheet.openNewSheet();
    await switchToPluginFrame();
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(o.reports.reportXML);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should import a supported dataset on a second sheet
    await OfficeWorksheet.selectCell('Y1');
    await switchToPluginFrame();
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(o.datasets.datasetSQL);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // Third worksheet
    // should import a supported report on a third sheet
    await OfficeWorksheet.openNewSheet();
    await switchToPluginFrame();
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(o.reports.reportXML);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should import a supported dataset on a third sheet
    await OfficeWorksheet.selectCell('Y1');
    await switchToPluginFrame();
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(o.datasets.datasetSQL);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
