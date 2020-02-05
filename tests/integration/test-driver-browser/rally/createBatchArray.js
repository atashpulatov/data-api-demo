const getRallyTCURL = require('./getRallyTCURL');

const today = new Date();


// Update Rally Test Case Result using the retrieved Test Case URL and the corresponding test result
module.exports = async function createBatchArray(testCaseArray) {
  const batch = [];
  for (let i = 0; i < testCaseArray.length; i++) {
    const { duration, browser, verdict, build, release, testCaseId } = testCaseArray[i];
    const tcUrl = await getRallyTCURL.getRallyTCUrl(testCaseId)
    const owner = await getRallyTCURL.getOwner(testCaseId);
    const batchItem = {

      Entry: {
        Path: '/testcaseresult/create',
        Method: 'POST',
        Body: {
          testcaseresult: {
            Build:build,
            Date:today,
            Testcase: tcUrl.split('v2.0')[1],
            Verdict:verdict,
            c_Browsertype: browser,
            Tester: owner,
            c_ProductionRelease: release,
            Duration:duration,
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
