import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { objects as o } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import settings from '../../../config';
import { switchToExcelFrame } from '../../../helpers/utils/iframe-helper';

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

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  // Create test for each visType defined in visualizations
  it(`[TC61046] E2E with Complex dossier (20 visualizations) `, () => {
    // beforeEach
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.complexDossier;
    PluginPopup.openDossier(dossierObject.name, null, false);
    // test
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.heatMap);
    waitForNotification();
    browser.pause(5000);
    OfficeWorksheet.selectCell('F1');
    browser.pause(1000);
    OfficeWorksheet.selectCell('F1');
    browser.pause(1000);
    OfficeWorksheet.selectCell('F1');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name, null, true);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.grid);
    waitForNotification();
    browser.pause(5000);
  })
});
