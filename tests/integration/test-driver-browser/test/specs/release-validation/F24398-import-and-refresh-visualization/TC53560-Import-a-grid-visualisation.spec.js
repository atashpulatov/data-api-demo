import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { stringsUsedInSpecs } from '../../../constants/strings-used-in-specs';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { switchToExcelFrame } from '../../../helpers/utils/iframe-helper';

describe('F24398 - Import and refresh visualization', () => {
/*   beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  }); */

  it('[TC53560] - Importing grid visualisations - basic scenario', () => {
    /* const dossierObject = objectsList.dossiers.complexDossier;
    const D16 = $('#gridRows > div:nth-child(16) > div:nth-child(4) > div > div');

    // It should import grid visualization
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importAnyObject(dossierObject.name, 1);
    browser.pause(5555);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.grid);

    // Assert that import is successfully imported and cell D16 contains '$583,538'
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    PluginRightPanel.closeNotificationOnHover();
    switchToExcelFrame();
    OfficeWorksheet.selectCell('D16');
    expect(D16.getText()).toEqual('$583,538'); */

    const { visualizationManipulation } = objectsList.dossiers;
    const dossierVisManipulationVisID = visualizationManipulation.visualizations.visualization1.name;

    OfficeWorksheet.selectCell('L1');
    console.log('Open Dossier Visualization Manipulation');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(visualizationManipulation.name);

    PluginPopup.openShowDataPanel(dossierVisManipulationVisID);
    PluginPopup.closeShowDataPanel();

    PluginPopup.exportToExcel(dossierVisManipulationVisID);
    PluginPopup.exportToPDF(dossierVisManipulationVisID);
    PluginPopup.exportToData(dossierVisManipulationVisID);

    PluginPopup.selectAndImportVizualiation(visualizationManipulation.visualizations.visualization1.name);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    PluginRightPanel.removeObject(1);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.objectRemoved);

    PluginRightPanel.removeObjectWithRightClick(1);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.objectRemoved);

    const { dossierWithBasicGrid } = objectsList.dossiers;
    const { gridWithSubtotalsAndCrosstabs } = dossierWithBasicGrid.visualizations;
    OfficeWorksheet.selectCell('G1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierWithBasicGrid.name);
    PluginPopup.selectAndImportVizualiation(gridWithSubtotalsAndCrosstabs);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    console.log('Import compound grid');
    const { dossierWithCompoundGrid } = objectsList.dossiers;
    const { visualization1 } = dossierWithCompoundGrid.visualizations;
    OfficeWorksheet.selectCell('AA1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierWithCompoundGrid.name);
    PluginPopup.selectAndMoveToImportVisualization(visualization1);
    const importButtonTooltip = $(popupSelectors.importButtonTooltip);
    importButtonTooltip.waitForDisplayed(60000, false, `${importButtonTooltip} is not displayed`);
    const tooltipText = importButtonTooltip.getText();
    expect(tooltipText).toBe(stringsUsedInSpecs.versionError);

    console.log('Click back button');
    PluginPopup.clickBack();

    console.log('Import custom visualizations dossier');
    const { customVisualizations } = objectsList.dossiers;
    const { GoogleTimeline, modelsByYear } = customVisualizations.visualizations;
    PluginPopup.openDossier(customVisualizations.name);
    PluginPopup.selectAndImportVizualiation(GoogleTimeline);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    OfficeWorksheet.selectCell('AG1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(customVisualizations.name);
    PluginPopup.selectAndImportVizualiation(modelsByYear);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    console.log('Import prompted dossier');
    const { promptedDossier } = objectsList.dossiers;
    const { vis1 } = promptedDossier.visualizations;
    OfficeWorksheet.selectCell('AA20');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(promptedDossier.name);
    PluginPopup.importDefaultPromptedVisualisation(vis1);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    console.log('Import Dossier with different custom visualizations');
    const { dossierWithDifferentCustomVis } = objectsList.dossiers;
    const { worldCloud, googleTimeLine, sequenceSunburst } = dossierWithDifferentCustomVis.Visualizations;
    console.log('Import D3 WorldCloud visualization');
    OfficeWorksheet.selectCell('AG20');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierWithDifferentCustomVis.name);
    PluginPopup.selectAndImportVizualiation(worldCloud);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    OfficeWorksheet.selectCell('AL20');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierWithDifferentCustomVis.name);
    PluginPopup.selectAndImportVizualiation(googleTimeLine);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    OfficeWorksheet.selectCell('AS20');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierWithDifferentCustomVis.name);
    PluginPopup.selectAndImportVizualiation(sequenceSunburst);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);
  });
});
