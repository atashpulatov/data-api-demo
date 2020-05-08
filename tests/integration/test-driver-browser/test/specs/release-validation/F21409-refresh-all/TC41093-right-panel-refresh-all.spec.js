import OfficeLogin from '../../../helpers/office/office.login';
import PluginPopUp from '../../../helpers/plugin/plugin.popup';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import { objectsList } from '../../../constants/objects-list';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';

describe('F21409 - Refresh All - ', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });


  it('[TC41094] - Refreshing at least 10 already imported objects with very long names', () => {
    PluginPopUp.importObjectToCellAndAssertSuccess('A1', objectsList.reports.reportXML, 'First object should be imported');
    PluginPopUp.importObjectToCellAndAssertSuccess('I1', objectsList.reports.reportXML, 'Second object should be imported', true);
    PluginPopUp.importObjectToCellAndAssertSuccess('A21', objectsList.datasets.datasetSQL, 'Fourth object should be imported', true);
    PluginPopUp.importObjectToCellAndAssertSuccess('G21', objectsList.datasets.datasetSQL, 'Fifth object should be imported', true);
    PluginPopUp.importObjectToCellAndAssertSuccess('M21', objectsList.datasets.datasetSQL, 'Sixth object should be imported', true);
    PluginPopUp.importObjectToCellAndAssertSuccess('A41', objectsList.reports.reportWithLongName, 'Seventh object should be imported', true);
    PluginPopUp.importObjectToCellAndAssertSuccess('F41', objectsList.reports.longReportWithInvalidCharacters.sourceName, 'Eighth object should be imported', true);
    PluginPopUp.importObjectToCellAndAssertSuccess('L41', objectsList.reports.longReportWithInvalidCharacters.sourceName, 'Ninth object should be imported', true);
    PluginPopUp.importObjectToCellAndAssertSuccess('S41', objectsList.reports.reportWithLongName, 'Tenth object should be imported', true);

    console.log('Should refresh all');
    PluginRightPanel.refreshAll();

    console.log('Should close notifications and assert the "Refresh complete" message');
    PluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);
    PluginRightPanel.waitAndCloseNotification(dictionary.en.reportRefreshed);
  });
});
