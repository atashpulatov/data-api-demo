import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';


describe('F24398 - Import and refresh visualization', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC54787] - Importing grid visualisations from prompted dossiers', () => {
    console.log('It should import grid visualization');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();

    console.log('Should open dossier');
    PluginPopup.openDossier(objectsList.dossiers.promptedDossier.name);

    console.log('Should click run on prompted dossier');
    PluginPopup.importDefaultPromptedVisualisation(objectsList.dossiers.promptedDossier.visualizations.vis1);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
