import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import settings from '../../../config';
import { switchToExcelFrame, switchToPluginFrame, switchToPromptFrame, switchToPromptFrameForEdit} from '../../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { objectsList } from '../../../constants/objects-list';
// /test/constants/selectors/popup-selectors.js

describe('F22954 Ability to edit data already imported to the workbook', () => {
  it('TC48354 [Edit data] Editing a prompted report (with prompt - Value|Date &Time|Required|No default answer)', () => {
    // step0 - open plugin
    browser.setWindowSize(1500, 900);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login(settings.officeOnline.username, settings.officeOnline.password);
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    PluginRightPanel.loginToPlugin(settings.env.username, settings.env.password);
    // step1 - press import data button
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    // step2 + step3 + step4 - turn my library toggle off, select a report with subtotals press prepare data
    PluginPopup.openPrompt(objectsList.reports.valueDayPromptReport);
    // step5 - select all metrics and all attributes
    PluginPopup.writeValueText('07/07/2015\uE004\uE004');
    // Assert that import is successfully imported and cell D18 contains "1/1/2013"
    waitForNotification();
    // expect succesfull notification
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    // expect total to be bolded and contain correct data
    switchToPluginFrame();
    PluginRightPanel.edit();
    browser.pause(3000);
    console.log('done');
    browser.keys('\uE004\uE004\uE004\uE004\uE004\uE006');
    console.log('done');
    switchToPluginFrame();
    console.log('done');
    PluginPopup.selectObjectElementsInPrepareData (['Profit', 'Revenue']);
    console.log('done');
    PluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.reportRefreshed);
  });
});
