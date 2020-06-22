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
    
    PluginPopup.answerPrompt('Object', 'Item', 1);
    PluginPopup.selectPromptOnPanel(2);
    PluginPopup.answerPrompt('Category', 'Books', 3);
    PluginPopup.answerPrompt('Year', '2016', 4);
    browser.pause(3000);
    PluginPopup.selectPromptOnPanel(5);
    PluginPopup.selectPromptOnPanel(6);
    PluginPopup.answerPrompt('Value', '1820', 7);
    browser.pause(2000);
    PluginPopup.answerPrompt('Value', '11/06/2016', 8);
    PluginPopup.answerPrompt('Year', '2016', 9);
    browser.pause(1111);
    PluginPopup.clickRun();

    logStep(`+ Preparing Data...`);
    $(popupSelectors.allAttributes).waitForEnabled(20000);
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    logStep(`All attributes and metrics were selected`);

    PluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    logStep('Should edit report');
    switchToRightPanelFrame();
    PluginRightPanel.editObject(1);
    browser.pause(1000);
    switchToPromptFrame();
    browser.pause(5555);
    PluginPopup.selectPromptOnPanel(1);
    PluginPopup.clickRun();
    switchToDialogFrame();
    PluginPopup.selectObjectElements(['Region']);
    PluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
  });
});
