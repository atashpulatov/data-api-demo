const fetch = require('node-fetch');
const rallyConfig = require('./rallyconfig');

/**
 * Retrieve Rally Test Case data using url to the particular endpoint
 *
 * @param {String} url Url to the endpoint
 * @returns {Promise} Promise that will be resolved when the request to the endpoint is made
 */
module.exports = function getDataFromRally(url) {
  const options = {
    method: 'GET',
    headers: { zsessionid: rallyConfig.rallyApiKey, }
  };

  return fetch(url, options)
    .then(result => result.json());
};
