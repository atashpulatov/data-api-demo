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
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
   });
 
    afterEach(() => {
     browser.closeWindow();
     const handles = browser.getWindowHandles();
     browser.switchToWindow(handles[0]);
   });

  it('[TC48354] [Edit data] Editing a prompted report (with prompt - Value|Date &Time|Required|No default answer)', () => {
    // sholud import prompted report
    PluginRightPanel.clickImportDataButton();
    PluginPopup.openPrompt(objectsList.reports.valueDayPromptReport);
    PluginPopup.writeValueText('07/07/2015\uE004\uE004');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    //should edit report
    switchToPluginFrame();
    PluginRightPanel.edit();
    browser.pause(3000);
    switchToPluginFrame();
    PluginPopup.clickRun();
    console.log("run")
    browser.pause(3000);
    $(popupSelectors.importBtn).waitForExist(3333);
    PluginPopup.selectAttributesAndAttributeForms({ Region: [] });
    PluginPopup.selectAllMetrics();
    console.log("elements selected");
    PluginPopup.clickImport();
    console.log("import");
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.reportRefreshed);
    
  });
});
