import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { switchToPluginFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';

describe('TS41441 - E2E Sanity checks', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });


  it('[TC49134]  Part II - Subtotals | Crosstabs', () => {
    // should open a new sheet & import a report with totals/subtotals
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibraryAndImportObject('Report with Totals and Subtotals', false);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should open a new sheet & import a report with crosstabs
    OfficeWorksheet.openNewSheet();
    switchToPluginFrame();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importObject('Report with Crosstab 123');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
