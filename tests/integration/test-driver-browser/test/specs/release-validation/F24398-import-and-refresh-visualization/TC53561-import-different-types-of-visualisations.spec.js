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

  afterAll(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  })

  // Create test for each visType defined in visualizations
  Object.keys(visualizations).forEach(visType => {
    it(`should import ${visType} visualization`, () => {
      // beforeEach
      OfficeWorksheet.selectCell('A1');
      PluginRightPanel.clickImportDataButton();
      PluginPopup.openDossier(name, timeToOpen);
      // test
      PluginPopup.selectAndImportVizualiation(visualizations[visType]);
      waitForNotification();
      expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
      // afterEach
      browser.pause(100);
      PluginRightPanel.removeFirstObjectFromTheList();
      browser.pause(1000);
    })
  });
});
