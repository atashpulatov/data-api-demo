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
  const inputFilePath = './test/specs/performance/sample.xml'
  const outputFilePath = './test/specs/performance/UB.csv'
  
  function writeDataIntoFile(data, outputFilePath) {
    fs.readFile(outputFilePath, { encoding : 'latin1' }, function(err, content) {
      if (err) throw err;
      // const parseJson = JSON.parse(content);
      console.log(content);
      // const parseJson = content;
      // parseJson.push(data);
      // fs.writeFile(outputFilePath, parseJson, function(err) {
      //   if (err) throw err;
      // });
    });
  };

  beforeAll( () => {
    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    browser.setWindowSize(1500,900);

    // browser.pause(80000);
    console.log('it passed');

  });

  afterAll( () => {
  });
  
  it('Import object selecting attributes and metrics', () => {

    // const data = {
    //   'Test Case ID': testCaseID,
    //   'Test Case Name': testCaseName,
    //   'Test Case Link': testCaseLink,
    //   'Start Timestamp': startTimestamp,
    //   'End Timestamp': endTimestamp,
    //   'NumberOfClicks': numberOfClicks,
    //   'Performance': performance,
    // };

    // const str = `${testCaseID},${testCaseName},${testCaseLink},${startTimestamp},${endTimestamp},${numberOfClicks},${performance}`;
    const str = 'TC333333,Max Data Points for Bar Chart with 5 sec max,https://rally1.rallydev.com/#/333333/detail/testcase/333333,2019-11-13 16:21:29.384989,2019-11-13 16:22:38.366499,2';

    writeDataIntoFile(str, outputFilePath);

  });
});

