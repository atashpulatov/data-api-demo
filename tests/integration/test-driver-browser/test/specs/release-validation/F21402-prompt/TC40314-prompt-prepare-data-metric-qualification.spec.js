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
import { waitAndClick } from '../../../pageObjects/utils/click-helper';
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
  it('[TC40314] prompt with prepare data on metric qualification', async () => {
    
    //should click prepare data on selected report
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await switchToPluginFrame();
    await PluginPopup.preparePrompt(o.reports.metricExpPromptedReport);

    // should input value and click run button
    await waitAndClick($('div[title="- none -"]'));
    await waitAndClick($('div[title="Revenue"]'));
    await s.promptTextBox.sendKeys('10000\uE004\uE004\uE004\uE006');
    await switchToPopupFrame();
    await browser.wait(EC.presenceOf(s.importBtn),5555);

    //should select filters
    await switchToPopupFrame();
    await PluginPopup.selectObjectElements(['Region', 'Profit']);
    await PluginPopup.selectFilters([['Region', ['Central','Web']]]);
    await PluginPopup.clickImport();
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
}); 
