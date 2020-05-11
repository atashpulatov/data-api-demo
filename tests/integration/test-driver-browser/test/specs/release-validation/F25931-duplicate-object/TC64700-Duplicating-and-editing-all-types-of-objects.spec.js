import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import { objectsList } from '../../../constants/objects-list';
import {
  switchToPluginFrame, switchToRightPanelFrame, switchToPopupFrame, switchToDialogFrame
} from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import pluginPopup from '../../../helpers/plugin/plugin.popup';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { pressEnter } from '../../../helpers/utils/keyboard-actions';
import pluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import officeWorksheet from '../../../helpers/office/office.worksheet';
import { excelSelectors } from '../../../constants/selectors/office-selectors';

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
    pluginRightPanel.clickImportDataButton();
    pluginPopup.importAnyObject(objectsList.reports.mergedHeaderReport, 1);
    waitForNotification();
    pluginRightPanel.closeNotificationOnHover();
    browser.pause(1000);

    console.log('Importing DATA_IMPORT_SQL_STATEMENT');
    officeWorksheet.openNewSheet();
    pluginRightPanel.clickAddDataButton();
    browser.pause(3333);
    pluginPopup.importObject(objectsList.datasets.datasetSQL);
    waitForNotification();
    pluginRightPanel.closeNotificationOnHover();
    browser.pause(1000);

    console.log('User Activity Dossier - accounts');
    officeWorksheet.openNewSheet();
    pluginRightPanel.clickAddDataButton();
    browser.pause(3333);
    const dossier = objectsList.dossiers.userActivityDossier;
    pluginPopup.openDossier(dossier.name);
    pluginPopup.selectAndImportVizualiation(dossier.visualizations.accounts);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    pluginRightPanel.closeNotificationOnHover();
    browser.pause(1000);

    console.log('Duplicate Report');
    officeWorksheet.openSheet(1);
    OfficeWorksheet.selectCell('E1');
    pluginRightPanel.duplicateObject(3);
    pluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    pluginRightPanel.clickDuplicatePopupEditBtn();
    switchToDialogFrame();
    pluginPopup.selectAllAttributes();
    pluginPopup.selectAllMetrics();
    pluginPopup.selectAttributesAndAttributeForms({ Category: [] });
    pluginPopup.selectObjectElements(['Cost']);
    pluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    pluginRightPanel.closeNotificationOnHover();

    console.log('Duplicate Dataset');
    officeWorksheet.openSheet(2);
    OfficeWorksheet.selectCell('H1');
    pluginRightPanel.duplicateObject(3);
    pluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    pluginRightPanel.clickDuplicatePopupEditBtn();
    switchToDialogFrame();
    pluginPopup.selectAllAttributes();
    pluginPopup.selectAllMetrics();
    pluginPopup.selectObjectElements(['Region', 'Avg Call Time']);
    pluginPopup.clickImport();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    pluginRightPanel.closeNotificationOnHover();

    console.log('Duplicate Dossier');
    officeWorksheet.openSheet(3);
    OfficeWorksheet.selectCell('D1');
    pluginRightPanel.duplicateObject(3);
    pluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    pluginRightPanel.clickDuplicatePopupEditBtn();
    switchToDialogFrame();
    const visualization = objectsList.dossiers.userActivityDossier.visualizations.dailyActiveAccounts;
    pluginPopup.selectAndImportVizualiation(visualization);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    pluginRightPanel.closeNotificationOnHover();
  });
});
