import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { switchToPluginFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { objectsList } from '../../../constants/objects-list';

describe('F22954 Ability to edit data already imported to the workbook', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC48354] [Edit data] Editing a prompted report (with prompt - Value|Date &Time|Required|No default answer)', () => {
    // sholud import prompted report
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.openPrompt(objectsList.reports.valueDayPromptReport);
    PluginPopup.writeValueText('07/07/2015\uE004\uE004');
    waitForNotification();

    expect(
      $(rightPanelSelectors.notificationPopUp).getAttribute('textContent')
    ).toContain(dictionary.en.importSuccess);

    //  should edit report
    switchToPluginFrame();
    PluginRightPanel.edit();
    browser.pause(3000);

    switchToPluginFrame();
    PluginPopup.clickRun();
    browser.pause(3000);

    $(popupSelectors.importBtn).waitForExist(3333);
    PluginPopup.selectAttributesAndAttributeForms({ Region: [] });
    PluginPopup.selectAllMetrics();
    PluginPopup.clickImport();
    waitForNotification();

    expect(
      $(rightPanelSelectors.notificationPopUp).getAttribute('textContent')
    ).toContain(dictionary.en.reportRefreshed);
  });
});
