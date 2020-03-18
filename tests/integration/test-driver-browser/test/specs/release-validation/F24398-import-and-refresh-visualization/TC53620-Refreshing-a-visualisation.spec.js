import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { switchToExcelFrame, changeBrowserTab } from '../../../helpers/utils/iframe-helper';

describe('F24398 - Import and refresh visualization', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC53620] - Refreshing a visualisation', () => {
    const dossierObject = objectsList.dossiers.complexDossier;
    const D16 = $('#gridRows > div:nth-child(16) > div:nth-child(4) > div > div');
    const C10 = $('#gridRows > div:nth-child(10) > div:nth-child(3) > div > div');

    // It should import grid visualization
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(dossierObject.name);
    browser.pause(5555);
    PluginPopup.selectAndImportVizualiation(dossierObject.visualizations.grid);

    // Assert that import is successfully imported and cell D16 contains '$583,538'
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    switchToExcelFrame();
    OfficeWorksheet.selectCell('D16');
    expect(D16.getText()).toEqual('$583,538');

    // It should change value of cell C10, to make sure than after refreshed, its value its back to '$764,341'
    OfficeWorksheet.changeTextInCell('C10', 'test');

    // It should refresh the visualization
    PluginRightPanel.refreshFirstObjectFromTheList();
    waitForNotification();
    expect($(rightPanelSelectors.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.visualizationRefreshed);

    browser.pause(1000);
    switchToExcelFrame();
    OfficeWorksheet.selectCell('C10');
    expect(C10.getText()).toEqual('$764,341');
  });
});
