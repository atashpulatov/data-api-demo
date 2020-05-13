import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { changeBrowserTab, switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';

describe('[F22954] - Ability to edit data already imported to the workbook', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC62676] Editing prompted reports functionality while report contains nested prompts imported without Prepare Data', () => {
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);

    console.log('Should import nested prompt');
    PluginPopup.importPromptDefaultNested(objectsList.reports.nestedPrompt);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should edit neasted prompt');
    PluginPopup.editPromptDefaultNested(1);
    browser.pause(1000);
    switchToPluginFrame();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.clickImport();
    console.log('Attributes metrics and filters are selected');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(3000);
  });
});
