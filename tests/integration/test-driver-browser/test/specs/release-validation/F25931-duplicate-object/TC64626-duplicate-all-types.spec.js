import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';

describe('F25931 - Duplicate object', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC64626] - Duplicate all types of objects', () => {
    console.log('Import Report - Seasonal Report');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.reports.seasonalReport);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Import Dataset - Sales Records 1k - to new worksheet');
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    PluginPopup.switchLibrary(false);
    PluginPopup.importObject(objectsList.datasets.salesRecords1k);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Import Bubble Chart from Complex Dossier to new worksheet');
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    const dossierObject = objectsList.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, null, false);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.bubbleChart);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    console.log('Save initial number of worksheets');
    const initialNumberOfWorksheets = OfficeWorksheet.getNumberOfWorksheets();

    console.log('Go to 1 excel worksheet');
    OfficeWorksheet.openSheet(1);
    console.log('Select G1 cell');
    OfficeWorksheet.selectCell('G1');
    console.log('Open Duplicate Popup for imported Seasonal Report');
    PluginRightPanel.duplicateObject(3);
    console.log('Select actibe cell option in duplicate popup');
    PluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    console.log('Click import button in duplicate popup');
    PluginRightPanel.clickDuplicatePopupImportBtn();
    console.log('Check duplicated Seasonal Report');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.reports.seasonalReport} Copy`);

    console.log('Go to 2 excel worksheet');
    OfficeWorksheet.openSheet(2);
    console.log('Select R1 cell');
    OfficeWorksheet.selectCell('R1');
    console.log('Open Duplicate Popup for imported Sales Records 1k');
    PluginRightPanel.duplicateObject(3);
    console.log('Select actibe cell option in duplicate popup');
    PluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    console.log('Click import button in duplicate popup');
    PluginRightPanel.clickDuplicatePopupImportBtn();
    console.log('Check duplicated Sales Records 1k');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`${objectsList.datasets.salesRecords1k} Copy`);

    console.log('Go to 3 excel worksheet');
    OfficeWorksheet.openSheet(3);
    console.log('Select A10 cell');
    OfficeWorksheet.selectCell('A10');
    console.log('Open Duplicate Popup for imported Bubble Chart');
    PluginRightPanel.duplicateObject(3);
    console.log('Select actibe cell option in duplicate popup');
    PluginRightPanel.selectActiveCellOptionInDuplicatePopup();
    console.log('Click import button in duplicate popup');
    PluginRightPanel.clickDuplicatePopupImportBtn();
    console.log('Check duplicated Bubble Chart');
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.duplicateSucces);
    PluginRightPanel.closeNotificationOnHover();
    expect(PluginRightPanel.getNameOfObject(1)).toBe(`Bubble Chart Copy`);

    console.log('Check if all objects were duplicated to active cells (number of worksheets did not change)');
    expect(OfficeWorksheet.getNumberOfWorksheets()).toBe(initialNumberOfWorksheets);
  });
});
