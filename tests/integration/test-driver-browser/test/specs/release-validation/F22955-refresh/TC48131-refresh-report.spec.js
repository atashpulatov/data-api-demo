import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import officeLogin from '../../../helpers/office/office.login';

describe('[F22955] - Ability to refresh prompted data already imported to the workbook', () => {
  beforeEach(() => {
    officeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC48131] Refresh a report (without prompt)', () => {
    // should import a report
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.reportXML);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);

    // should refresh the report
    PluginRightPanel.refreshFirstObjectFromTheList();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
  });
});
