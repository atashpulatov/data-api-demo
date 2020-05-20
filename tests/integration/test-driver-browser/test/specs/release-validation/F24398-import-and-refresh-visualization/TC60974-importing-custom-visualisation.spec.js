import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { switchToExcelFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import pluginRightPanel from '../../../helpers/plugin/plugin.right-panel';

describe('F24398 - Import and refresh visualization', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC60974] - Importing custom visualization', () => {
    const dossierObject = objectsList.dossiers.customVisualizations;
    const D18 = $('#gridRows > div:nth-child(18) > div:nth-child(4) > div > div');

    // It should import grid visualization
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.switchLibraryAndImportObject(dossierObject.name, null, false);
    browser.pause(5555);
    PluginPopup.selectAndImportVisualization(dossierObject.visualizations.GoogleTimeline);

    // Assert that import is successfully imported and cell D18 contains "1/1/2013"
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    pluginRightPanel.closeNotificationOnHover();
    switchToExcelFrame();
    OfficeWorksheet.selectCell('D18');
    expect(D18.getText()).toEqual('01/01/2013');
  });
});
