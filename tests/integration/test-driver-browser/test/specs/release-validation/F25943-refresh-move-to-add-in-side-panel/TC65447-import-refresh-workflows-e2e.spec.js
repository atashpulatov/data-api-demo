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

  it('[TC65447] - show action buttons on hover, select objects for batch actions', () => {
    const dossierObject = objectsList.dossiers.complexDossier;

    console.log('import first object');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.datasets.salesRecords50k);
    browser.pause(5555);

    console.log('Enter edit mode');
    OfficeWorksheet.selectCell('D5');
    browser.keys('Entering edit mode');
    browser.pause(5555);

    console.log('Exit edit mode');
    pressEnter();


    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();


    console.log('duplicate first object');
    PluginRightPanel.duplicateObject(1);
    PluginRightPanel.clickDuplicatePopupImportBtn();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();

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
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.grid);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();

    console.log('hover over the third object');
    $(rightPanelSelectors.getObjectSelector(3)).moveTo();
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getDuplicateBtnForObject(3))).toBe(true);
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getEdithBtnForObject(3))).toBe(true);
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getRefreshBtnForObject(3))).toBe(true);
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getRemoveBtnForObject(3))).toBe(true);

    console.log('hover over the fifth object');
    $(rightPanelSelectors.getObjectSelector(5)).moveTo();
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getDuplicateBtnForObject(5))).toBe(true);
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getEdithBtnForObject(5))).toBe(true);
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getRefreshBtnForObject(5))).toBe(true);
    expect(PluginRightPanel.isOpaque(rightPanelSelectors.getRemoveBtnForObject(5))).toBe(true);

    console.log('click master checkbox to select all objects');
    PluginRightPanel.clickMasterCheckbox();
    const numberOfObjects = $$('.object-tile').length;
    for (let objectIndex = 1; objectIndex <= numberOfObjects; objectIndex++) {
      expect($(rightPanelSelectors.getObjectCheckbox(objectIndex)).getAttribute('aria-checked')).toBe('true');
    }
    // expect($(rightPanelSelectors.getObjectCheckbox(2)).getAttribute('aria-checked')).toBe('true');
    // expect($(rightPanelSelectors.getObjectCheckbox(3)).getAttribute('aria-checked')).toBe('true');
  });
});
