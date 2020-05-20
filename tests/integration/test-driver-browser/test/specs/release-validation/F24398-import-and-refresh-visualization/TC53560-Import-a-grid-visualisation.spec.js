import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { switchToPluginFrame, switchToPromptFrame } from '../../../helpers/utils/iframe-helper';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { logStep } from '../../../helpers/utils/allure-helper';

describe('F24398 - Import and refresh visualization', () => {
   beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  }); 

  it('[TC53560] - Importing grid visualisations - basic scenario', () => {
    const { visualizationManipulation, dossierWithPagesAndChapters } = objectsList.dossiers;
    const { name, visualizations } = visualizationManipulation;
    const { name: visualizationManipulationName, getTableItemAt } = visualizations.visualization1;
    const { name: dossierWithPagesAndChaptersName, defaultGridVisualization, gridVisualizationWithFilters } = dossierWithPagesAndChapters;
    const dossierVisManipulationVisID = visualizationManipulation.visualizations.visualization1.name;
    const { filterCostInput } = popupSelectors;
    const yearAttribute = getTableItemAt(1, 1);
    const profitMetric = getTableItemAt(1, 3);
    const revenueMetric = getTableItemAt(1, 4);

    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();

    logStep('Import Dossier with vis that can be moved to different pages / chapters');
    PluginPopup.importAnyObject(dossierWithPagesAndChaptersName, 1);
    PluginPopup.selectVizualiation(defaultGridVisualization);
    browser.pause(2000);
    switchToPromptFrame();
    PluginPopup.goToDossierPageOrChapter(4);
    browser.pause(1000);
    PluginPopup.goToDossierPageOrChapter(3);
    browser.pause(1000);
    PluginPopup.applyDossierBookmark(2);
    browser.pause(1000);
    PluginPopup.refreshDossier();
    browser.pause(1000);
    PluginPopup.setFilterOnDossier(filterCostInput, 500)
    PluginPopup.selectVizualiation(gridVisualizationWithFilters);
    switchToPluginFrame();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('Import Visualization manipulation');
    OfficeWorksheet.selectCell('H1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importAnyObject(name, 1);
    PluginPopup.selectVizualiation(visualizationManipulationName);
    PluginPopup.showTotals(yearAttribute);
    PluginPopup.sortAscending(profitMetric);
    PluginPopup.sortDescending(revenueMetric);
    PluginPopup.drillByCategory(yearAttribute);
    switchToPluginFrame();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('Change visualization name');
    PluginRightPanel.changeObjectName(1, 'Visualization-name');
    browser.pause(2000);
    PluginRightPanel.changeObjectNameUsingMenu(1, 'Modified-visualization-name');
    PluginRightPanel.refreshObject(1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    OfficeWorksheet.selectCell('L1');
    logStep('Open Dossier Visualization Manipulation');
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

    logStep('Import compound grid');
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

    logStep('Click back button');
    PluginPopup.clickBack();

    logStep('Import custom visualizations dossier');
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

    clogStep('Import prompted dossier');
    const { promptedDossier } = objectsList.dossiers;
    const { vis1 } = promptedDossier.visualizations;
    OfficeWorksheet.selectCell('AA20');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(promptedDossier.name);
    PluginPopup.importDefaultPromptedVisualisation(vis1);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    logStep('Import Dossier with different custom visualizations');
    const { dossierWithDifferentCustomVis } = objectsList.dossiers;
    const { worldCloud, googleTimeLine, sequenceSunburst } = dossierWithDifferentCustomVis.Visualizations;
    logStep('Import D3 WorldCloud visualization');
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
