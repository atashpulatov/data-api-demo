import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { objects as o } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import settings from '../../../config';

describe('IMPORT diferent types of vizualizations', () => {
  beforeAll(() => {
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

  beforeEach(() => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
  });

  afterEach(() => {
    browser.pause(100);
    PluginRightPanel.removeFirstObjectFromTheList();
    browser.pause(1000);
  });

  afterAll(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  })

  it('Should import heatMap visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.heatMap);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import grid visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.grid);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import barChart visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.barChart);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import lineChart visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.lineChart);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import areaChart visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.areaChart);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import bubbleChart visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.bubbleChart);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import pieChart visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.pieChart);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import comboChart visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.comboChart);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import geospatialService visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.geospatialService);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import network visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.network);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import histogram visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.histogram);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import boxPlot visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.boxPlot);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import waterfall visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.waterfall);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import map visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.map);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import KPI visualization', () => {
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, dossierObject.timeToOpen);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.KPI);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
