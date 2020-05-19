/* eslint-disable camelcase */
const request = require('request');
const rallyConfig = require('../rallyconfig');
const getTestSetDuration = require('./getTestSetDuration');
const helpers = require('../helpers');
/**
 * Upload Test Set duration to existing Test Set Rally
 *
 * @returns {Promise} Promise to be resolved when the Test Case result is uploaded
 */
async function updateMachineTime() {
  const cmd = process.argv;

  // Test Set ID passed to cmd
  const testSetId = cmd[2];
  const testSetDuration = await getTestSetDuration(testSetId);
  const testSetUrl = await helpers.getTestSet(testSetId);

  const options = {
    url: testSetUrl,
    method: 'PUT',
    headers: { zsessionid: rallyConfig.rallyApiKey, },
    json: { TestSet: { c_MachineTimeHrs: testSetDuration } }
  };


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

updateMachineTime()
  .then(result => {
    const { Errors } = result.OperationResult;
    if (Errors.length > 0) {
      throw new Error(Errors);
    }
    console.log('Rally request completed');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
