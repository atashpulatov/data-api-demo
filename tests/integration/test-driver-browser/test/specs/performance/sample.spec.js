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
  
  // function writeDataIntoFile(data, outputFilePath) {
  //   fs.readFile(outputFilePath, { encoding : 'latin1' }, function(err, content) {
  //     if (err) throw err;
  //     // const parseJson = JSON.parse(content);
  //     console.log(content);
  //     // const parseJson = content;
  //     // parseJson.push(data);
  //     // fs.writeFile(outputFilePath, parseJson, function(err) {
  //     //   if (err) throw err;
  //     // });
  //   });
  // };

//   function processData(allText) {
//     var allTextLines = allText.split(/\r\n|\n/);
//     var headers = allTextLines[0].split(',');
//     var lines = [];

//     for (var i=1; i<allTextLines.length; i++) {
//         var data = allTextLines[i].split(',');
//         if (data.length == headers.length) {

//             var tarr = [];
//             for (var j=0; j<headers.length; j++) {
//                 tarr.push(headers[j]+":"+data[j]);
//             }
//             lines.push(tarr);
//         }
//     }
// console.log(lines);
// }

function getFormattedDate() {
  var date = new Date();
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();

  return str;
}

  beforeEach( () => {
    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    browser.setWindowSize(1500,900);

    // browser.pause(80000);
    console.log('it passed');

  });

  afterEach( () => {
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

    // const str = `\n${testCaseID},${testCaseName},${testCaseLink},${startTimestamp},${endTimestamp},${numberOfClicks},${performance}`;
    const jsonData = '\nTC333333,Max Data Points for Bar Chart with 5 sec max,https://rally1.rallydev.com/#/333333/detail/testcase/333333,2019-11-13 16:21:29.384989,2019-11-13 16:22:38.366499,2';


    // const data = "heading1,heading2,heading3,heading4,heading5\nvalue1_1,value2_1,value3_1,value4_1,value5_1\nvalue1_2,value2_2,value3_2,value4_2,value5_2"; 

    // processData(data);

//     const csv = json2csv.Parse(jsonData);
// fs.appendFile('./test/specs/performance/UB.csv', csv, (err) => {
//   if (err) console.error('Couldn\'t append the data');
//   console.log('The data was appended to file!');
// });

console.log(getFormattedDate());

console.log(process.env.USERENV);

fs.appendFile('./test/specs/performance/UB.csv', jsonData, (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});

// console.log('date is:');
//   console.log(Date.now());

  });
});

