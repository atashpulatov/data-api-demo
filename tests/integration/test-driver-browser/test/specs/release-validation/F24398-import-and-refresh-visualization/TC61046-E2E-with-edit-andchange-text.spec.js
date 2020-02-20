import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';
import { switchToPluginFrame } from '../../../helpers/utils/iframe-helper';

describe('IMPORT diferent types of vizualizations', () => {
  beforeAll(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  // Create test for each visType defined in visualizations
  it(`[TC61046] E2E with Complex dossier (20 visualizations) `, () => {
    // beforeEach
    OfficeWorksheet.selectCellAlternatively('A3');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = objectsList.dossiers.userActivityDossier;
    PluginPopup.openDossier(dossierObject.name, null, false);
    // test
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.accounts);
    waitForNotification();
    browser.pause(3000);
    OfficeWorksheet.selectCellAlternatively('E3');
    PluginRightPanel.clickAddDataButton();
    PluginPopup.openDossier(dossierObject.name, null, false);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.dailyActiveAccounts);
    waitForNotification();
    browser.pause(3000);
    OfficeWorksheet.replaceAllThatMatches('Date', 'TEXT');
    browser.pause(1000);
    PluginRightPanel.refreshAll();
    waitForPopup();
    browser.pause(3000);
    PluginPopup.closeRefreshAll();
    browser.pause(3000);
    PluginRightPanel.edit();
    browser.pause(3000);
    PluginPopup.editAndImportVizualization(dossierObject.visualizations.accounts);
    waitForNotification();
    browser.pause(3000);
    OfficeWorksheet.selectCellAlternatively('E4');
    browser.pause(2000);
    const cellE4 = '#gridRows > div:nth-child(4) > div:nth-child(1) > div';
    expect($(cellE4).getText()).toEqual('7');
    switchToPluginFrame();
    PluginRightPanel.logout();
    browser.pause(3000);
  })
});
