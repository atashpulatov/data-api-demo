import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import {
  switchToPromptFrameForImportDossier, switchToPromptFrame, switchToDialogFrame, changeBrowserTab
} from '../../../helpers/utils/iframe-helper';
import { logStep } from '../../../helpers/utils/allure-helper';


describe('F24398 - Import and refresh visualization', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC61043] - E2E with dossier containing all types of prompts (including nested prompts)', () => {
    logStep('It should import grid visualization');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();

    logStep('Should open dossier');
    PluginPopup.openDossier(objectsList.dossiers.nested.name);
    switchToPromptFrameForImportDossier();
    $('#mstrdossierPromptEditor').waitForExist(10000);
    logStep('Should start selecting prompts');
    PluginPopup.answerPrompt('Category', 'Movies', 1);
    browser.pause(5000);
    PluginPopup.answerPrompt('Year', '2016', 2);
    browser.keys('\uE006');
    browser.pause(5000);
    PluginPopup.selectPromptOnPanel(3);
    // todo prompt 3
    PluginPopup.selectPromptOnPanel(4);
    // todo prompt 4
    PluginPopup.selectPromptOnPanel(5);
    PluginPopup.selectPromptOnPanel(6);
    PluginPopup.answerPrompt('Value', '1820', 7);
    PluginPopup.answerPrompt('Value', '01/01/2016', 8);
    PluginPopup.answerPrompt('Value', '01/02/2016', 9);
    PluginPopup.answerPrompt('Year', '2016', 10);
    PluginPopup.answerPrompt('Year', 'Movies', 11);
    PluginPopup.clickRunForPromptedDossier();

    // PluginPopup.selectAndImportVizualiation(objectsList.dossiers.nested.prompt11);
    // logStep('Imported selected visualization');

    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    // PluginRightPanel.closeNotificationOnHover();

    // logStep('Should edit and reprompt object');
    // PluginPopup.editAndOpenReprompt();
    // $(objectsList.dossiers.nested.prompt1).click();
    // switchToPromptFrame();
    // PluginPopup.clickRunForPromptedDossier();
    // switchToDialogFrame();
    // PluginPopup.clickImport();
    // waitForNotification();
    // expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    // PluginRightPanel.closeNotificationOnHover();

    // logStep('Should refresh object');
    // PluginRightPanel.refreshObject(1);
    // waitForNotification();
    // PluginRightPanel.closeNotificationOnHover();

    // logStep('Should remove object');
    // browser.pause(1111);
    // PluginRightPanel.removeObject(1);
    // waitForNotification();
    // PluginRightPanel.closeNotificationOnHover();
  });
});
