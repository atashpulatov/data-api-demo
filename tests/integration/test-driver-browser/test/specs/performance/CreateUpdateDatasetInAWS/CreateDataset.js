const request = require('request').defaults({jar: true});

module.exports = function login() {
  const options = {
    url: 'https://env-160386.customer.cloud.microstrategy.com/MicroStrategyLibrary/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    json: {
      'loginMode': 1,
      'username': 'a',
      'password': '',
    },
    withCredentials: false,
  };

  return request(options, (error, response, body) => {
    if (!error) {
      console.log(`Response Body: ${JSON.stringify(response.headers['x-mstr-authtoken'])}`);
      return createDataset(response.headers['x-mstr-authtoken']);
    } else {
      console.error('error');
      console.error(`Updating data request has failed: Error: ${error}`);
      throw error;
    }
  });
};


const createDataset = function createDataset(authToken) {
  const options = {
    url: 'https://env-160386.customer.cloud.microstrategy.com/MicroStrategyLibrary/api/datasets',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-MSTR-ProjectID': 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
      'Accept': 'application/json',
      'X-MSTR-AuthToken': authToken,
    },
    json: {
      'name': 'PerformanceDataset',
      'tables': [
        {
          'data': 'W3siVmVyc2lvbiI6IlVwZGF0ZSAxIiwiVGltZSI6MTIzLjQyLCJPUyI6Ik1hYyIsIkJyb3dzZXIiOiJDaHJvbWUiLCJSb3dzIjo1MH1d',
          'name': 'Table',
          'columnHeaders': [
            {
              'name': 'Version',
              'dataType': 'string',
            },
            {
              'name': 'Time',
              'dataType': 'DOUBLE',
            },
            {
              'name': 'OS',
              'dataType': 'string',
            },
            {
              'name': 'Browser',
              'dataType': 'string',
            },
            {
              'name': 'Rows',
              'dataType': 'INTEGER',
            },
          ],
        },
      ],
      'metrics': [
        {
          'name': 'Time',
          'dataType': 'number',
          'expressions': [
            {
              'formula': 'Table.Time',
            },
          ],
        },
      ],
      'attributes': [
        {
          'name': 'Version',
          'attributeForms': [
            {
              'category': 'ID',
              'expressions': [
                {
                  'formula': 'Table.Version',
                },
              ],
              'dataType': 'string',
            },
          ],
        },
        {
          'name': 'OS',
          'attributeForms': [
            {
              'category': 'ID',
              'expressions': [
                {
                  'formula': 'Table.OS',
                },
              ],
              'dataType': 'string',
            },
          ],
        },
        {
          'name': 'Browser',
          'attributeForms': [
            {
              'category': 'ID',
              'expressions': [
                {
                  'formula': 'Table.Browser',
                },
              ],
              'dataType': 'string',
            },
          ],
        },
        {
          'name': 'Rows',
          'attributeForms': [
            {
              'category': 'ID',
              'expressions': [
                {
                  'formula': 'Table.Rows',
                },
              ],
              'dataType': 'INTEGER',
            },
          ],
        },
      ],
    },
  };

  return request(options, (error, response, body) => {
    if (!error) {
      console.log(`Response Body: ${JSON.stringify(body)}`);
      return body;
    } else {
      console.error('error');
      console.error(`Updating data request has failed: Error: ${error}`);
      throw error;
    }
  });
};
