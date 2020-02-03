const request = require('request').defaults({ jar: true });
const btoa = require('btoa');
const data = require('./data.json');

module.exports = function login() {
  const options = {
    url: 'https://env-160386.customer.cloud.microstrategy.com/MicroStrategyLibrary/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    json: {
      loginMode: 1,
      username: 'a',
      password: '',
    },
    withCredentials: false,
  };

  return request(options, (error, response, body) => {
    if (!error) {
      console.log(`Response Body: ${JSON.stringify(response.headers['x-mstr-authtoken'])}`);
      return addResults(response.headers['x-mstr-authtoken']);
    }
    console.error('error');
    console.error(`Updating data request has failed: Error: ${error}`);
    throw error;
  });
};


const addResults = function addResults(authToken) {
  const datasetId = '92BA570A11E9EA7100000080EF25AC18';
  const tableId = 'F120F7A716DAFB49C7B17734127A2213';
  const base64EncodedData = btoa(JSON.stringify(data));

  const options = {
    url: `https://env-160386.customer.cloud.microstrategy.com/MicroStrategyLibrary/api/datasets/${datasetId}/tables/${tableId}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-MSTR-ProjectID': 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
      Accept: 'application/json',
      'X-MSTR-AuthToken': authToken,
      updatePolicy: 'Replace',
    },
    json: {
      data: base64EncodedData,
      name: 'Table',
      columnHeaders: [
        {
          name: 'Version',
          dataType: 'string',
        },
        {
          name: 'Time',
          dataType: 'DOUBLE',
        },
        {
          name: 'OS',
          dataType: 'string',
        },
        {
          name: 'Browser',
          dataType: 'string',
        },
        {
          name: 'Rows',
          dataType: 'INTEGER',
        },
      ],
    },
  };

  return request(options, (error, response, body) => {
    if (!error) {
      console.log(`Response Body: ${JSON.stringify(body)}`);
      return body;
    }
    console.error('error');
    console.error(`Updating data request has failed: Error: ${error}`);
    throw error;
  });
};
