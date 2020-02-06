const request = require('request');
const rallyConfig = require('./rallyconfig');
const getResultsFromAllure = require('./getResultsFromAllureFunctions');
const createBatchArray = require('./createBatchArray')

// Update Rally Test Case Result using the retrieved Test Case URL and the corresponding test result
async function updateRallyTCResult() {
  const allureArray = getResultsFromAllure.getReportData();
  const batch = await createBatchArray(allureArray)

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
