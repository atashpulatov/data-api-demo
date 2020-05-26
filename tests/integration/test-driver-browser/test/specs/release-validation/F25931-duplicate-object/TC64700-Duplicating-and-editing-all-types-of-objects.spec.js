import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import { objectsList } from '../../../constants/objects-list';
import { switchToDialogFrame } from '../../../helpers/utils/iframe-helper';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import { dictionary } from '../../../constants/dictionaries/dictionary';

describe('F25931 - Duplicate object', () => {
  beforeAll(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
  });

  // Create test for each visType defined in visualizations
  it(`[TC64700] Duplicating and editing all types of objects) `, () => {
    console.log('Importing Merged Header Report');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importAnyObject(objectsList.reports.mergedHeaderReport, 1);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);
    browser.pause(1000);

    console.log('Importing DATA_IMPORT_SQL_STATEMENT');
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    browser.pause(3333);
    PluginPopup.importObject(objectsList.datasets.datasetSQL);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);
    browser.pause(1000);

    console.log('User Activity Dossier - accounts');
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    browser.pause(3333);
    const dossier = objectsList.dossiers.interactiveDossier;
    PluginPopup.openDossier(dossier.name);
    PluginPopup.selectAndImportVizualiation(dossier.vis2);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);
    browser.pause(1000);

    console.log('Duplicate Report');
    OfficeWorksheet.openSheet(1);
    OfficeWorksheet.selectCell('E1');
    PluginRightPanel.duplicateObject(3);
    PluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    PluginRightPanel.clickDuplicatePopupEditBtn();
    switchToDialogFrame();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.selectAttributesAndAttributeForms({ Category: [] });
    PluginPopup.selectObjectElements(['Cost']);
    PluginPopup.clickImport();
    PluginRightPanel.waitAndCloseNotification(dictionary.en.duplicateSucces);

    console.log('Duplicate Dataset');
    OfficeWorksheet.openSheet(2);
    OfficeWorksheet.selectCell('H1');
    PluginRightPanel.duplicateObject(3);
    PluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    PluginRightPanel.clickDuplicatePopupEditBtn();
    switchToDialogFrame();
    PluginPopup.selectAllAttributes();
    PluginPopup.selectAllMetrics();
    PluginPopup.selectObjectElements(['Region', 'Avg Call Time']);
    PluginPopup.clickImport();
    PluginRightPanel.waitAndCloseNotification(dictionary.en.duplicateSucces);

    console.log('Duplicate Dossier');
    OfficeWorksheet.openSheet(3);
    OfficeWorksheet.selectCell('G1');
    PluginRightPanel.duplicateObject(3);
    PluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    PluginRightPanel.clickDuplicatePopupEditBtn();
    switchToDialogFrame();
<<<<<<< HEAD
    const visualization = objectsList.dossiers.interactiveDossier.vis2;
    PluginPopup.selectAndImportVizualiation(visualization);
=======
    const visualization = objectsList.dossiers.userActivityDossier.visualizations.dailyActiveAccounts;
    PluginPopup.selectAndImportVisualization(visualization);
>>>>>>> origin/m2020
    PluginRightPanel.waitAndCloseNotification(dictionary.en.duplicateSucces);
  });
});
