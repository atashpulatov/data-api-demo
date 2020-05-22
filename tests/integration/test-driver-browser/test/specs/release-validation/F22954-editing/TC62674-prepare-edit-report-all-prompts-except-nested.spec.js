import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import {
  changeBrowserTab, switchToPluginFrame, switchToRightPanelFrame, switchToPromptFrame, switchToDialogFrame
} from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { logStep } from '../../../helpers/utils/allure-helper';


describe('F22954 - Ability to edit data already imported to the workbook', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC62674]  Editing prompted reports functionality, for all type of prompts (value, object, expression, etc) imported with Prepare Data', () => {
    logStep(`+ Prepare data for report ${objectsList.reports.allPrompt}`);
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.preparePrompt(objectsList.reports.allPrompt);

    logStep('+ Answer for 11 prompts');
    logStep(`Prompt window is opened`);
    switchToPromptFrame();
    browser.pause(1111);
    PluginPopup.answerPrompt('Object', 'Item', 1, false);
    PluginPopup.selectPromptOnPanel(2, false);
    PluginPopup.answerPrompt('Category', 'Books', 3, true);
    PluginPopup.answerPrompt('Year', '2016', 4, true);
    browser.pause(3000);
    PluginPopup.selectPromptOnPanel(5, false);
    PluginPopup.selectPromptOnPanel(6, false);
    PluginPopup.answerPrompt('Date&Time', '1820', 7, true);
    browser.pause(2000);
    PluginPopup.answerPrompt('Date&Time', '11/06/2016', 8, true);
    PluginPopup.answerPrompt('Year', '2016', 9, true);
    browser.pause(1111);
    PluginPopup.clickRun();

    logStep(`+ Preparing Data...`);
    $(popupSelectors.allAttributes).waitForEnabled(20000);
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    logStep(`All attributes and metrics were selected`);

    // PluginPopup.clickImport();
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // logStep('Should edit report');
    // switchToRightPanelFrame();
    // PluginRightPanel.editObject(1);
    // browser.pause(1000);
    // switchToPluginFrame();
    // browser.pause(5555);
    // PluginPopup.clickRun();
    // browser.pause(1000);
    // PluginPopup.selectObjectElements(['Region']);
    // PluginPopup.clickImport();
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    // PluginRightPanel.closeNotificationOnHover();
  });
});
