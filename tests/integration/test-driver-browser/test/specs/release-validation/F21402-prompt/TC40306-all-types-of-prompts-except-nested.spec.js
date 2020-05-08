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
    console.log('Prompt is opened');
    switchToPromptFrame();
    $(popupSelectors.promptedAll.prompt1).click();
    console.log('Prompt 1 selected');

    $(popupSelectors.promptedAll.prompt2).click();
    console.log('Prompt 2 selected');

    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt8, '2016');
    console.log('Prompt 3 selected');

    $(popupSelectors.promptPanel(5)).click();
    browser.pause(2222);
    $(popupSelectors.promptedAll.prompt4).keys('\uE004\uE004\uE004\uE004\uE004\uE004\uE004\uE006');
    console.log('Prompt 4 selected');

    $(popupSelectors.promptedAll.prompt9).click();
    console.log('Prompt 5 selected');

    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt3, '2000');
    console.log('Prompt 6 selected');

    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt4, '1820');
    console.log('Prompt 7 selected');

    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt5, '11/6/2016');
    $(popupSelectors.promptPanel(9)).click();
    console.log('Prompt 8 selected');

    $(popupSelectors.promptedAll.prompt6).clearValue();
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt6, '2016');
    console.log('Prompt 9 selected');

    $(popupSelectors.promptPanel(10)).click();
    console.log('Prompt 10 selected');

    $(popupSelectors.promptedAll.prompt7).click();
    console.log('Prompt 11 selected and all prompts are selected correctly');

    // should click run and select attributes metrics filters
    switchToDialogFrame();
    console.log('Prepare data popup is opened');
    PluginPopup.clickRun();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.clickImport();
    console.log('Attributes metrics and filters are selected');

    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
