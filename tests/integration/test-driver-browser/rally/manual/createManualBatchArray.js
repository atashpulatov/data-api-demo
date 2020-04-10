const getRallyTCURL = require('../getRallyTCURL');

const today = new Date();

/** Update Rally Test Case Result using the retrieved Test Case URL and the corresponding test result */
module.exports = async function createManualBatchArray(testCaseArray) {
  const batch = [];
  for (let i = 0; i < testCaseArray.length; i++) {
    const tcUrl = await getRallyTCURL.getRallyTCUrl(testCaseArray[i].testCaseId);
    const { verdict } = testCaseArray[i];

    const batchItem = {
      Entry: {
        Path: '/testcaseresult/create',
        Method: 'POST',
        Body: {
          testcaseresult: {
            Date: today,
            Tester: 'https://rally1.rallydev.com/slm/webservice/v2.0/user/286548703824',
            Build: '11.2.0100.22936',
            TestSet: '368548485080',
            Testcase: tcUrl.split('v2.0')[1],
            Verdict: verdict,
            c_Browsertype: '',
            c_ProductionRelease: '11.1.5 [2020-Mar-27]',
            Duration: '',
            //      'Notes': notes,
            //      'c_ExportApplication': exportApp,
            //      'c_ClientOS': clientOS,
            //      'c_Language': language
          }
        }
      }
    }
    batch.push(batchItem);
  }
  return { Batch: batch };
}
