import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';
import { writeDataIntoFile, getJsonData } from '../../../helpers/utils/benchmark-helper';
import { objects as o } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import { selectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { selectors as s } from '../../../constants/selectors/popup-selectors';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import settings from '../../../config';

describe('F24398 - import and refresh visualization', () => {
  beforeEach(() => {
    // browser.setWindowSize(2200,900);
    browser.setWindowSize(1600, 900);
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

  it('TC53620 - Refreshing a visualisation', () => {
    const dossierObject = o.dossiers.complexDossier;

    // it should import grid visualization
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(dossierObject.name);
    browser.pause(5555);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.grid);
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);

    // should refresh the visualization
    PluginRightPanel.refreshFirstObjectFromTheList();
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.visualizationRefreshed);
  });
});
