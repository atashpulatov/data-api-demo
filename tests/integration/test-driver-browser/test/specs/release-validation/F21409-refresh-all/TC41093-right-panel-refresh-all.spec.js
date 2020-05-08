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
    const objects = [
      {
        cellValue: 'A1', object: objectsList.reports.reportXML, message: 'First object should be imported', add: false
      },
      {
        cellValue: 'I1', object: objectsList.reports.reportXML, message: 'Second object should be imported', add: true
      },
      {
        cellValue: 'Q1', object: objectsList.reports.reportXML, message: 'Third object should be imported', add: true
      },
      {
        cellValue: 'A21', object: objectsList.datasets.datasetSQL, message: 'Fourth object should be imported', add: true
      },
      {
        cellValue: 'G21', object: objectsList.datasets.datasetSQL, message: 'Fifth object should be imported', add: true
      },
      {
        cellValue: 'M21', object: objectsList.datasets.datasetSQL, message: 'Sixth object should be imported', add: true
      },
      {
        cellValue: 'A41', object: objectsList.reports.reportWithLongName, message: 'Seventh object should be imported', add: true
      },
      {
        cellValue: 'F41', object: objectsList.reports.longReportWithInvalidCharacters.sourceName, message: 'Eighth object should be imported', add: true
      },
      {
        cellValue: 'L41', object: objectsList.reports.longReportWithInvalidCharacters.sourceName, message: 'Ninth object should be imported', add: true
      },
      {
        cellValue: 'S41', object: objectsList.reports.reportWithLongName, message: 'Tenth object should be imported', add: true
      }
    ];

    objects.forEach((obj) => {
      const {
        cellValue, object, message, add
      } = obj;
      PluginPopUp.importObjectToCellAndAssertSuccess(cellValue, object, message, add);
    });


    PluginRightPanel.refreshAll();

    console.log('Should close notifications and assert the "Refresh complete" message');
    for (let i = 0; i < 10; i++) {
      const { reportRefreshed } = dictionary.en;
      PluginRightPanel.waitAndCloseNotification(reportRefreshed);
    }
  });
});
