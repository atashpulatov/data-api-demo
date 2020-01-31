import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification, waitByClass } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objects as o } from '../../../constants/objects-list';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToPluginFrame, switchToPromptFrame, switchToPopupFrame } from '../../../helpers/utils/iframe-helper';
import {selectors as s} from '../../../constants/selectors/popup-selectors';
import {waitById} from '../../../helpers/utils/wait-helper.js';
import pluginPopup from '../../../helpers/plugin/plugin.popup';


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
  it('[TC40306] prompted reports functionality', async () => {
    
    //should click prepare data on selected report
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await switchToPluginFrame();
    await PluginPopup.preparePrompt(o.reports.promptedDateTimeNoDefault);
    await browser.sleep(2222);

    // should input values into prompt popup
    await s.valueInput.sendKeys('11/07/2016\uE004\uE00402\uE00402\uE00402\uE004\uE004\uE006');
    await browser.sleep(2222);
    await switchToPopupFrame();
    await browser.sleep(2222);

    //should select filters
    await PluginPopup.selectObjectElements(['Region', 'Profit']);
    await PluginPopup.selectFilters([['Region', ['Central','Web']]]);
    await PluginPopup.clickImport();
    await waitForNotification();
    await expect(se.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});