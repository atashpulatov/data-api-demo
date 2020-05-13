import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { changeBrowserTab, switchToPluginFrame, switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import officeLogin from '../../../helpers/office/office.login';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('[F22955] - Ability to refresh prompted data already imported to the workbook', () => {
  beforeEach(() => {
    officeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC48137] Refresh and edited report with prompt', () => {
    console.log('Should import prompted report');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibraryAndImportObject(objectsList.reports.objectPromptedReport);
    browser.pause(5555);
    PluginPopup.clickRun();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should edit report');
    switchToPluginFrame();
    PluginRightPanel.editObject(1);
    browser.pause(5000);
    PluginPopup.clickRun();
    browser.pause(3000);

    $(popupSelectors.importBtn).waitForExist(3333);
    PluginPopup.selectAttributesAndAttributeForms({ Category: [] });
    PluginPopup.selectAllMetrics();
    PluginPopup.clickImport();
    waitForNotification();

    expect(
      $(rightPanelSelectors.notificationPopUp).getAttribute('textContent')
    ).toContain(dictionary.en.importSuccess);

    console.log('Should refresh report');
    PluginRightPanel.refreshFirstObjectFromTheList();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toEqual(dictionary.en.reportRefreshed);
    PluginRightPanel.closeNotificationOnHover();
  });
});
