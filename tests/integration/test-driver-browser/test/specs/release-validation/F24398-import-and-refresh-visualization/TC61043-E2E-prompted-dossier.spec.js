import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { switchToPromptFrameForImportDossier, switchToPromptFrame, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';


describe('F24398 - Import and refresh visualization', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC61043] - E2E with dossier containing all types of prompts (including nested prompts)', () => {
    console.log('It should import grid visualization');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();

    console.log('Should open dossier');
    PluginPopup.openDossier(objectsList.dossiers.nested.name);
    switchToPromptFrameForImportDossier();
    $('#mstrdossierPromptEditor').waitForExist(10000);
    console.log('Should start selecting prompts');

    $(objectsList.dossiers.nested.prompt1).click();
    $(objectsList.dossiers.nested.prompt1).click();
    console.log('Prompt 1 selected');

    PluginPopup.clickAndKeys(objectsList.dossiers.nested.prompt2, '2016');
    $(objectsList.dossiers.nested.prompt2).keys('\uE006');
    console.log('Prompt 2 selected');

    $(objectsList.dossiers.nested.prompt2).keys('\uE004\uE004\uE004\uE004\uE004\uE004\uE004\uE006');
    $(objectsList.dossiers.nested.prompt3).click();
    browser.pause(1111);
    PluginPopup.clickAndKeys(objectsList.dossiers.nested.prompt4, '2000');
    console.log('Prompt 3 selected');

    browser.pause(1111);
    $(objectsList.dossiers.nested.prompt5).click();
    browser.pause(2111);
    PluginPopup.clickAndKeys(objectsList.dossiers.nested.prompt6, '1/1/2016');
    console.log('Prompt 4 selected');

    browser.pause(1111);
    PluginPopup.clickAndKeys(objectsList.dossiers.nested.prompt7, '1820');
    console.log('Prompt 5 selected');

    browser.pause(1111);
    PluginPopup.clickAndKeys(objectsList.dossiers.nested.prompt8, '1/2/2016');
    $(objectsList.dossiers.nested.prompt9).click();
    console.log('Prompt 6 selected');

    browser.pause(1111);
    $(objectsList.dossiers.nested.prompt10).clearValue();
    PluginPopup.clickAndKeys(objectsList.dossiers.nested.prompt10, '2016');
    console.log('Prompt 7 selected');

    PluginPopup.clickRunForPromptedDossier();
    PluginPopup.importVizualiation(objectsList.dossiers.nested.prompt11);
    console.log('Imported selected visualization');

    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should edit and reprompt object');
    PluginPopup.editAndOpenReprompt();
    $(objectsList.dossiers.nested.prompt1).click();
    switchToPromptFrame();
    PluginPopup.clickRunForPromptedDossier();
    switchToDialogFrame();
    PluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should refresh object');
    PluginRightPanel.refreshObject(1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should remove object');
    browser.pause(1111);
    PluginRightPanel.removeObject(1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
  });
});
