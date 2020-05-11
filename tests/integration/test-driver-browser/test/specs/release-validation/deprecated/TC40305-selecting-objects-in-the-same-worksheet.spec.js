
import OfficeLogin from '../../../pageObjects/office/office.login';
import OfficeWorksheet from '../../../pageObjects/office/office.worksheet';
import PluginRightPanel from '../../../pageObjects/plugin/plugin.right-panel';
import PluginPopup from '../../../pageObjects/plugin/plugin.popup';
import { waitForNotification } from '../../../pageObjects/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToPluginFrame } from '../../../pageObjects/utils/iframe-helper';

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

  it('[TC40305] Selecting objects in the same worksheet', async () => {
    // should import a report
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(o.reports.reportXML);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should import a dataset to the adjacent column of the first object
    await OfficeWorksheet.selectCell('A20');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(o.datasets.datasetSQL);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should import a report to the adjacent row of the second object
    await OfficeWorksheet.selectCell('F20');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(o.reports.reportXML);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should import a dataset to a cell not adjacent to any imported objects
    await OfficeWorksheet.selectCell('J1');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(o.datasets.datasetSQL);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    await switchToPluginFrame();
    const objects = await se.importedObjectList;
    const objectNames = await se.importedObjectNameList;

    // should hover over objects in the right panel
    await PluginRightPanel.hoverOverObjects(objects);

    // should hover over object names in the right panel
    await PluginRightPanel.hoverOverObjectNames(objectNames);

    // should click on objects in the right panel
    await PluginRightPanel.clickOnObject(objects[0], 'J1');
    await PluginRightPanel.clickOnObject(objects[1], 'F20');
    await PluginRightPanel.clickOnObject(objects[2], 'A20');
    await PluginRightPanel.clickOnObject(objects[3], 'A1');
  });
});
