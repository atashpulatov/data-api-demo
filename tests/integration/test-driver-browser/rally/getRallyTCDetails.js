const request = require('request');
const rallyConfig = require('./rallyconfig');

// Retrieve Rally Test Case Object ID using Test Case Formatted ID (e.g. TCxxxx displayed in the Rally page)
module.exports = function getRallyTCDetails(tcUrl) {
  const options = {
    url: tcUrl,
    method: 'GET',
    headers: { zsessionid: rallyConfig.rallyApiKey, },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error) {
        try {
          const bodyJson = JSON.parse(body);
          resolve(bodyJson);
        } catch (error) {
          reject(error);
        }
      } else {
        console.error(`Sending request to Rally REST Server has failed.`);
        reject(error);
      }
    });
  });
};
