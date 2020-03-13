const request = require('request');
const rallyConfig = require('./rallyconfig');
const getResultsFromAllure = require('./getResultsFromAllureFunctions');
const createBatchArray = require('./createBatchArray')

async function updateRallyTCResult() {
  const allTests = getResultsFromAllure.getReportData();

  const cmd = process.argv;
  const passed = !cmd.includes('fail');

  const testsToUpdate = getResultsFromAllure.getTestsWithVerdict(allTests, passed);
  const batch = await createBatchArray(testsToUpdate);

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
