import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { changeBrowserTab, switchToPluginFrame, switchToRightPanelFrame } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('[F22954] - Ability to edit data already imported to the workbook', () => {
  beforeEach(() => {
    // OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    // browser.closeWindow();
    // changeBrowserTab(0);
  });

  it('[TC48339]  Editing an imported dataset', () => {
    // should import a report
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.switchLibraryAndImportObject(objectsList.datasets.salesRecords1k);
    browser.pause(5555); // temp solution
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    // should edit the report
    switchToRightPanelFrame();
    PluginRightPanel.editObject(1);
    browser.pause(1000);
    switchToPluginFrame();
    browser.pause(1000);
    PluginPopup.selectObjectElements(['Region']);
    PluginPopup.clickImport();
    waitForNotification();
  });
});
