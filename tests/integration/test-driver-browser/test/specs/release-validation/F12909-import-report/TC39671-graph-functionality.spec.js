import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { $ } from 'protractor';
import { switchToPopupFrame, switchToRightPanelFrame } from '../../../helpers/utils/iframe-helper';


describe('Import report', function() {
  beforeAll(async () => {
    await OfficeWorksheet.openExcelHome();
    const url = await browser.getCurrentUrl();
    if (url.includes('login.microsoftonline')) {
      await OfficeLogin.login(officeCredentials.username, officeCredentials.password);
    }
    await browser.sleep(5000);
    await OfficeWorksheet.createNewWorkbook();
    await OfficeWorksheet.openPlugin();
    await PluginRightPanel.loginToPlugin('a', '');
  });

  afterAll(async () => {
    await browser.close();
    const handles = await browser.getAllWindowHandles();
    await browser.switchTo().window(handles[0]);
  });

  it('Importing graph and grid/graph reports functionality', async () => {

    // should check proper functionality of a raport with graph
    // should import report with grid and graph
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await PluginPopup.importObject(o.reports.gridReport);
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

     // should import report with graph
    await OfficeWorksheet.selectCell('F1');
    await PluginRightPanel.clickAddDataButton();
    await PluginPopup.prepareObject(o.reports.grpahReport, ['Region', 'Profit'],[['Region', []]] );
    await waitForNotification();
    await switchToRightPanelFrame();
    await browser.sleep(1111);

    //should refresh first report on the right panel
    const firstReport = await $('#overlay > div > section > div > div > div:nth-child(1)');
    await PluginRightPanel.doubleClick(firstReport);
    await browser.sleep(1111);
    await PluginRightPanel.refreshFirstObjectFromTheList();
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);

  });
});
