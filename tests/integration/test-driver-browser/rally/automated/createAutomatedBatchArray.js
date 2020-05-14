const helpers = require('../helpers');

const today = new Date();

/** Update Rally Test Cases results from automation using the retrieved Test Case URL and the corresponding test results
 *
 * @param {Array} testCaseArray Array of objects (test results) to be uploaded to Rally
 * @returns {Array} Array of JS objects containing test results parsed to the format that can be uploaded to Rally
 */

module.exports = async function createBatchArray(testCaseArray) {
  const batch = [];
  //* *******/ HERE ADD TEST SET FOR RELAESE VALIDATION
  const testSet = '';

  for (let i = 0; i < testCaseArray.length; i++) {
    const {
      duration, browser, verdict, build, release, testCaseId
    } = testCaseArray[i];
    const tcUrl = await helpers.getRallyTCUrl(testCaseId);
    const owner = await helpers.getOwner(testCaseId);

    const batchItem = {
      Entry: {
        Path: '/testcaseresult/create',
        Method: 'POST',
        Body: {
          testcaseresult: {
            Build: build,
            Date: today,
            Testcase: tcUrl.split('v2.0')[1],
            Verdict: verdict,
            Tester: owner,
            TestSet: helpers.getTestSet(testSet), // for release validation add TS ID
            Duration: duration,
            Notes: 'Automation results', // for release validation change to 'Release validation'
            c_Browsertype: browser,
            c_Environment: '',
            c_ProductionRelease: release,
            //      'c_ExportApplication': exportApp,
            //      'c_ClientOS': clientOS,
            //      'c_Language': language
          }
        }
      }
    };
    batch.push(batchItem);
  }
  return { Batch: batch };
};
