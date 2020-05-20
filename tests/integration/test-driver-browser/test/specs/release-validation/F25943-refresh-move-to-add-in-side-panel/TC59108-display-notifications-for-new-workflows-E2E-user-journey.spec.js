import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { switchToPluginFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import pluginRightPanel from '../../../helpers/plugin/plugin.right-panel';

describe('F25943 - refresh move to add-in side panel and removal of blocking behavior', () => {
  beforeAll(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it(`[TC59108] Display notifications for new workflows - E2E user journey `, () => {
    // Display a correct warning notification when importing a report exceeding Excel row limit
    console.log('1 - Display a correct warning notification when importing a report exceeding Excel row limit');
    OfficeWorksheet.selectCell('A1048575');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.reports.basicReport);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.excelLimit);
    PluginRightPanel.closeNotification();

    // Import a prompted report
    console.log('2 - Import a prompted report');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const firstObject = objectsList.reports.attributePromptedReport;
    PluginPopup.switchLibraryAndImportObject(firstObject, false);
    PluginPopup.promptSelectObject('Books');
    PluginPopup.promptSelectObject('Electronics');
    switchToPluginFrame();
    PluginPopup.clickRun();
    waitForNotification();
    pluginRightPanel.closeNotificationOnHover();

    // Import a prompted report with crosstab
    console.log('3 - Import a prompted report with crosstab');
    OfficeWorksheet.selectCell('G1');
    PluginRightPanel.clickAddDataButton();
    const secondObject = objectsList.reports.withoutSubtotals.promptedReportWithCrosstabs;
    PluginPopup.switchLibraryAndImportObject(secondObject, false);
    browser.pause(5000);
    PluginPopup.clickRun();
    waitForNotification();
    pluginRightPanel.closeNotificationOnHover();

    // Import a report with subtotals
    console.log('4 - Import a report with subtotals');
    OfficeWorksheet.selectCell('G17');
    PluginRightPanel.clickAddDataButton();
    const thirdObject = objectsList.reports.basicSubtotalsReport;
    PluginPopup.switchLibraryAndImportObject(thirdObject, false);
    waitForNotification();
    pluginRightPanel.closeNotificationOnHover();

    // Import a dataset
    console.log('5 - Import a dataset');
    OfficeWorksheet.selectCell('M17');
    PluginRightPanel.clickAddDataButton();
    const fourthObject = objectsList.datasets.basicDataset;
    PluginPopup.switchLibraryAndImportObject(fourthObject, false);
    waitForNotification();
    pluginRightPanel.closeNotificationOnHover();

    // Import a grid visualization
    console.log('6 - Import a grid visualization');
    OfficeWorksheet.selectCell('AC17');
    PluginRightPanel.clickAddDataButton();
    const fifthObject = objectsList.dossiers.complexDossier;
    PluginPopup.importAnyObject(fifthObject.name, 1);
    browser.pause(5000);
    PluginPopup.importVizualiation(fifthObject.visualizations.grid);
    waitForNotification();
    pluginRightPanel.closeNotificationOnHover();

    //Select an imported object and verify it has action buttons displayed
    console.log('7 - Select an imported object and verify it has action buttons displayed');
    pluginRightPanel.clickObjectInRightPanel(2);
    const duplicateBtn = rightPanelSelectors.getDuplicateBtnForObject(2);
    const editBtn = rightPanelSelectors.getEdithBtnForObject(2);
    const refreshBtn = rightPanelSelectors.getRefreshBtnForObject(2);
    const removeBtn = rightPanelSelectors.getRemoveBtnForObject(2);
    expect($(duplicateBtn).toBeVisible);
    expect($(editBtn).toBeVisible);
    expect($(refreshBtn).toBeVisible);
    expect($(removeBtn).toBeVisible);
    
    //Select checkboxes for imported objects and verify Refresh Selected, Remove Selected are displayed
    console.log('8 - Select checkboxes for imported objects and verify Refresh Selected, Remove Selected are displayed');
    pluginRightPanel.selectAll();
    const refreshSelectedBtn = rightPanelSelectors.refreshAllBtn;
    const removeSelectedBtn = rightPanelSelectors.deleteAllBtn;
    expect($(refreshSelectedBtn).toBeVisible);
    expect($(removeSelectedBtn).toBeVisible);

    //Refresh selected objects and close notification messages
    console.log('9 - Refresh selected objects and close notification messages');
    PluginRightPanel.refreshSelected();
    waitForNotification();
    pluginRightPanel.closeAllNotificationsOnHover();

    //Import a big report
    console.log('10 - Import a big report');
    OfficeWorksheet.selectCell('AH17');
    PluginRightPanel.clickAddDataButton();
    const sixthObject = objectsList.reports.report50k;
    PluginPopup.switchLibraryAndImportObject(sixthObject, false);
    waitForNotification();
    pluginRightPanel.closeNotificationOnHover();

    //Select some of the imported objects
    console.log('11 - Select some of the imported objects');
    PluginRightPanel.clickObjectCheckbox(1);
    PluginRightPanel.clickObjectCheckbox(3);
    PluginRightPanel.clickObjectCheckbox(5);

    //Remove selected objects and cancel removal for one
    console.log('12 - Remove selected objects and cancel removal for one');
    PluginRightPanel.removeSelected();
    pluginRightPanel.cancelObjectPendingAction(3);
    waitForNotification();
    pluginRightPanel.selectAll();

    //Run Clear Data for the remaining objects
    console.log('13 - Run Clear Data for the remaining objects');
    switchToPluginFrame();
    PluginRightPanel.clickSettings();
    PluginRightPanel.clickClearData();
    PluginRightPanel.clickClearDataOk();
    $(rightPanelSelectors.viewDataBtn).waitForEnabled();

    //Log out
    console.log('14 - Log out');
    switchToPluginFrame();
    PluginRightPanel.logout();
  });
});
