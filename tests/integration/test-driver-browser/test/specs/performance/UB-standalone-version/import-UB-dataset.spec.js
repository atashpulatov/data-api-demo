import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import { switchToPluginFrame, switchToExcelFrame } from '../../../helpers/utils/iframe-helper';
import { writeDataIntoFile, getJsonData } from '../../../helpers/utils/benchmark-helper';
import { objects as o } from '../../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../../helpers/utils/wait-helper';

const fs = require('fs');

describe('Smart Folder - IMPORT -', () => {
  const objectName = 'Platform Analytics Cube';
  let totalAddedImportingTime = 0;
  let numberOfExecutions = 0;
  const numberOfClicks = 15;
  const sampleManifestFilePath = './test/specs/performance/UB-standalone-version/sampleManifest.xml';
  const outputManifestFilePath = './test/specs/performance/UB-standalone-version/manifest.xml';
  const csvFilePath = './test/specs/performance/UB-standalone-version/UB.csv';
  const testCaseID = 'TC60456';
  const testCaseName = 'Universal Benchmarking for Excel plugin from Chrome Browser | PerBuild';
  const testCaseLink = 'https://rally1.rallydev.com/#/53987408409d/detail/testcase/362684441788';
  let startTimestamp = 0;
  let endTimestamp = 0;
  const webServerEnvironmentID = process.argv[process.argv.length - 1];

  function createManifestFile(newEnv) {
    let xmlContent;
    fs.readFile(sampleManifestFilePath, 'utf8', (err, content) => {
      if (err) throw err;
      xmlContent = content.replace(/env-173736/gi, newEnv); // 173736 is the number of the environment of the sample manifest file
      fs.writeFile(outputManifestFilePath, xmlContent, (err2) => {
        if (err2) throw err;
      });
    });
  }

  function importUBObjectAndGetTotalTime() {
    switchToPluginFrame();
    PluginPopup.searchForObject(objectName);
    browser.pause(500);
    PluginPopup.selectFirstObject();
    PluginPopup.clickPrepareData();

    PluginPopup.selectObjectElementsInPrepareData(['Session', 'Account', 'Step Count', 'Execution Duration (ms)', 'Total Queue Duration (ms)', 'SQL Pass Count', 'Job CPU Duration (ms)', 'Initial Queue Duration (ms)', 'Prompt Answer Duration (ms)']);
    PluginPopup.clickImport();

    const begin = Date.now();
    browser.pause(2000);
    let popupExists = true;
    while (popupExists) {
      switchToExcelFrame();
      const popupDiv = $('#WACDialogPanel').isExisting();
      if (!popupDiv) {
        if (!$('#WACDialogPanel').isExisting()) {
          waitForNotification();
          popupExists = false;
        }
      }
    }
    const end = Date.now();
    const timeSpent = ((end - begin) / 1000);
    console.log(`Total time importing "${objectName}":  ${timeSpent} secs`);

    return timeSpent;
  }

  function getFormattedDate() {
    const date = new Date();
    const str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;

    return str;
  }

  function isMac() {
    const OS = browser.capabilities.platform;
    if (OS.startsWith('Mac')) {
      return true;
    }
    return false;
  }

  beforeAll(() => {
    browser.setWindowSize(1500, 900);
    console.log(webServerEnvironmentID);
    startTimestamp = getFormattedDate();
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login('test3@mstrtesting.onmicrosoft.com', 'FordFocus2019');
    }
    OfficeWorksheet.createNewWorkbook();
    createManifestFile(webServerEnvironmentID);
    const pathToManifest = isMac() ? `${__dirname}/manifest.xml` : `${__dirname}\\manifest.xml`;
    OfficeWorksheet.uploadAndOpenPlugin(pathToManifest, webServerEnvironmentID);
    PluginRightPanel.loginToPlugin('administrator', '');
  });

  afterAll(() => {
    endTimestamp = getFormattedDate();
    if (numberOfExecutions === 1) {
      const averageImportingTime = totalAddedImportingTime / 1;
      console.log('Preparing performance data');
      const stringOfData = `\n${testCaseID},${testCaseName},${testCaseLink},${startTimestamp},${endTimestamp},${numberOfClicks},${averageImportingTime}`;

      console.log('Saving performance data');
      fs.appendFile(csvFilePath, stringOfData, (err) => {
        if (err) throw err;
        console.log('The data was appended to CSV file!');
      });
      console.log('Performance data saved');

      console.log(averageImportingTime);
    }
    browser.closeWindow();
    const handles = browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });

  it('Import object selecting attributes and metrics', () => {
    // should import a report in the first sheet and take the time it toook it to import it
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    totalAddedImportingTime += importUBObjectAndGetTotalTime();
    numberOfExecutions++;

    // OfficeWorksheet.openNewSheet();
    // PluginRightPanel.clickAddDataButton();
    // totalAddedImportingTime += importUBObjectAndGetTotalTime();
    // numberOfExecutions++;

    // OfficeWorksheet.openNewSheet();
    // PluginRightPanel.clickAddDataButton();
    // totalAddedImportingTime += importUBObjectAndGetTotalTime();
    // numberOfExecutions++;

    browser.pause(5000);
  });
});
