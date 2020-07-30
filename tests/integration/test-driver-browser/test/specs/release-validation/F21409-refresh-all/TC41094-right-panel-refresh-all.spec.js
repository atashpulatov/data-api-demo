import OfficeLogin from '../../../helpers/office/office.login';
import PluginPopUp from '../../../helpers/plugin/plugin.popup';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import { objectsList } from '../../../constants/objects-list';
import { changeBrowserTab } from '../../../helpers/utils/iframe-helper';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { logStep } from '../../../helpers/utils/allure-helper';

describe('F21409 - Add "Refresh All" functionality', () => {
  beforeEach(() => {
    OfficeLogin.openExcelAndLoginToPlugin();
  });
  afterEach(() => {
    browser.closeWindow();
    changeBrowserTab(0);
  });


  it('[TC41094] - Refreshing at least 10 already imported objects with very long names', () => {
    const objects = [
      {
        cellValue: 'A1', object: objectsList.reports.seasonalReport, message: 'First object should be imported', add: false
      },
      {
        cellValue: 'I1', object: objectsList.reports.seasonalReport, message: 'Second object should be imported', add: true
      },
      {
        cellValue: 'Q1', object: objectsList.reports.seasonalReport, message: 'Third object should be imported', add: true
      },
      {
        cellValue: 'A50', object: objectsList.datasets.basicDataset, message: 'Fourth object should be imported', add: true
      },
      {
        cellValue: 'Q50', object: objectsList.datasets.basicDataset, message: 'Fifth object should be imported', add: true
      },
      {
        cellValue: 'AG50', object: objectsList.datasets.basicDataset, message: 'Sixth object should be imported', add: true
      },
      {
        cellValue: 'A152', object: objectsList.reports.reportWithLongName, message: 'Seventh object should be imported', add: true
      },
      {
        cellValue: 'F152', object: objectsList.reports.longReportWithInvalidCharacters.sourceName, message: 'Eighth object should be imported', add: true
      },
      {
        cellValue: 'L152', object: objectsList.reports.longReportWithInvalidCharacters.sourceName, message: 'Ninth object should be imported', add: true
      },
      {
        cellValue: 'S152', object: objectsList.reports.reportWithLongName, message: 'Tenth object should be imported', add: true
      }
    ];

    objects.forEach((obj) => {
      const {
        cellValue, object, message, add
      } = obj;
      PluginPopUp.importObjectToCellAndAssertSuccess(cellValue, object, message, add);
    });


    PluginRightPanel.refreshAll();

    logStep(`+ Closing all ${objects.length} notifications and asserting the "Refresh complete" message...`);
    for (let i = 0; i < objects.length; i++) {
      const { reportRefreshed } = dictionary.en;
      PluginRightPanel.waitAndCloseNotification(reportRefreshed);
    }
  });
});
