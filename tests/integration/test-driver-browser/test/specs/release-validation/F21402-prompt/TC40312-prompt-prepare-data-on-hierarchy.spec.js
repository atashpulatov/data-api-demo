import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToPluginFrame, switchToPopupFrame } from '../../../helpers/utils/iframe-helper';
import {selectors as s} from '../../../constants/selectors/popup-selectors';
const  EC = protractor.ExpectedConditions;

describe('Prompt | Value | Text | Not required | No default answer', function() {
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
  it('[TC40312] prompt with prepare data for hierarchy', async () => {
    
    //should click prepare data on selected report
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await switchToPluginFrame();
    await PluginPopup.preparePrompt(o.reports.hierarchyExpPromptedReport);

    // should click run button
    await PluginPopup.clickPromptArrow();
    await switchToPopupFrame();
    await PluginPopup.clickRun();
    await browser.wait(EC.presenceOf(s.importBtn),5555);

    //should select filters
    await PluginPopup.selectObjectElements(['Region', 'Profit']);
    await PluginPopup.selectFilters([['Region', ['Central','Web']]]);
    await PluginPopup.clickImport();
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
}); 
