import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import settings from '../../../config';

describe('F24398 - Import and refresh visualization', () => {
  const { name, timeToOpen, visualizations } = objectsList.dossiers.complexDossier;

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

  // Create test for each visType defined in visualizations
  Object.keys(visualizations).forEach(visType => {
    it(`[TC53561] import different types of visualisations should import ${visType} visualization`, () => {
      // beforeEach
      OfficeWorksheet.selectCell('A1');
      PluginRightPanel.clickImportDataButton();
      PluginPopup.openDossier(name, timeToOpen);
      // test
      PluginPopup.selectAndImportVizualiation(visualizations[visType]);
      waitForNotification();
      expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
      // afterEach
      browser.pause(100);
      PluginRightPanel.removeFirstObjectFromTheList();
      browser.pause(1000);
    })
  });
});
