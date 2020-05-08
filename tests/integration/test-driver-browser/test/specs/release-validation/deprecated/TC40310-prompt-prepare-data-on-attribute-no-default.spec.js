import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToPluginFrame, switchToPopupFrame } from '../../../helpers/utils/iframe-helper';


// this test case is not finished yet
describe('Prompt | Value | Text | Not required | No default answer', () => {
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
    // should click prepare data on selected report
    await OfficeWorksheet.selectCell('A1');
    await PluginRightPanel.clickImportDataButton();
    await switchToPluginFrame();
    await PluginPopup.preparePrompt(objectsList.reports.attributePromptedReport);

    // should select one category and click run
    await PluginPopup.clickPromptArrow();
    await PluginPopup.clickRun();

    // should select filters and import report
    await switchToPopupFrame();
    await PluginPopup.selectObjectElements(['Year', 'Profit']);
    await PluginPopup.selectFilters([['Year', ['2014', '2015']]]);
    await PluginPopup.clickImport();
    await waitForNotification();
    await expect(rightPanelSelectors.notificationPopUp.getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
