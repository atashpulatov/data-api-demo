import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { switchToPromptFrame, switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';

describe('[F22955] - Ability to refresh prompted data already imported to the workbook', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
   });
 
    afterEach(() => {
     browser.closeWindow();
     const handles = browser.getWindowHandles();
     browser.switchToWindow(handles[0]);
   });

  it('[TC48134] Refresh a report with prompt - Object|Required|Default answer', () => {
    // should import a report
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(objectsList.reports.objectPromptedReport,false);
    browser.pause(5555); // temp solution
    switchToPluginFrame();
    $(popupSelectors.runBtn).waitForExist(3333);
    waitAndClick($(popupSelectors.runBtn));
    //PluginPopup.importPromptDefault(objectsList.reports.objectPromptedReport);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should refresh the report
    PluginRightPanel.refreshFirstObjectFromTheList();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
  });
});

