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
  const { name, timeToOpen, visualizations } = o.dossiers.complexDossier;
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
    PluginPopup.openDossier(name, timeToOpen);
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
    PluginPopup.selectAndImportVizualiation(visualizations.heatMap);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import grid visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.grid);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import barChart visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.barChart);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import lineChart visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.lineChart);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import areaChart visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.areaChart);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import bubbleChart visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.bubbleChart);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import pieChart visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.pieChart);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import comboChart visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.comboChart);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import geospatialService visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.geospatialService);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import network visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.network);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import histogram visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.histogram);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import boxPlot visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.boxPlot);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import waterfall visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.waterfall);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import map visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.map);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  })

  it('Should import KPI visualization', () => {
    PluginPopup.selectAndImportVizualiation(visualizations.KPI);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
