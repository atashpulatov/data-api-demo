const request = require('request');
const rallyConfig = require('./rallyconfig');

/**
 * Retrieve Rally Test Case data using url to the particular endpoint
 *
 * @param {String} url Url to the endpoint
 * @returns {Promise} Promise that will be resolved when the request to the endpoint is made
 */
module.exports = function getDataFromRally(url) {
  const options = {
    url,
    method: 'GET',
    headers: { zsessionid: rallyConfig.rallyApiKey, },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error) {
        try {
          const bodyJson = JSON.parse(body);
          resolve(bodyJson);
        } catch (err) {
          reject(err);
        }
      } else {
        console.error(`Sending request to Rally REST Server has failed.`);
        reject(error);
      }
    });
  });
};
