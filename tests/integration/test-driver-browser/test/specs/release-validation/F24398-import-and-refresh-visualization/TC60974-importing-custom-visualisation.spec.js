import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objects as o } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import settings from '../../../config';
import { switchToExcelFrame } from '../../../helpers/utils/iframe-helper';

describe('F24398 - Import and refresh visualization', () => {
  beforeEach(() => {
    browser.setWindowSize(2200, 900);
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

  it('[TC60974] - Importing custom visualization', () => {
    const dossierObject = o.dossiers.customVisualizations;
    const D18 = $('#gridRows > div:nth-child(18) > div:nth-child(4) > div > div');

    // It should import grid visualization
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(dossierObject.name);
    browser.pause(5555);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.GoogleTimeline);

    // Assert that import is successfully imported and cell D18 contains "1/1/2013"
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    switchToExcelFrame();
    OfficeWorksheet.selectCell('D18');
    expect(D18.getText()).toEqual('1/1/2013');
  });
});
