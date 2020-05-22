import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { waitForNotification, waitForAllNotifications } from '../../../helpers/utils/wait-helper';
import { objectsList } from '../../../constants/objects-list';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';

describe('F24751 - Import report with or without subtotals', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });
  it('[TC53752] Enable and disable subtotals', () => {
    const {
      reportBasedOnIntelligentCubeWithSubtotals,
      reportWithSubtotalAndPrompt,
      reportWithCrosstabAndSubtotals,
      basicSubtotalsReport,
      promptedReportWithCrosstabAndSubtotals
    } = objectsList.reports;

    console.log('Should import report with subtotals');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.openPrepareData(reportBasedOnIntelligentCubeWithSubtotals);
    PluginPopup.selectAllAttributesAndMetrics();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should refresh imported report with subtotals');
    switchToPluginFrame();
    PluginRightPanel.refreshObject(1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should edit imported report with subtotals');
    PluginRightPanel.editObject(1);
    browser.pause(2000);
    switchToPluginFrame();
    PluginPopup.clickSubtotalToggler();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should import report with subtotals and prompt');
    OfficeWorksheet.selectCell('R1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openPrepareData(reportWithSubtotalAndPrompt);
    console.log('Should select Electronics from prompt');
    PluginPopup.promptSelectObject('Electronics');
    PluginPopup.clickRun();
    PluginPopup.selectAllAttributesAndMetrics();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should refresh report with subtotals and prompt');
    switchToPluginFrame();
    PluginRightPanel.refreshObject(1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should edit report with subtotals and prompt');
    PluginRightPanel.editObject(1);
    browser.pause(3000);
    switchToPluginFrame();
    PluginPopup.promptSelectObject('Movies');
    PluginPopup.clickRun();
    PluginPopup.selectAllAttributesAndMetrics();
    PluginPopup.clickSubtotalToggler();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should import report with crosstab and subtotals');
    OfficeWorksheet.selectCell('Z1');
    PluginRightPanel.clickAddDataButton();
    console.log('Should select second object and open prepare data');
    PluginPopup.openPrepareData(reportWithCrosstabAndSubtotals, false, 2);
    PluginPopup.selectAllAttributesAndMetrics();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(2000);

    console.log('Should refresh report with crosstab and subtotals');
    switchToPluginFrame();
    PluginRightPanel.refreshObject(1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should edit report with crosstab and subtotals');
    PluginRightPanel.editObject(1);
    browser.pause(2000);
    switchToPluginFrame();
    PluginPopup.clickSubtotalToggler();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should import report totals subtotals 1');
    OfficeWorksheet.selectCell('DA1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openPrepareData(basicSubtotalsReport);
    PluginPopup.selectAllAttributesAndMetrics();
    console.log('Should navigate to subtotal toggler using tab and press enter');
    PluginPopup.navigateUsingTabAndPressEnter(6);
    console.log('Should navigate to import button using tab and press enter');
    PluginPopup.navigateUsingTabAndPressEnter(4);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Should import prompted report with crosstab and subtotals');
    OfficeWorksheet.selectCell('DG1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openPrepareData(promptedReportWithCrosstabAndSubtotals);
    browser.pause(3000);
    PluginPopup.clickRun();
    PluginPopup.selectAllAttributesAndMetrics();
    console.log('Should switch subtotal toggler 11 times');
    for (let i = 0; i < 11; i++) {
      PluginPopup.clickSubtotalToggler();
    }
    expect($(popupSelectors.subtotalTogglerOn)).toBeDefined();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    PluginRightPanel.refreshAll();
    waitForAllNotifications();
    PluginRightPanel.closeAllNotificationsOnHover();
    PluginRightPanel.logout();
    browser.pause(3000);
  });
});
