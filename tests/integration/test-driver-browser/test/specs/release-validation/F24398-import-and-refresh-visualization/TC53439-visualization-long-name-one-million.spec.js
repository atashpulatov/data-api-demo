import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import pluginPopup from '../../../helpers/plugin/plugin.popup';

describe('F24398 - Import and refresh visualization', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC53439] - Importing selected visualisations with long paths and 1 milion rows', () => {
    console.log('It should import grid visualization');
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();

    console.log('Should open dossier');
    pluginPopup.importAnyObject(objectsList.dossiers.oneMillionAndLongName.name);
    browser.pause(5555);

    console.log('Should select and import visualization');
    PluginPopup.selectAndImportVizualiation(objectsList.dossiers.oneMillionAndLongName.visualization);
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
  });
});
