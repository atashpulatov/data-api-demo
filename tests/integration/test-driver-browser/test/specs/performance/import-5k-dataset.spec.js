import OfficeLogin from '../../helpers/office/office.login';
import OfficeWorksheet from '../../helpers/office/office.worksheet';
import PluginRightPanel from '../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../helpers/plugin/plugin.popup';
import { changeBrowserTab } from '../../helpers/utils/iframe-helper';
import { writeDataIntoFile, getJsonData } from '../../helpers/utils/benchmark-helper';

describe('Smart Folder - IMPORT -', () => {
  const objectName = '5k Sales Records.csv';
  let totalAddedImportingTime = 0;
  let numberOfExecutions = 0;
  const serverVersion = 'Update 3'
  const rows = 5000;
  const columns = 15;
  const clientCPUCores = 6;
  const numberOfClicks = 10;
  let e2eTime = 0;
  beforeAll(() => {
    browser.setWindowSize(2200, 900);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login('test3@mstrtesting.onmicrosoft.com', 'FordFocus2019');
    }
    OfficeWorksheet.createNewWorkbook();
    OfficeWorksheet.openPlugin();
    PluginRightPanel.loginToPlugin('a', '');
  });

  afterAll(() => {
    if (numberOfExecutions === 3) {
      const averageImportingTime = totalAddedImportingTime / 3;
      console.log('Preparing performance data');
      const data = getJsonData(averageImportingTime, serverVersion, rows, columns, clientCPUCores, numberOfExecutions, e2eTime, numberOfClicks);
      console.log('Saving performance data');
      writeDataIntoFile(data, 'specs/performance/performanceDataOutput.json');
      console.log('Performance data saved');
    }
    browser.closeWindow();
    changeBrowserTab(0);
  });

  it('Import object (1st time)', () => {
    // should import a report in the first sheet and log the E2E time
    const beginE2E = Date.now();
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    totalAddedImportingTime += PluginPopup.importObjectAndGetTotalTime(objectName);
    numberOfExecutions++;
    const endE2E = Date.now();
    e2eTime = (((endE2E - beginE2E) / 1000));
  });
  it('Import object (2nd time)', () => {
    // should import a report in the second sheet
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    totalAddedImportingTime += PluginPopup.importObjectAndGetTotalTime(objectName);
    numberOfExecutions++;
  });
  it('Import object (3rd time)', () => {
    // should import a report in the third sheet
    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    totalAddedImportingTime += PluginPopup.importObjectAndGetTotalTime(objectName);
    numberOfExecutions++;
  });
});
