import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { objectsList as o } from '../../../constants/objects-list';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors as se } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import settings from '../../../config';
import { switchToExcelFrame, switchToRightPanelFrame } from '../../../helpers/utils/iframe-helper';

describe('F24398 - Import and refresh visualization', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });

  afterEach(() => {
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('[TC61043] - Refreshing a visualisation', () => {
    const { promptedDossier } = o.dossiers;
    const D9 = '#gridRows > div:nth-child(9) > div:nth-child(4) > div > div';

    // It should import grid visualization
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.openDossier(promptedDossier.name, null, false);
    PluginPopup.importDefaultPromptedVisualisation(promptedDossier.visualizations.vis1);

    // Assert that import is successfully imported and cell D16 contains '$583,538'
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.importSuccess);
    browser.pause(1000);
    switchToExcelFrame();
    browser.pause(3000);
    OfficeWorksheet.selectCellAlternatively('D9');
    browser.pause(2000);
    expect($(D9).getText()).toEqual('$560,033');

    // It should edit grid visualization and confirm that the visualization was refreshed
    switchToRightPanelFrame();
    PluginPopup.repromptDefaultVisualisation()
    waitForNotification();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain(dictionary.en.visualizationRefreshed);

    browser.pause(3000);

    // It should delete the visualization
    PluginRightPanel.removeFirstObjectFromTheList();
    expect($(se.notificationPopUp).getAttribute('textContent')).toContain('Visualization 1 has been removed from the workbook.');


    // It should confirm that the visualization was deleted
    switchToExcelFrame();
    OfficeWorksheet.selectCellAlternatively('D9');
    browser.pause(2000);
    const cellText = '#formulaBarTextDivId_textElement > div > br';
    switchToExcelFrame();
    expect($(cellText).isExisting()).toBe(false);
    browser.pause(2000);

    // It should log out
    switchToRightPanelFrame();
    PluginRightPanel.logout();
  });
});
