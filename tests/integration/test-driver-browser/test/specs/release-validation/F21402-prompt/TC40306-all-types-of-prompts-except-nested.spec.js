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

describe('F21402 - Handle Prompted Object', () => {
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
    logStep('Prompt is opened');
    switchToPromptFrame();
    browser.pause(1111);
    $(popupSelectors.promptedAll.prompt1).click();
    logStep('Prompt 1 selected');
    
    browser.pause(1111);
    $(popupSelectors.promptedAll.prompt2).click();
    logStep('Prompt 2 selected');

    browser.pause(1111);
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt8, '2016');
    logStep('Prompt 3 selected');

    browser.pause(1111);
    $(popupSelectors.promptPanel(5)).click();
    browser.pause(2222);
    $(popupSelectors.promptedAll.prompt4).keys('\uE004\uE004\uE004\uE004\uE004\uE004\uE004\uE006');
    logStep('Prompt 4 selected');

    browser.pause(1111);
    $(popupSelectors.promptedAll.prompt9).click();
    logStep('Prompt 5 selected');

    browser.pause(1111);
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt3, '2000');
    logStep('Prompt 6 selected');

    browser.pause(1111);
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt4, '1820');
    $(popupSelectors.promptPanel(8)).click();
    logStep('Prompt 7 selected');

    browser.pause(2111);
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt5, '11/06/2016');
    $(popupSelectors.promptPanel(9)).click();
    logStep('Prompt 8 selected');

    browser.pause(2111);
    $(popupSelectors.promptedAll.prompt6).clearValue();
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt6, '2016');
    $(popupSelectors.promptPanel(10)).click();
    logStep('Prompt 9 selected');

    browser.pause(1111);
    $(popupSelectors.promptPanel(10)).click();
    $(popupSelectors.promptPanel(11)).click();
    logStep('Prompt 10 selected');

    browser.pause(1111);
    $(popupSelectors.promptedAll.prompt7).click();
    logStep('Prompt 11 selected and all prompts are selected correctly');

    // should click run and select attributes metrics filters
    switchToDialogFrame();
    logStep('Prepare data popup is opened');
    PluginPopup.clickRun();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.clickImport();
    logStep('Attributes metrics and filters are selected');

    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
