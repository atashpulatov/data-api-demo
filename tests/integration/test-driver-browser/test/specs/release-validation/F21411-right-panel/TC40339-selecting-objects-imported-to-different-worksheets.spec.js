
import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification, waitById } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';

const cellInput = 'm_excelWebRenderer_ewaCtl_NameBox';


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

  it('[TC40305] Selecting objects imported to different worksheet', async () => {
    // should import a report
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(objectsList.reports.reportXML);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should import a dataset to a different worksheet
    await OfficeWorksheet.openNewSheet();
    await waitById(cellInput);
    await OfficeWorksheet.selectCell('B1');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(objectsList.datasets.datasetSQL);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should import a report to a different worksheet
    await OfficeWorksheet.openNewSheet();
    await waitById(cellInput);
    await OfficeWorksheet.selectCell('C1');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(objectsList.reports.reportXML);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should import a dataset to a different worksheet
    await OfficeWorksheet.openNewSheet();
    await waitById(cellInput);
    await OfficeWorksheet.selectCell('D1');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.importObject(objectsList.datasets.datasetSQL);
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    await switchToPluginFrame();
    const objects = await rightPanelSelectors.importedObjectList;

    // should click on objects in the right panel
    await PluginRightPanel.clickOnObject(objects[0], 'D1');
    await PluginRightPanel.clickOnObject(objects[1], 'C1');
    await PluginRightPanel.clickOnObject(objects[2], 'B1');
    await PluginRightPanel.clickOnObject(objects[3], 'A1');
  });
});
