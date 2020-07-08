import OfficeLogin from '../../helpers/office/office.login';
import OfficeWorksheet from '../../helpers/office/office.worksheet';
import PluginRightPanel from '../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../helpers/plugin/plugin.popup';
import { objectsList } from '../../constants/objects-list';
import { waitForNotification } from '../../helpers/utils/wait-helper';
import { changeBrowserTab } from '../../helpers/utils/iframe-helper';

describe('F24398 - Import and refresh visualization', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('[TC54783] Manipulation of grid visualization such as totals, ordering and drilling', () => {
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    const dossierObject = objectsList.dossiers.visualizationManipulation;
    PluginPopup.openDossier(dossierObject.name, 30000);
    const yearAttribute = dossierObject.visualizations.visualization1.getTableItemAt(1, 1);
    const profitMetric = dossierObject.visualizations.visualization1.getTableItemAt(1, 3);
    const revenueMetric = dossierObject.visualizations.visualization1.getTableItemAt(1, 4);
    const totalText = dossierObject.visualizations.visualization1.getTableItemAt(2, 1);
    const profitText = dossierObject.visualizations.visualization1.getTableItemAt(3, 3);
    const revenueText = dossierObject.visualizations.visualization1.getTableItemAt(3, 4);
    const categoryText = dossierObject.visualizations.visualization1.getTableItemAt(3, 1);
    PluginPopup.showTotals(yearAttribute);
    expect($(totalText).getText()).toEqual('Total');
    PluginPopup.sortAscending(profitMetric);
    expect($(profitText).getText()).toEqual('$150,472');
    PluginPopup.sortDescending(revenueMetric);
    expect($(revenueText).getText()).toEqual('$1,553,525');
    PluginPopup.drillByCategory(yearAttribute);
    expect($(categoryText).getText()).toEqual('Books');
    PluginPopup.selectAndImportVisualization(dossierObject.visualizations.visualization1.name);
    waitForNotification();
    PluginRightPanel.closeNotificationOnHover();
    browser.pause(5000);
  });
});
