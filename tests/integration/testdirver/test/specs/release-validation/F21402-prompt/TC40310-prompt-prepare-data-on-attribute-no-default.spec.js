import OfficeLogin from '../../../pageObjects/office/office.login';
import OfficeWorksheet from '../../../pageObjects/office/office.worksheet';
import PluginRightPanel from '../../../pageObjects/plugin/plugin.right-panel';
import PluginPopup from '../../../pageObjects/plugin/plugin.popup';
import { waitForNotification } from '../../../pageObjects/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToPluginFrame, switchToPopupFrame } from '../../../pageObjects/utils/iframe-helper';
import {selectors as s} from '../../../constants/selectors/popup-selectors';



// this test case is not finished yet 
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
  it('[TC40310] prompt on attribute with prepare data, without default answer ', async () => {
    
    //should click prepare data on selected report
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await switchToPluginFrame();
    await PluginPopup.preparePrompt(o.reports.attributePromptedReport);

    // should select one category and click run
    await PluginPopup.clickPromptArrow();
    await PluginPopup.clickRun();

    //should select filters and import report
    await switchToPopupFrame();
    await PluginPopup.selectObjectElements(['Year', 'Profit']);
    await PluginPopup.selectFilters([['Year', ['2014', '2015']]]);
    await PluginPopup.clickImport();
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});