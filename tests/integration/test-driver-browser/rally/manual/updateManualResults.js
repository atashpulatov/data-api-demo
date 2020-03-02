const request = require('request');
const rallyConfig = require('../rallyconfig');
const getResultsFromAllure = require('../getResultsFromAllureFunctions');
const createManualBatchArray = require('./createManualBatchArray')

function mapTCtoBatchObject(testArray, verdict) {
  return testArray.map(testCaseId => ({ testCaseId, verdict }));
}

// Update Rally Test Case Result using the retrieved Test Case URL and the corresponding test result
async function updateRallyTCResult() {
  const passedTestCasesId = mapTCtoBatchObject(rallyConfig.manualTestCases.passedTestCases, 'Pass')

  const failedTestCasesId = mapTCtoBatchObject(rallyConfig.manualTestCases.failedTestCases, 'Fail')

  const batch = await createManualBatchArray([...failedTestCasesId, ...passedTestCasesId]);


  const options = {
    url: 'https://rally1.rallydev.com/slm/webservice/v2.0/batch',
    method: 'POST',
    headers: { zsessionid: rallyConfig.rallyApiKey, },
    body: JSON.stringify(batch)
  }

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

updateRallyTCResult()
  .then(result => {
    const jsonResult = JSON.parse(result);
    const { Errors } = jsonResult.BatchResult;
    if (Errors.length > 0) {
      throw new Error(Errors)
    }
    console.log('Rally request completed')
    process.exit(0);
  })
  .catch(error => {
    console.error(error)
    process.exit(1);
  });
