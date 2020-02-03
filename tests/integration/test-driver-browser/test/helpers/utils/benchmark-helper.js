import PluginRightPanel from '../plugin/plugin.right-panel';

const fs = require('fs');

// TODO: needs to be refactor for webdriverIO - Currently it is not used
export async function writeDataIntoFile(data, outputFilePath) {
  await fs.readFile(outputFilePath, (err, content) => {
    if (err) throw err;
    const parseJson = JSON.parse(content);
    parseJson.push(data);
    fs.writeFile(outputFilePath, JSON.stringify(parseJson), (err) => {
      if (err) throw err;
    });
  });
}

// TODO: needs to be refactor for webdriverIO - Currently it is not used
export async function getJsonData(averageImportingTime, serverVersion, rows, columns, clientCPUCores, numberOfExecutions, e2eTime, numberOfClicks) {
  const pluginVersion = await PluginRightPanel.getVersionOfThePlugin();
  const browserName = await browser.getCapabilities().then((res) => res.map_.get('browserName'));
  const OS = await browser.getCapabilities().then((res) => res.map_.get('platform'));
  const importingTime = await parseFloat((Math.round(averageImportingTime * 1000) / 1000).toFixed(3));

  const data = {
    ServerVersion: serverVersion,
    PluginVersion: pluginVersion,
    ClientOS: OS,
    ClientCPUCores: clientCPUCores,
    Browser: browserName,
    Rows: rows,
    Columns: columns,
    ImportingTime: importingTime,
    NumberOfExecutions: numberOfExecutions,
    E2EDurationTime: e2eTime,
    NumberOfClicks: numberOfClicks,
    '%CPU-Usage': 'N/A',
    'Memory-Usage': 'N/A',
  };

  return data;
}
