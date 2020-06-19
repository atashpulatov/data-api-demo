import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { switchToPluginFrame, switchToPromptFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { logStep } from '../../../helpers/utils/allure-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { stringsUsedInSpecs } from '../../../constants/strings-used-in-specs';

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
    const { name: dossierWithPagesAndChaptersName, gridVisualization } = dossierWithPagesAndChapters;
    const { getVizAT } = popupSelectors.dossierWindow;
    const yearAttribute = getTableItemAt(1, 1);
    const profitMetric = getTableItemAt(1, 3);
    const revenueMetric = getTableItemAt(1, 4);

    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();

    logStep('+ Import Dossier with vis that can be moved to different pages / chapters');
    PluginPopup.importAnyObject(dossierWithPagesAndChaptersName, 1);
    PluginPopup.addToLibrary();
    PluginPopup.selectVisualization(gridVisualization);
    browser.pause(2000);
    switchToPromptFrame();
    PluginPopup.goToDossierPageOrChapter(4);
    browser.pause(1000);
    PluginPopup.goToDossierPageOrChapter(3);
    browser.pause(1000);
    PluginPopup.applyDossierBookmark(1);
    browser.pause(1000);
    PluginPopup.setYearFilterOnDossier(false, 'increase');
    browser.pause(1000);
    PluginPopup.refreshDossier();
    PluginPopup.selectVisualization(gridVisualization);
    switchToPluginFrame();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('+ Import Visualization manipulation');
    OfficeWorksheet.selectCell('H1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.importAnyObject(name, 1);
    PluginPopup.selectVisualization(visualizationManipulationName);
    PluginPopup.showTotals(yearAttribute);
    PluginPopup.sortAscending(profitMetric);
    PluginPopup.sortDescending(revenueMetric);
    PluginPopup.drillByCategory(yearAttribute);
    switchToPluginFrame();
    PluginPopup.clickImport();
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    logStep('+ Change visualization name');
    PluginRightPanel.changeObjectName(1, 'Visualization-name');
    browser.pause(2000);
    PluginRightPanel.changeObjectNameUsingMenu(1, 'Modified-visualization-name');
    PluginRightPanel.refreshObject(1);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();

    OfficeWorksheet.selectCell('N1');
    logStep('+ Open Dossier Visualization Manipulation');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(name);
    PluginPopup.openShowDataPanel(visualizationManipulationName);
    PluginPopup.closeShowDataPanel();

    // TODO : Uncomment this part when export is available (DE162814)
    // PluginPopup.exportToExcel(visualizationManipulationName);
    // PluginPopup.exportToPDF(visualizationManipulationName);
    // PluginPopup.exportToData(visualizationManipulationName);

    PluginPopup.selectAndImportVisualization(visualizationManipulationName);
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
    PluginPopup.selectAndImportVisualization(gridWithSubtotalsAndCrosstabs);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    logStep('+ Import compound grid');
    const { dossierWithCompoundGrid } = objectsList.dossiers;
    const { visualization1 } = dossierWithCompoundGrid.visualizations;
    OfficeWorksheet.selectCell('AC1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierWithCompoundGrid.name);
    PluginPopup.selectAndMoveToImportVisualization(visualization1);
    const importButtonTooltip = $(popupSelectors.importButtonTooltip);
    importButtonTooltip.waitForDisplayed(60000, false, `${importButtonTooltip} is not displayed`);
    const tooltipText = importButtonTooltip.getText();
    expect(tooltipText).toBe(stringsUsedInSpecs.versionError);

    logStep('Click back button');
    PluginPopup.clickBack();

    logStep('+ Import custom visualizations dossier');
    const { customVisualizations } = objectsList.dossiers;
    const { GoogleTimeline, modelsByYear } = customVisualizations.visualizations;
    PluginPopup.openDossier(customVisualizations.name);
    PluginPopup.selectAndImportVisualization(GoogleTimeline);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    OfficeWorksheet.selectCell('AI1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(customVisualizations.name);
    PluginPopup.selectAndImportVisualization(modelsByYear);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    logStep('+ Import prompted dossier');
    const { promptedDossier2 } = objectsList.dossiers;
    const { vis1 } = promptedDossier2.visualizations;
    OfficeWorksheet.selectCell('AA20');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(promptedDossier2.name);
    PluginPopup.importDefaultPromptedVisualisation(vis1);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);


    logStep('+ Import Dossier with different custom visualizations');
    const { dossierWithDifferentCustomVis } = objectsList.dossiers;
    const { worldCloud, googleTimeLine, sequenceSunburst } = dossierWithDifferentCustomVis.Visualizations;
    logStep('Import D3 WorldCloud visualization');
    OfficeWorksheet.selectCell('AG20');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierWithDifferentCustomVis.name);
    PluginPopup.selectAndImportVisualization(worldCloud);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    OfficeWorksheet.selectCell('AL20');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierWithDifferentCustomVis.name);
    PluginPopup.selectAndImportVisualization(googleTimeLine);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);

    OfficeWorksheet.selectCell('AS20');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierWithDifferentCustomVis.name);
    PluginPopup.selectAndImportVisualization(sequenceSunburst);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.importSuccess);
  });
});
