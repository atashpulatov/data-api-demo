import OfficeLogin from '../../../helpers/office/office.login';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { objectsList } from '../../../constants/objects-list';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { pressEnter } from '../../../helpers/utils/keyboard-actions';

describe('F25943 - refresh move to add-in side panel and removal of blocking behavior', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC65447] - import/refresh workflows while interacting with Excel application - E2E user journey', () => {
    const dossierObject = objectsList.dossiers.complexDossier;

    console.log('import first object');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.datasets.salesRecords50k);
    browser.pause(3000); // allow import to make some initial progress

    console.log('Enter edit mode');
    OfficeWorksheet.selectCell('D5');
    browser.keys('Entering edit mode');
    browser.pause(40000); // longer pause as per test case description

    console.log('Exit edit mode');
    pressEnter();


    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('get value of E4 cell from sheet1');
    OfficeWorksheet.selectCell('E4');
    browser.pause(2000);
    const selectedCell = '#m_excelWebRenderer_ewaCtl_selectionHighlight0-1-0';
    const sheet1CellE4Value = $(selectedCell).getText();


    console.log('duplicate first object');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();

    console.log('get value of E4 cell from sheet2 and compare it to E4 from sheet 1');
    OfficeWorksheet.selectCell('E4');
    browser.pause(2000);
    expect(sheet1CellE4Value).toBe($(selectedCell).getText());


    console.log('import a prompted report');
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importPromptDefaultNested(objectsList.reports.nestedPrompt);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('import a crosstab report');
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.clickHeader('Name');
    PluginPopup.clickHeader('Name');
    PluginPopup.importObject(objectsList.reports.withoutSubtotals.reportWithCrosstabs);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('import a report with subtotals');
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.reports.basicSubtotalsReport);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('import a dataset');
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.datasets.datasetSQL);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();


    console.log('import a visualization grid');
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importAnyObject(dossierObject.name, 1);
    browser.pause(5555);
    PluginPopup.importVizualiation(dossierObject.visualizations.grid);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('check if number of imported objects in UI is equal to 7');
    expect($(rightPanelSelectors.importedData).getText()).toContain('7');

    const numberOfObjects = $$('.object-tile').length;

    console.log('hover over imported objects');
    for (let objectIndex = 1; objectIndex <= numberOfObjects; objectIndex++) {
      $(rightPanelSelectors.getObjectSelector(objectIndex)).moveTo();
      expect(PluginRightPanel.isOpaque(rightPanelSelectors.getDuplicateBtnForObject(objectIndex))).toBe(true);
      expect(PluginRightPanel.isOpaque(rightPanelSelectors.getEdithBtnForObject(objectIndex))).toBe(true);
      expect(PluginRightPanel.isOpaque(rightPanelSelectors.getRefreshBtnForObject(objectIndex))).toBe(true);
      expect(PluginRightPanel.isOpaque(rightPanelSelectors.getRemoveBtnForObject(objectIndex))).toBe(true);
    }

    console.log('click master checkbox to select all objects');
    PluginRightPanel.clickMasterCheckbox();
    for (let objectIndex = 1; objectIndex <= numberOfObjects; objectIndex++) {
      expect($(rightPanelSelectors.getObjectCheckbox(objectIndex)).getAttribute('aria-checked')).toBe('true');
    }

    console.log('check if refreshAll and removeAll buttons are visible');
    expect($(rightPanelSelectors.refreshAllBtn).isDisplayed()).toBe(true);
    expect($(rightPanelSelectors.deleteAllBtn).isDisplayed()).toBe(true);

    console.log('select table to apply formatting to');
    PluginRightPanel.clickObjectInRightPanel(6);
    browser.pause(4000); // allow excel select table in worksheet

    console.log('refresh all');
    PluginRightPanel.clickMasterCheckbox();
    browser.pause(2000);
    PluginRightPanel.refreshAll();

    console.log('apply formatting');
    OfficeWorksheet.formatTable();
    browser.pause(5000); // allow formatting to be applied

    console.log('scroll to the bottom of the table');
    OfficeWorksheet.selectCell('D5');
    browser.keys(['End']);
    browser.pause(5000); // allow excel to perform scroll operation

    console.log('switch between worksheets');
    OfficeWorksheet.openSheet(3);
    OfficeWorksheet.openSheet(4);

    waitForNotification();
    PluginRightPanel.closeAllNotificationsOnHover();

    console.log('check if all objects are deselected after refresh all operation');
    for (let objectIndex = 1; objectIndex <= numberOfObjects; objectIndex++) {
      expect($(rightPanelSelectors.getObjectCheckbox(objectIndex)).getAttribute('aria-checked')).toBe('false');
    }

    console.log('check if refreshAll and removeAll buttons are no longer visible');
    expect($(rightPanelSelectors.refreshAllBtn).isDisplayed()).toBe(false);
    expect($(rightPanelSelectors.deleteAllBtn).isDisplayed()).toBe(false);

    PluginRightPanel.logout();
    browser.pause(2222);
    expect($(rightPanelSelectors.loginRightPanelBtn).isDisplayed()).toBe(true);
  });
});
