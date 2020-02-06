const request = require('request');
const rallyConfig = require('./rallyconfig');
const getRallyTCDetails = require('./getRallyTCDetails')

// Retrieve Rally Test Case Object ID using Test Case Formatted ID (e.g. TCxxxx displayed in the Rally page)
function getRallyTCUrl(testCaseId) {
  const options = {
    url: `${rallyConfig.apiUrl}/testcase/?query=(FormattedID%20%3D%20%22${testCaseId}%22)`,
    method: 'GET',
    headers: { zsessionid: rallyConfig.rallyApiKey, },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error) {
        try {
          const bodyJson = JSON.parse(body);
          const tcUrl = bodyJson.QueryResult.Results[0]._ref;
          resolve(tcUrl);
        } catch (err) {
          reject(err);
        }
      } else {
        console.error(`Sending request to Rally REST Server has failed. Test Case ID: ${testCaseId} Error: ${error}`);
        reject(error);
      }
    });
  });
}

function getOwner(testCaseId) {
  return getRallyTCUrl(testCaseId).then((tcUrl) => getRallyTCDetails(tcUrl)).then(
    body => body.TestCase.Owner._ref
  );
}

exports.getRallyTCUrl = getRallyTCUrl;
exports.getOwner = getOwner;
