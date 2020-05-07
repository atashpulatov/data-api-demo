import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import { objectsList } from '../../../constants/objects-list';
import { switchToPluginFrame, switchToRightPanelFrame, switchToPopupFrame } from '../../../helpers/utils/iframe-helper';
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

describe('[F30463] Ability to sort on prepare data', () => {
  beforeAll(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
  });

  // Create test for each visType defined in visualizations
  it(`[TC64700] TC64700-Duplicating-and-editing-all-types-of-objects.spec) `, () => {
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
    pluginPopup.importObject(objectsList.datasets.datasetSQL);
    waitForNotification();
    pluginRightPanel.closeNotificationOnHover();
    browser.pause(1000);

    console.log('User Activity Dossier - accounts');
    officeWorksheet.openNewSheet();
    pluginRightPanel.clickAddDataButton();
    const dossier = objectsList.dossiers.userActivityDossier;
    pluginPopup.openDossier(dossier.name);
    pluginPopup.selectAndImportVizualiation(dossier.visualizations.accounts);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    pluginRightPanel.closeNotificationOnHover();
    browser.pause(1000);

    officeWorksheet.openSheet(1);
  });
});
