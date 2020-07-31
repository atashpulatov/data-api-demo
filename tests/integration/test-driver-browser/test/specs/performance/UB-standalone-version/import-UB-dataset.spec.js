import OfficeLogin from '../../../helpers/office/office.login';
import OfficeWorksheet from '../../../helpers/office/office.worksheet';
import PluginRightPanel from '../../../helpers/plugin/plugin.right-panel';
import PluginPopup from '../../../helpers/plugin/plugin.popup';
import {
  switchToExcelFrame, changeBrowserTab, switchToDialogFrame, switchToPluginFrame
} from '../../../helpers/utils/iframe-helper';
import { waitForNotification } from '../../../helpers/utils/wait-helper';
import { rightPanelSelectors } from '../../../constants/selectors/plugin.right-panel-selectors';
import { dictionary } from '../../../constants/dictionaries/dictionary';
import { waitAndClick } from '../../../helpers/utils/click-helper';
import { popupSelectors } from '../../../constants/selectors/popup-selectors';
import { logStep, logFirstStep } from '../../../helpers/utils/allure-helper';

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
  const webServerEnvironmentID = process.argv[process.argv.length - 3];
  const username = process.argv[process.argv.length - 2];
  const password = process.argv[process.argv.length - 1];

  function createManifestFile(newEnv) {
    let xmlContent;
    fs.readFile(sampleManifestFilePath, 'utf8', (err, content) => {
      if (err) { throw err; }
      xmlContent = content.replace(/env-173736/gi, newEnv); // 173736 is the number of the environment of the sample manifest file
      fs.writeFile(outputManifestFilePath, xmlContent, (err2) => {
        if (err2) { throw err2; }
      });
    });
  }

  function selectObjectElementsInPrepareData(elements) {
    $(popupSelectors.prepareSearchInput).waitForExist(7777);
    for (let i = 0; i < elements.length; i++) {
      $(popupSelectors.prepareSearchInput).clearValue();
      $(popupSelectors.prepareSearchInput).setValue(`${elements[i]}`);
      waitAndClick($(`input[name="${elements[i]}"]`));
      $(popupSelectors.prepareSearchInput).clearValue();
    }
  }

  function importUBObjectAndGetTotalTime() {
    switchToDialogFrame();
    PluginPopup.switchLibrary(false);
    PluginPopup.searchForObject(objectName);
    browser.pause(500);

    logStep('sort by name ascending');
    PluginPopup.clickHeader('Name');
    const names = PluginPopup.getColumnContents('columnName');
    expect(PluginPopup.isSortedAsceding(names)).toBe(true);

    logStep('select the application "UB-Platform-Analytics-2020"');
    PluginPopup.clickFilterButton();
    PluginPopup.clickAllButton('Application');
    PluginPopup.clickAllPanelElement('UB-Platform-Analytics-2020.');

    PluginPopup.selectObject(1);
    PluginPopup.clickPrepareData();

    // // selectObjectElementsInPrepareData(['Session', 'Account', 'Step Count', 'Execution Duration (ms)', 'Total Queue Duration (ms)', 'SQL Pass Count', 'Job CPU Duration (ms)', 'Initial Queue Duration (ms)', 'Prompt Answer Duration (ms)']);
    selectAttributes(['Session', 'Account']);
    selectMetrics(['Step Count', 'Execution Duration (ms)', 'Total Queue Duration (ms)', 'SQL Pass Count', 'Job CPU Duration (ms)', 'Initial Queue Duration (ms)', 'Prompt Answer Duration (ms)']);
    PluginPopup.clickImport();

    const begin = Date.now();
    waitForNotification();
    const end = Date.now();
    const notificationText = $(rightPanelSelectors.notificationPopUp).getAttribute('textContent');
    expect(notificationText).toContain(dictionary.en.importSuccess);
    if (notificationText === dictionary.en.importSuccess) {
      const timeSpent = ((end - begin) / 1000);
      logStep(`Total time importing "${objectName}":  ${timeSpent} secs`);

      return timeSpent;
    }
    return 'ERROR';
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

  function checkIfInputFormatIsCorrect() {
    if (process.argv[process.argv.length - 4] !== '--PASSWORD') {
      throw new Error('Incorrect command line arguments. Please introduce arguments for: --ENVIRONMENT --USERNAME --PASSWORD \n For example: npm run test-UB env-180792 user1 password1');
    }
  }

  function selectAttributes(elements) {
    $(popupSelectors.prepareSearchInput).waitForExist(7777);
    $(popupSelectors.prepareSearchInput).clearValue();
    $(popupSelectors.prepareSearchInput).setValue(`${elements[0]}`);
    waitAndClick($('#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.attributes-col > div > div.checkbox-list.all-showed > div > div > div:nth-child(2) > div > div > div:nth-child(1) > label > span:nth-child(3)'));
    $(popupSelectors.prepareSearchInput).clearValue();
    $(popupSelectors.prepareSearchInput).waitForExist(7777);
    $(popupSelectors.prepareSearchInput).clearValue();
    $(popupSelectors.prepareSearchInput).setValue(`${elements[1]}`);
    waitAndClick($('#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.attributes-col > div > div.checkbox-list.all-showed > div > div > div:nth-child(2) > div > div > div:nth-child(5) > label > span:nth-child(3)'));
    $(popupSelectors.prepareSearchInput).clearValue();
  }

  function selectMetrics(elements) {
    $(popupSelectors.prepareSearchInput).waitForExist(7777);
    for (let i = 0; i < elements.length; i++) {
      $(popupSelectors.prepareSearchInput).clearValue();
      $(popupSelectors.prepareSearchInput).setValue(`${elements[i]}`);
      waitAndClick($('#popup-wrapper > div > div:nth-child(1) > div.ant-row.full-height.filter-panel-container > div.ant-row.filter-panel-selectors > div.ant-col.ant-col-6.metrics-col > div > div.checkbox-list.all-showed > div > div > div:nth-child(2) > div > div > div:nth-child(1) > label > span:nth-child(3)'));
      $(popupSelectors.prepareSearchInput).clearValue();
    }
  }

  beforeEach(() => {
    browser.setWindowSize(1900, 900);
    checkIfInputFormatIsCorrect();
    startTimestamp = getFormattedDate();

    logFirstStep(`+ Opening Excel and Login to Plugin...`);
    OfficeWorksheet.openExcelHome();
    const url = browser.getUrl();
    if (url.includes('login.microsoftonline')) {
      OfficeLogin.login('test3@mstrtesting.onmicrosoft.com', 'FordFocus2019');
    }
    OfficeWorksheet.createNewWorkbook();
    createManifestFile(webServerEnvironmentID);
    const pathToManifest = isMac() ? `${__dirname}/manifest.xml` : `${__dirname}\\manifest.xml`;
    OfficeWorksheet.uploadAndOpenPlugin(pathToManifest, webServerEnvironmentID);
    const isValidCredentials = true;
    PluginRightPanel.loginToPlugin(username, password, isValidCredentials);
  });

  afterEach(() => {
    endTimestamp = getFormattedDate();
    if (numberOfExecutions === 1) {
      const averageImportingTime = (typeof totalAddedImportingTime === 'number') ? (totalAddedImportingTime / 1) : 'ERROR';
      logStep('Preparing performance data');
      const stringOfData = `\n${testCaseID},${testCaseName},${testCaseLink},${startTimestamp},${endTimestamp},${numberOfClicks},${averageImportingTime}`;

      logStep('Saving performance data');
      fs.appendFile(csvFilePath, stringOfData, (err) => {
        if (err) { throw err; }
        logStep('The data was appended to CSV file!');
      });
      logStep('Performance data saved');

      logStep(averageImportingTime);
    }
    browser.closeWindow();
    changeBrowserTab(0);
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
