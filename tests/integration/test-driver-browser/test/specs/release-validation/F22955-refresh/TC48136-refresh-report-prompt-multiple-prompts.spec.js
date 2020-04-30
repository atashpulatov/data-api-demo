import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import pluginRightPanel from '../../../helpers/plugin/plugin.right-panel';

describe('[F22955] - Ability to refresh prompted data already imported to the workbook', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC48136] [Refresh] Refresh a report with prompt - Multiple prompts', () => {
    // should import a report
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.openPrompt(objectsList.reports.multiplePromptsReport);
    PluginPopup.writeMultiPrompt('07/07/2015\uE004\uE004');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    pluginRightPanel.closeNotificationOnHover();

    // should refresh the report
    PluginRightPanel.refreshFirstObjectFromTheList();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.reportRefreshed);
    pluginRightPanel.closeNotificationOnHover();
  });
});
