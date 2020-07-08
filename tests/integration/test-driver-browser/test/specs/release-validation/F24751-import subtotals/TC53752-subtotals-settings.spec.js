import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, changeBrowserTab, switchToDialogFrame, switchToPromptFrame } from '../../../helpers/utils/iframe-helper';
import { waitForNotification, waitForAllNotifications } from '../../../helpers/utils/wait-helper';
import { objectsList } from '../../../constants/objects-list';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { logStep } from '../../../helpers/utils/allure-helper';

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

    logStep('Should import report with subtotals');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.openPrepareData(reportBasedOnIntelligentCubeWithSubtotals);
    PluginPopup.selectAllAttributesAndMetrics();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('Should refresh imported report with subtotals');
    switchToPluginFrame();
    PluginRightPanel.refreshObject(1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('Should edit imported report with subtotals');
    PluginRightPanel.editObject(1);
    browser.pause(2000);
    switchToPluginFrame();
    PluginPopup.clickSubtotalToggler();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('Should import report with subtotals and prompt');
    OfficeWorksheet.selectCell('R1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openPrepareData(reportWithSubtotalAndPrompt);
    logStep('Should select Electronics from prompt');
    PluginPopup.promptSelectObject('Electronics');
    PluginPopup.clickRun();
    browser.pause(5000);
    PluginPopup.selectAllAttributesAndMetrics();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('Should refresh report with subtotals and prompt');
    switchToPluginFrame();
    PluginRightPanel.refreshObject(1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('Should edit report with subtotals and prompt');
    PluginRightPanel.editObject(1);
    browser.pause(3000);
    switchToPluginFrame();
    PluginPopup.promptSelectObject('Movies');
    PluginPopup.clickRun();
    browser.pause(3000);
    PluginPopup.selectAllAttributesAndMetrics();
    PluginPopup.clickSubtotalToggler();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('Should import report with crosstab and subtotals');
    OfficeWorksheet.selectCell('Z1');
    PluginRightPanel.clickAddDataButton();
    logStep('Should select second object and open prepare data');
    PluginPopup.openPrepareData(reportWithCrosstabAndSubtotals, false, 2);
    PluginPopup.selectAllAttributesAndMetrics();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(2000);

    logStep('Should refresh report with crosstab and subtotals');
    switchToPluginFrame();
    PluginRightPanel.refreshObject(1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('Should edit report with crosstab and subtotals');
    PluginRightPanel.editObject(1);
    browser.pause(2000);
    switchToPluginFrame();
    PluginPopup.clickSubtotalToggler();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('Should import report totals subtotals 1');
    OfficeWorksheet.selectCell('DA1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openPrepareData(basicSubtotalsReport);
    PluginPopup.selectAllAttributesAndMetrics();
    logStep('Should navigate to subtotal toggler using tab and press enter');
    PluginPopup.navigateUsingTabAndPressEnter(6);
    logStep('Should navigate to import button using tab and press enter');
    PluginPopup.navigateUsingTabAndPressEnter(4);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('Should import prompted report with crosstab and subtotals');
    OfficeWorksheet.selectCell('DG1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openPrepareData(promptedReportWithCrosstabAndSubtotals);
    switchToPromptFrame();
    browser.pause(1111);
    PluginPopup.selectPromptOnPanel(1, false);
    browser.pause(3000);
    PluginPopup.clickRun();
    browser.pause(5000);
    PluginPopup.selectAllAttributesAndMetrics();
    logStep('Should switch subtotal toggler 11 times');
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