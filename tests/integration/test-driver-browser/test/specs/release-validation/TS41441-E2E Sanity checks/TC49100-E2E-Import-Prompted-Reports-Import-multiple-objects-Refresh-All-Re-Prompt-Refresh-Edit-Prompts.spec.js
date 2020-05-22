import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { switchToPluginFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';

describe('TS41441 - Sanity checks', () => {
  beforeAll(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  // Create test for each visType defined in visualizations
  it(`[TC49100] Import Prompted Reports | Import multiple objects | Refresh All | Re-Prompt | Refresh | Edit - Prompts) `, () => {
    OfficeWorksheet.selectCell('A3');
    browser.pause(4000);
    PluginRightPanel.clickImportDataButton();

    // Import first prompted report
    const firstReport = objectsList.reports.attributePromptedReport;
    PluginPopup.openPrepareData(firstReport, false);
    PluginPopup.promptSelectObject('Books');
    PluginPopup.promptSelectObject('Electronics');
    switchToPluginFrame();
    PluginPopup.clickRun();
    browser.pause(3000);
    PluginPopup.selectAttributesAndAttributeForms({ Year: [], Region: [] });
    PluginPopup.selectAllMetrics();
    PluginPopup.selectFilters([['Category', ['Books']]]);
    PluginPopup.clickDataPreview();
    browser.pause(3000);
    PluginPopup.closePreview();
    switchToPluginFrame();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(1000);

    // Import second prompted report
    OfficeWorksheet.selectCell('G3');
    PluginRightPanel.clickAddDataButton();
    const secondReport = objectsList.reports.attributePromptedReport;
    PluginPopup.switchLibraryAndImportObject(secondReport, false);
    PluginPopup.promptSelectObject('Electronics');
    PluginPopup.clickRun();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(2000);
    switchToPluginFrame();

    // Refresh second prompted report
    PluginRightPanel.clickObjectInRightPanel(1);
    browser.pause(2000);
    $(rightPanelSelectors.getRefreshBtnForObject(1)).moveTo();
    browser.pause(2000);
    PluginRightPanel.refreshObject(1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(2000);
    switchToPluginFrame();

    // Edit first prompted report
    PluginRightPanel.clickObjectInRightPanel(2);
    $(rightPanelSelectors.getEdithBtnForObject(2)).moveTo();
    browser.pause(2000);
    PluginRightPanel.editObject(2);
    browser.pause(3000);
    switchToPluginFrame();
    PluginPopup.promptSelectObjectForEdit('Movies');
    PluginPopup.clickRun();
    browser.pause(3000);
    PluginPopup.selectAttributesAndAttributeForms({ Year: [] });
    PluginPopup.selectAllMetrics();
    PluginPopup.selectFilters([['Category', ['Movies']]]);
    switchToPluginFrame();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(1000);

    // Import third prompted report
    OfficeWorksheet.selectCell('N3');
    PluginRightPanel.clickAddDataButton();
    const thirdReport = objectsList.reports.objectPromptedReport;
    PluginPopup.switchLibraryAndImportObject(thirdReport, false);
    browser.pause(5000);
    PluginPopup.clickRun();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(2000);

    // Edit third imported report
    switchToPluginFrame();
    PluginRightPanel.editObject(1);
    browser.pause(3000);
    switchToPluginFrame();
    PluginPopup.removeAllSelected();
    PluginPopup.promptSelectObjectForEdit('Year');
    PluginPopup.clickRun();
    browser.pause(3000);
    PluginPopup.selectAttributesAndAttributeForms({ Year: [] });
    PluginPopup.selectAllMetrics();
    switchToPluginFrame();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(2000);

    // import dataset
    OfficeWorksheet.selectCell('R3');
    PluginRightPanel.clickAddDataButton();
    const FourthReport = objectsList.datasets.datasetSQL;
    PluginPopup.switchLibraryAndImportObject(FourthReport, false);
    waitForNotification();
    browser.pause(2000);

    // Refresh all
    PluginRightPanel.refreshAll();
    waitForNotification();
    PluginRightPanel.closeAllNotificationsOnHover();
    browser.pause(3000);

    // Remove first imported prompted report
    switchToPluginFrame();
    PluginRightPanel.clickObjectInRightPanel(4);
    browser.pause(2000);
    $(rightPanelSelectors.getRemoveBtnForObject(4)).moveTo();
    browser.pause(2000);
    PluginRightPanel.removeObject(4);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(3000);

    // Remove imported dataset
    switchToPluginFrame();
    PluginRightPanel.clickObjectInRightPanel(1);
    browser.pause(2000);
    $(rightPanelSelectors.getRemoveBtnForObject(1)).moveTo();
    browser.pause(2000);
    PluginRightPanel.removeObject(1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(3000);

    // Log out
    switchToPluginFrame();
    PluginRightPanel.logout();
    browser.pause(3000);
  });
});
