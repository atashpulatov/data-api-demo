import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objects as o } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import settings from '../../../config';

describe('IMPORT diferent types of vizualizations', () => {
  beforeEach(() => {
    browser.setWindowSize(1500, 900);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login(settings.officeOnline.username, settings.officeOnline.password);
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    PluginRightPanel.loginToPlugin(settings.env.username, settings.env.password);
  });
  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('Import heat map visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.heatMap);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import grid visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.grid);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import barChart visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.barChart);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import lineChart visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.lineChart);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import areaChart visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.areaChart);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import bubbleChart visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.bubbleChart);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import pieChart visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.pieChart);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import comboChart visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.comboChart);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import geospatialService visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.geospatialService);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import network visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.network);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import histogram visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.histogram);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import boxPlot visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.boxPlot);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import waterfall visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.waterfall);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import map visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.map);
    waitForNotification();
    browser.pause(5000);
  });
  it('Import KPI visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.KPI);
    waitForNotification();
    browser.pause(5000);
  });
});
