module.exports = {
  allureFolderPath: '../python/allure-report/data/test-cases',
  osCMD: {
    mac13: 'mac13',
    mac14: 'mac14',
    mac15: 'mac15',
    win10: 'win10',
    win19: 'win19',
  },
  OS: {
    macOS13: 'Mac OS 10.13 High Sierra',
    macOS14: 'Mac OS 10.14 Mojave',
    macOS15: 'Mac OS 10.15 Catalina',
    msWin10: 'Microsoft Windows 10',
    msWin19: 'Microsoft Windows Server 2019',
  },
  batchURL: 'https://rally1.rallydev.com/slm/webservice/v2.0/batch',
  cmdArguments: {
    os: 'os',
    build: 'build',
    release: 'release',
    verdict: 'verdict',
    target: 'target'
  },
  allureStatus: {
    broken: 'broken',
    skipped: 'skipped',
    passed: 'passed'
  },
  rallyStatus: {
    fail: 'Fail',
    pass: 'Pass',
  },
  target: {
    macDesktop: 'mac_desktop',
    macChrome: 'mac_chrome',
    winDesktop: 'windows_desktop',
    winChrome: 'windows_chrome',
  },
  browser: {
    chrome: 'Chrome'
  },
  officeVersion: {
    office365: 'Microsoft Office 365',
    office2019: 'Microsoft Office 2019'
  },
};