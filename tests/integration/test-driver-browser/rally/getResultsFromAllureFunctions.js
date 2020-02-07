const allureReport = './allure-report/data/behaviors.json'
const path = require('path');
const fs = require('fs');

const cmd = process.argv;


function parseReportData(report) {
  const filePath = path.resolve(report);
  const results = (JSON.parse(fs.readFileSync(filePath)));
  const data = results.children;
  return data;
}

function getTestCaseId(report) {
  const re = /\[(TC\d+)\]/;
  const testName = report.name;
  const testId = testName.split(re)[1];
  return testId;
}

function getStatus(report) {
  let verdict = '';
  const { status } = report;
  switch (status) {
  case 'failed': verdict = 'Fail';
    break;
  case 'passed': verdict = 'Pass';
    break;
  }
  return verdict;
}

function getDuration(report) {
  const { duration } = report.time;
  return duration;
}

function getBrowser(report) {
  const parameters = report.parameters[0];
  let browser = '';
  if (parameters.includes('chrome')) {
    browser = 'Chrome'
  }
  return browser;
}

function getBuild() {
  let build;
  if (!cmd[3]) {
    build = '11.2.0000.22202'
  } else {
    build = cmd[3];
  }
  return build;
}

function getRelease() {
  let release;
  if (!cmd[4]) {
    release = '11.2.1'
  } else {
    release = cmd[4];
  }
  return release;
}

function getReportData() {
  const arrayData = parseReportData(allureReport);
  const allureDataArray = [];
  for (let i = 0; i < arrayData.length; i++) {
    if (arrayData[i].name.includes('[TC')) {
      const allure = {
        duration: getDuration(arrayData[i]),
        browser: getBrowser(arrayData[i]),
        verdict: getStatus(arrayData[i]),
        testCaseId: getTestCaseId(arrayData[i]),
        build: getBuild(),
        release: getRelease(),
      }
      allureDataArray.push(allure);
    }
  }
  return allureDataArray;
}


getReportData();

exports.getReportData = getReportData;
