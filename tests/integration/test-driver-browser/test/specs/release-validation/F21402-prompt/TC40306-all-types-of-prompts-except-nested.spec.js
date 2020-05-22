import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { changeBrowserTab, switchToPromptFrame, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { objectsList } from '../../../constants/objects-list';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { logStep } from '../../../helpers/utils/allure-helper';

describe('F21402 - Support for prompted reports while importing data for Excel add-in', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC40306] Importing prompted reports functionality, for all type of prompts (value, object, expression, etc) with Prepare Data', () => {
    // should click prepare data on selected report
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.preparePrompt(objectsList.reports.allPrompt);

    // should select answers for 11 prompts
    logStep(`Prompt window is opened`);
    switchToPromptFrame();
    browser.pause(1111);

    logStep(`Prompt 1 "Choose objects from the list" - selecting ALL Objects...`);
    $(popupSelectors.promptedAll.prompt1).click();
    browser.pause(1111);
    logStep(`Prompt 1 - finished selecting answer`);

    logStep(`Prompt 3 "Choose elements of Category" - selecting ALL Categories...`);
    $(popupSelectors.promptedAll.prompt2).click();
    browser.pause(1111);
    logStep(`Prompt 3 - finished selecting answer`);

    logStep(`Prompt 4 "Qualify on Year.(2014, 2015 or 2016)" - selecting year 2016...`);
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt8, '2016');
    browser.pause(1111);
    logStep(`Prompt 4 - finished selecting answer`);

    logStep(`Prompt 6 "Qualify on Revenue" - selecting Revenue greateer than 2000...`);
    $(popupSelectors.promptPanel(5)).click();
    browser.pause(2222);
    $(popupSelectors.promptedAll.prompt4a).keys('\uE004\uE004\uE004\uE004\uE004\uE004\uE004\uE006');
    browser.pause(1111);
    $(popupSelectors.promptedAll.prompt9).click();
    browser.pause(1111);
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt3, '2000');
    browser.pause(1111);
    logStep(`Prompt 6 - finished selecting answer`);

    logStep(`Prompt 7 "Enter a value (Big Decimal)" - selecting the Bid Decimal value 1820...`);
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt4, '1820');
    browser.pause(1111);
    logStep(`Prompt 7 - finished selecting answer`);

    logStep(`Prompt 8 "Enter a value (Date)" - selecting the date "11/06/2016"...`);
    $(popupSelectors.promptPanel(8)).click();
    browser.pause(2111);
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt5, '11/06/2016');
    browser.pause(1111);
    logStep(`Prompt 8 - finished selecting answer`);

    logStep(`Prompt 9 "Enter a value (Number) for the year you want to select" - selecting the year 2016...`);
    $(popupSelectors.promptPanel(9)).click();
    browser.pause(2111);
    $(popupSelectors.promptedAll.prompt6).clearValue();
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt6, '2016');
    logStep(`Prompt 9 - finished selecting answer`);

    // should click run and select attributes metrics filters
    switchToDialogFrame();
    PluginPopup.clickRun();
    logStep(`+ Preparing Data...`);
    $(popupSelectors.allAttributes).waitForEnabled(20000);
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    logStep(`All attributes and metrics were selected`);

    PluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
