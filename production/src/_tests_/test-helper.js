import fs from 'fs';
import util from 'util';

function expectPropertiesDefined(result) {
  result.rows.forEach((row) => {
    for (const property in row) {
      if (row.hasOwnProperty(property)) {
        expect(row[property]).toBeDefined();
      }
    }
  });
}

function expectEqualsGivenReport(result, expectedReportPath) {
  if (!fs.existsSync(expectedReportPath)) {
    fs.writeFileSync(expectedReportPath,
      `/* eslint-disable */export default ${util.inspect(result)}`,
      'utf-8');
  }
  const expectedReport = require(expectedReportPath).default;
  expect(result).toEqual(expectedReport);
}

export default {
  expectPropertiesDefined,
  expectEqualsGivenReport,
};
