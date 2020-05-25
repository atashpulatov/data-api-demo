import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { switchToPromptFrame, switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';

describe('F30479 - Hardening of importing data from Dossier to Excel', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
  });

  it('[TC65052] - E2E hardening import from dossier', () => {
    console.group(`Import and edit viz from  ${objectsList.dossiers.withFilter.name}`);
    console.log('Add/Import data to A1 cell');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    console.log(`Find, select and open ${objectsList.dossiers.withFilter.name}`);
    PluginPopup.openDossier(objectsList.dossiers.withFilter.name);
    console.log('Select and import the visualization');
    PluginPopup.selectAndImportVisualization(objectsList.dossiers.withFilter.visualizations.vis1);
    console.log('Check success of data import');
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    console.log('Edit imported visualization');
    PluginRightPanel.editObject(1);
    browser.pause(3000);
    console.log('Wait for dossier to load, open filters panel, change filter values and click apply');
    switchToPromptFrame();
    const { dossierWindow } = popupSelectors;
    $(dossierWindow.buttonFilters).waitForDisplayed(60000, false, `${dossierWindow.buttonFilters} is not displayed`);
    $(dossierWindow.buttonFilters).waitForClickable(60000, false, `${dossierWindow.buttonFilters} is not clickable`);
    waitAndClick($(dossierWindow.buttonFilters), 1000);
    PluginPopup.selectValuesFromDossierListFilter(1, [1]);
    waitAndClick($(dossierWindow.filtersMenu.buttonApplyFilters), 1000);
    switchToPluginFrame();
    console.log('Import data from visualization');
    PluginPopup.clickImport();
    console.log('Check success of edited data import');
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);
    console.groupEnd();

    console.group(`Import viz from  ${objectsList.dossiers.withAttributeMetricSelector.name}`);
    console.log('Add/Import data to I1 cell');
    OfficeWorksheet.selectCell('I1');
    PluginRightPanel.clickAddDataButton();
    console.log(`Find, select and open ${objectsList.dossiers.withAttributeMetricSelector.name}`);
    PluginPopup.openDossier(objectsList.dossiers.withAttributeMetricSelector.name);
    console.log('Select and import the visualization');
    PluginPopup.selectAndImportVisualization(objectsList.dossiers.withAttributeMetricSelector.visualizations.vis1);
    console.log('Check success of data import');
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);
    console.groupEnd();
  });
});
