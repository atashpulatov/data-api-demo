import OfficeLogin from '../../pageObjects/office/office.login';
import OfficeWorksheet from '../../pageObjects/office/office.worksheet';
import PluginRightPanel from '../../pageObjects/plugin/plugin.right-panel';
import PluginPopup from '../../pageObjects/plugin/plugin.popup';
import {switchToPluginFrame} from '../../pageObjects/utils/iframe-helper';
import {writeDataIntoFile, getJsonData} from '../../pageObjects/utils/benchmark-helper';

describe('Smart Folder - IMPORT -', function() {
  const objectName = '5k Sales Records.csv';
  let totalAddedImportingTime = 0;
  let numberOfExecutions = 0;
  const serverVersion = 'Update 3'
  const rows = 5000;
  const columns = 15;
  const clientCPUCores = 6;
  const numberOfClicks = 10;
  let e2eTime = 0;
  beforeEach( () => {
    browser.setWindowSize(1900,900);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login('test3@mstrtesting.onmicrosoft.com', 'FordFocus2019');
    }
    OfficeWorksheet.createNewWorkbook();
    // OfficeWorksheet.uploadPlugin();
    
    OfficeWorksheet.openPlugin();

    // switchToExcelFrame();
    // try {
      //   $('img[src^="https://170407"]').waitForDisplayed(7777);
      //   $('img[src^="https://170407"]').click();
      //   browser.pause(5555);
      // } catch (error) {
        //   this.addAdminManagedPlugin();
        //   switchToExcelFrame();
        //   $(exSe.uploadPluginNotification).click();
        //   $('img[src^="https://170407"]').click(); // this is an alternative selector to start the plugin
        //   browser.pause(5555);
        // }
        
    
    PluginRightPanel.loginToPlugin('administrator', '');
  });

  afterAll( () => {
    // if (numberOfExecutions == 3) {
    //   const averageImportingTime = totalAddedImportingTime / 3;
    //   console.log('Preparing performance data');
    //   const data = getJsonData(averageImportingTime, serverVersion, rows, columns, clientCPUCores, numberOfExecutions, e2eTime, numberOfClicks);
    //   console.log('Saving performance data');
    //   writeDataIntoFile(data, 'specs/performance/performanceDataOutput.json');
    //   console.log('Performance data saved');
    // }
    // browser.closeWindow();
    // const handles =  browser.getWindowHandles();
    // browser.switchToWindow(handles[0]);
  });

    it('Import object selecting attributes and metrics', () => {
    // should import a report in the first sheet and log the E2E time
    OfficeWorksheet.selectCell('A1');
    PluginRightPanel.clickImportDataButton();
    PluginPopup.importObject(o.reports.reportXML);
    waitForNotification();

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

