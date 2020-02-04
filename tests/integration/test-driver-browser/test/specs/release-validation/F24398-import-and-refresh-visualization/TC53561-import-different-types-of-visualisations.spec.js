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

  it('Should import all visualizations', () => {
    const dossierObject = o.dossiers.complexDossier;

    // it should import heatMap visualization
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.heatMap);
    waitForNotification();
    browser.pause(5000);

    // it should import grid visualization
    OfficeWorksheet.selectCell('J1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.grid);
    waitForNotification();
    browser.pause(5000);

    // it should import barChart visualization
    OfficeWorksheet.selectCell('S1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.barChart);
    waitForNotification();
    browser.pause(5000);

    // it should import lineChart visualization
    OfficeWorksheet.selectCell('AA1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.lineChart);
    waitForNotification();
    browser.pause(5000);

    // it should import areaChart visualization
    OfficeWorksheet.selectCell('AJ1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.areaChart);
    waitForNotification();
    browser.pause(5000);

    // it should import bubbleChart visualization
    OfficeWorksheet.selectCell('AS1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.bubbleChart);
    waitForNotification();
    browser.pause(5000);

    // it should import pieChart visualization
    OfficeWorksheet.selectCell('BA1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.pieChart);
    waitForNotification();
    browser.pause(5000);

    // it should import comboChart visualization
    OfficeWorksheet.selectCell('BJ1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.comboChart);
    waitForNotification();
    browser.pause(5000);

    // it should import geospatialService visualization
    OfficeWorksheet.selectCell('BS1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.geospatialService);
    waitForNotification();
    browser.pause(5000);

    // it should import network visualization
    OfficeWorksheet.selectCell('CA1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.network);
    waitForNotification();
    browser.pause(5000);

    // it should import histogram visualization
    OfficeWorksheet.selectCell('CJ1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.histogram);
    waitForNotification();
    browser.pause(5000);

    // it should import boxPlot visualization
    OfficeWorksheet.selectCell('CS1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.boxPlot);
    waitForNotification();
    browser.pause(5000);

    // it should import waterfall visualization
    OfficeWorksheet.selectCell('DA1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.waterfall);
    waitForNotification();
    browser.pause(5000);

    // it should import map visualization
    OfficeWorksheet.selectCell('DJ1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.map);
    waitForNotification();
    browser.pause(5000);

    // it should import KPI visualization
    OfficeWorksheet.selectCell('DS1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.KPI);
    waitForNotification();
    browser.pause(5000);
  });
});
