import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objects as o } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import settings from '../../../config';
import pluginPopup from '../../../helpers/plugin/plugin.popup';

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

  it('Import grid visualization', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = o.dossiers.visualizationManipulation;
    PluginPopup.openDossier(dossierObject.name);
    PluginPopup.doManipulations(dossierObject.visualizations.visualization1.attributeId);
    //    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.Visualization1);
    //    waitForNotification();
    //    browser.pause(5000);
  });
});
