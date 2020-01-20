import OfficeLogin from '../../pageObjects/office/office.login';
import OfficeWorksheet from '../../pageObjects/office/office.worksheet';
import PluginRightPanel from '../../pageObjects/plugin/plugin.right-panel';
import PluginPopup from '../../pageObjects/plugin/plugin.popup';
import {switchToPluginFrame, switchToExcelFrame} from '../../pageObjects/utils/iframe-helper';
import {writeDataIntoFile, getJsonData} from '../../pageObjects/utils/benchmark-helper';
import { objects as o} from '../../constants/objects-list';
import { waitForNotification, waitForPopup } from '../../pageObjects/utils/wait-helper';
const fs = require('fs');

describe('Smart Folder - IMPORT -', function() {
  const objectName = 'Platform Analytics Cube';
  let totalAddedImportingTime = 0;
  let numberOfExecutions = 0;
  const serverVersion = 'Update 3'
  const rows = 5000;
  const columns = 15;
  const clientCPUCores = 6;
  const numberOfClicks = 10;
  let e2eTime = 0;
  const inputFilePath = './test/specs/performance/sample.xml'
  const outputFilePath = './test/specs/performance/manifest.xml'

  function writeDataIntoFile(newEnv) {
    var xmlContent;
    fs.readFile(inputFilePath, 'utf8', function(err, content) {
      if (err) throw err;
      xmlContent = content.replace(/173736/gi, newEnv);
      fs.writeFile(outputFilePath, xmlContent, function(err) {
        if (err) throw err;
      });
    });
  };

  function importObjectAndGetTotalTime(){
    switchToPluginFrame();
    PluginPopup.searchForObject(objectName);
    browser.pause(500);
    PluginPopup.selectFirstObject();
    PluginPopup.clickPrepareData();
    
    PluginPopup.selectObjectElementsInPrepareData(['Session', 'Account', 'Step Count','Execution Duration (ms)','Total Queue Duration (ms)', 'SQL Pass Count', 'Job CPU Duration (ms)', 'Initial Queue Duration (ms)', 'Prompt Answer Duration (ms)']);
    PluginPopup.clickImport();

    const begin = Date.now();
    browser.pause(2000);
    let popupExists = true;
    while (popupExists) {
      switchToExcelFrame();
      const popupDiv = $('#WACDialogPanel').isExisting();
      if (!popupDiv) {
        if (! $('#WACDialogPanel').isExisting()) {
          popupExists = false;
        }
      }
    }
    const end = Date.now();
    const timeSpent = ((end - begin) / 1000);
    console.log(`Total time importing "${objectName}":  ${timeSpent} secs`);

    return timeSpent;

  }

  beforeAll( () => {
    browser.setWindowSize(1500,900);

    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login('test3@mstrtesting.onmicrosoft.com', 'FordFocus2019');
    }
    OfficeWorksheet.createNewWorkbook();
    writeDataIntoFile("174770");
    OfficeWorksheet.uploadAndOpenPlugin();
    PluginRightPanel.loginToPlugin('administrator', '');

  });

  afterAll( () => {
    if (numberOfExecutions == 3) {
      const averageImportingTime = totalAddedImportingTime / 3;
      console.log('Preparing performance data');
      // const data = getJsonData(averageImportingTime, serverVersion, rows, columns, clientCPUCores, numberOfExecutions, e2eTime, numberOfClicks);
      // console.log('Saving performance data');
      // writeDataIntoFile(data, 'specs/performance/performanceDataOutput.json');
      // console.log('Performance data saved');

      console.log(averageImportingTime);
    }
    browser.closeWindow();
    const handles =  browser.getWindowHandles();
    browser.switchToWindow(handles[0]);
  });
  
    it('Import object selecting attributes and metrics', () => {
    // should import a report in the first sheet and log the E2E time
    const beginE2E = Date.now();
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    totalAddedImportingTime += importObjectAndGetTotalTime();
    numberOfExecutions++;
    const endE2E = Date.now();
    e2eTime = (((endE2E - beginE2E) / 1000));

    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    totalAddedImportingTime += importObjectAndGetTotalTime();
    numberOfExecutions++;

    OfficeWorksheet.openNewSheet();
    PluginRightPanel.clickAddDataButton();
    totalAddedImportingTime += importObjectAndGetTotalTime();
    numberOfExecutions++;


    browser.pause(5000);
    // waitForNotification();
  });


  // it('Import object (1st time)', () => {
  //   // should import a report in the first sheet and log the E2E time
  //   const beginE2E = Date.now();
  //   OfficeWorksheet.selectCell('A1');
  //   PluginRightPanel.clickImportDataButton();
  //   totalAddedImportingTime += PluginPopup.importObjectAndGetTotalTime(objectName);
  //   numberOfExecutions++;
  //   const endE2E = Date.now();
  //   e2eTime = (((endE2E - beginE2E) / 1000));
  // });
  // it('Import object (2nd time)', () => {
  //   // should import a report in the second sheet
  //   OfficeWorksheet.openNewSheet();
  //   PluginRightPanel.clickAddDataButton();
  //   totalAddedImportingTime += PluginPopup.importObjectAndGetTotalTime(objectName);
  //   numberOfExecutions++;
  // });
  // it('Import object (3rd time)', () => {
  //   // should import a report in the third sheet
  //   OfficeWorksheet.openNewSheet();
  //   PluginRightPanel.clickAddDataButton();
  //   totalAddedImportingTime += PluginPopup.importObjectAndGetTotalTime(objectName);
  //   numberOfExecutions++;
  // });
});

