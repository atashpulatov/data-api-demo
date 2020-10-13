import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { logStep } from '../../../helpers/utils/allure-helper';

describe('F25931 - Duplicate object', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
  });

  it('[TC64626] - Duplicate all types of objects', () => {
    logStep(`Import Report ${objectsList.reports.secureDataAlwaysWorking}`);
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    browser.pause(3000);
    PluginPopup.importObject(objectsList.reports.secureDataAlwaysWorking);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    logStep(`Import Dataset ${objectsList.datasets.salesRecords1k}`);
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.datasets.salesRecords1k);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    logStep(`Import Bubble Chart from ${objectsList.dossiers.complexDossier.name}`);
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    const dossierObject = objectsList.dossiers.complexDossier;
    const { bubbleChart } = dossierObject.visualizations;
    PluginPopup.openDossier(dossierObject.name, null, false, 2);
    PluginPopup.selectAndImportVisualization(bubbleChart);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    logStep('Save initial number of worksheets');
    const initialNumberOfWorksheets = OfficeWorksheet.getNumberOfWorksheets();

    logStep('Go to 1 excel worksheet');
    OfficeWorksheet.openSheet(1);
    logStep('Select G1 cell');
    OfficeWorksheet.selectCell('G1');
    logStep(`Open Duplicate Popup for imported ${objectsList.reports.secureDataAlwaysWorking}`);
    PluginRightPanel.duplicateObject(3);
    logStep('Select actibe cell option in duplicate popup');
    PluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    logStep('Click import button in duplicate popup');
    PluginRightPanel.clickDuplicatePopupImportBtn();
    logStep(`Check duplicated ${objectsList.reports.secureDataAlwaysWorking}`);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.duplicateSucces);
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.secureDataAlwaysWorking} Copy`);

    logStep('Go to 2 excel worksheet');
    OfficeWorksheet.openSheet(2);
    logStep('Select R1 cell');
    OfficeWorksheet.selectCell('R1');
    logStep(`Open Duplicate Popup for imported ${objectsList.datasets.salesRecords1k}`);
    PluginRightPanel.duplicateObject(3);
    logStep('Select actibe cell option in duplicate popup');
    PluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    logStep('Click import button in duplicate popup');
    PluginRightPanel.clickDuplicatePopupImportBtn();
    logStep(`Check duplicated ${objectsList.datasets.salesRecords1k}`);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.duplicateSucces);
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.datasets.salesRecords1k} Copy`);

    logStep('Go to 3 excel worksheet');
    OfficeWorksheet.openSheet(3);
    logStep('Select A10 cell');
    OfficeWorksheet.selectCell('A10');
    logStep('Open Duplicate Popup for imported Bubble Chart');
    PluginRightPanel.duplicateObject(3);
    logStep('Select actibe cell option in duplicate popup');
    PluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    logStep('Click import button in duplicate popup');
    PluginRightPanel.clickDuplicatePopupImportBtn();
    logStep('Check duplicated Bubble Chart');
    PluginRightPanel.waitAndCloseNotification(dictionary.en.duplicateSucces);
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`Bubble Chart Copy`);

    logStep('Check if all objects were duplicated to active cells (number of worksheets did not change)');
    expect(OfficeWorksheet.getNumberOfWorksheets()).toBe(initialNumberOfWorksheets);
  });
});
