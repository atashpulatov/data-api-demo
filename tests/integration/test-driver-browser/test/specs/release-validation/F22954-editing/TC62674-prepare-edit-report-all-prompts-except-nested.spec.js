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

describe('[F22954] - Ability to edit data already imported to the workbook', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC62674]  Editing prompted reports functionality, for all type of prompts (value, object, expression, etc) imported with Prepare Data', () => {
    // should click prepare data on selected report
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.preparePrompt(objectsList.reports.allPrompt);

    // should select answers for 11 prompts
    console.log('Prompt is opened');
    switchToPromptFrame();
    browser.pause(1111);
    $(popupSelectors.promptedAll.prompt1).click();
    console.log('Prompt 1 selected');

    browser.pause(1111);
    $(popupSelectors.promptedAll.prompt2).click();
    console.log('Prompt 2 selected');

    browser.pause(1111);
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt8, '2016');
    console.log('Prompt 3 selected');

    browser.pause(1111);
    $(popupSelectors.promptPanel(5)).click();
    browser.pause(2222);
    $(popupSelectors.promptedAll.prompt4).keys('\uE004\uE004\uE004\uE004\uE004\uE004\uE004\uE006');
    console.log('Prompt 4 selected');

    browser.pause(3111);
    $(popupSelectors.promptedAll.prompt10).click();
    console.log('Prompt 5 selected');

    browser.pause(1111);
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt3, '2000');
    console.log('Prompt 6 selected');

    browser.pause(1111);
    $(popupSelectors.promptPanel(7)).click();
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt4, '1820');
    console.log('Prompt 7 selected');

    browser.pause(2111);
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt11, '11/06/2016');
    $(popupSelectors.promptPanel(9)).click();
    console.log('Prompt 8 selected');

    browser.pause(2111);
    $(popupSelectors.promptedAll.prompt12).clearValue();
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt12, '2016');
    $(popupSelectors.promptPanel(10)).click();
    console.log('Prompt 9 selected');

    browser.pause(2111);
    $(popupSelectors.promptPanel(10)).click();
    $(popupSelectors.promptPanel(11)).click();
    console.log('Prompt 10 selected');

    browser.pause(1111);
    $(popupSelectors.promptedAll.prompt13).click();
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
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should edit report');
    switchToRightPanelFrame();
    PluginRightPanel.editObject(1);
    browser.pause(1000);
    switchToPluginFrame();
    browser.pause(5555);
    PluginPopup.clickRun();
    browser.pause(1000);
    PluginPopup.selectObjectElements(['Region']);
    PluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
  });
});
