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

describe('F22954 - Ability to edit data already imported to the workbook', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC62674]  Editing prompted reports functionality, for all type of prompts (value, object, expression, etc) imported with Prepare Data', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.preparePrompt(objectsList.reports.allPrompt);

    console.log('Should select answers for 11 prompts');
    console.log('Prompt is opened');
    switchToPromptFrame();
    console.log('Should select Prompt 1');
    browser.pause(1111);
    $(popupSelectors.promptedAll.prompt1).click();

    browser.pause(1111);
    console.log('Should select Prompt 2');
    $(popupSelectors.promptedAll.prompt2).click();

    browser.pause(1111);
    console.log('Should select Prompt 3');
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt8, '2016');

    browser.pause(1111);
    console.log('Should scroll the window to  Prompt panel 5');
    $(popupSelectors.promptPanel(5)).click();
    browser.pause(2222);
    console.log('Should select Prompt 4');
    $(popupSelectors.promptedAll.prompt4a).keys('\uE004\uE004\uE004\uE004\uE004\uE004\uE004\uE006');

    browser.pause(3111);
    console.log('Should select Prompt 5');
    $(popupSelectors.promptedAll.prompt10).click();

    browser.pause(1111);
    console.log('Should select Prompt 6');
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt3, '2000');

    browser.pause(1111);
    console.log('Should scroll the window to  Prompt panel 7');
    $(popupSelectors.promptPanel(7)).click();
    console.log('Should select Prompt 7');
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt4b, '1820');

    browser.pause(2111);
    console.log('Should select Prompt 8');
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt11, '11/06/2016');
    console.log('Should scroll the window to  Prompt panel 9');
    $(popupSelectors.promptPanel(9)).click();

    browser.pause(2111);
    console.log('Should clear value for Prompt 9');
    $(popupSelectors.promptedAll.prompt12).clearValue();
    console.log('Should select Prompt 9');
    PluginPopup.clickAndKeys(popupSelectors.promptedAll.prompt12, '2016');
    console.log('Should scroll the window to  Prompt panel 10');
    $(popupSelectors.promptPanel(10)).click();

    browser.pause(2111);
    console.log('Should scroll the window to  Prompt panel 11');
    $(popupSelectors.promptPanel(11)).click();

    browser.pause(1111);
    console.log('Should select Prompt 11');
    $(popupSelectors.promptedAll.prompt13).click();

    switchToDialogFrame();
    PluginPopup.clickRun();
    browser.pause(5555);
    console.log('Should select attributes and mettrics');
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.clickImport();

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
