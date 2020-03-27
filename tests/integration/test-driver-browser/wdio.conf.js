exports.config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  //
  // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
  // on a remote machine).
  runner: 'local',
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  specs: [
        //   './test/specs/release-validation/deprecated/sample.spec.js',
  ],
  suites: {
    acceptance: [
      // './test/specs/release-validation/TS41441-E2E Sanity checks/TC49100-E2E-Import-Prompted-Reports-Import-multiple-objects-Refresh-All-Re-Prompt-Refresh-Edit-Prompts.spec.js',
      // './test/specs/release-validation/TS41441-E2E Sanity checks/TC48976-basic-functionalites.spec.js',
      // './test/specs/release-validation/TS41441-E2E Sanity checks/TC49134-Part-I.spec.js',
      // './test/specs/release-validation/TS41441-E2E Sanity checks/TC49134-Part-II.spec.js',
      // './test/specs/release-validation/TS41441-E2E Sanity checks/TC49134-Part-III.spec.js',
      // './test/specs/release-validation/F24751-import subtotals/TC54788-import-subtotals.spec.js',
      './test/specs/release-validation/F25932-import-attribute-forms/TC59987-attribute-form-display.spec.js',
    ],
    'F12910-import-dataset': [
      './test/specs/release-validation/F12910-import-dataset/TC34506-import-not-supported-cube.spec.js',
      './test/specs/release-validation/F12910-import-dataset/TC35249-cubes-limits-project.spec.js',
    ],
    'F22954-editing': [
      './test/specs/release-validation/F22954-editing/TC48354-edit-prompt-value-dateTime-req-noDef.spec.js',
    ],
    'F22955-refresh': [
      './test/specs/release-validation/F22955-refresh/TC48131-refresh-report.spec.js',
      './test/specs/release-validation/F22955-refresh/TC48134-refresh-report-prompt-object-required-defaultanswer.spec.js',
      './test/specs/release-validation/F22955-refresh/TC48135-refresh-report-prompt-nested-prompts.spec.js',
      './test/specs/release-validation/F22955-refresh/TC48136-refresh-report-prompt-multiple-prompts.spec.js',
    ],
    'F24087-improve-scrolling-performance': [
      './test/specs/release-validation/F24087-improve-scrolling-performance/TC54976-E2E-scenario.spec.js',
    ],
    'F24398-import-and-refresh-visualization': [
      './test/specs/release-validation/F24398-import-and-refresh-visualization/TC53434-my-library-view-filters-dossier-importing.spec.js',
      './test/specs/release-validation/F24398-import-and-refresh-visualization/TC53560-Import-a-grid-visualisation.spec.js',
      './test/specs/release-validation/F24398-import-and-refresh-visualization/TC53561-Part-I-import-different-types-of-visualisations.spec.js',
      './test/specs/release-validation/F24398-import-and-refresh-visualization/TC53561-Part-II-import-different-types-of-visualisations.spec.js',
      './test/specs/release-validation/F24398-import-and-refresh-visualization/TC53561-Part-III-import-different-types-of-visualisations.spec.js',
      './test/specs/release-validation/F24398-import-and-refresh-visualization/TC53620-Refreshing-a-visualisation.spec.js',
      './test/specs/release-validation/F24398-import-and-refresh-visualization/TC53627-Interactive-components-at-the-popup-window.spec.js',
      './test/specs/release-validation/F24398-import-and-refresh-visualization/TC54783-Manipulation-of-grid-visualization.spec.js',
      './test/specs/release-validation/F24398-import-and-refresh-visualization/TC60974-importing-custom-visualisation.spec.js',
      './test/specs/release-validation/F24398-import-and-refresh-visualization/TC61043-E2E-prompted-dossier.spec.js',
      './test/specs/release-validation/F24398-import-and-refresh-visualization/TC61046-E2E-with-edit-change-text.spec.js',
    ],
    'F24751-import subtotals': [
      './test/specs/release-validation/F24751-import subtotals/TC53340-import-report-with-subtotals.spec.js',
      './test/specs/release-validation/F24751-import subtotals/TC53745-subtotals-toggle-hidden.spec.js',
      './test/specs/release-validation/F24751-import subtotals/TC54788-import-subtotals.spec.js',
    ],
    'F25946-details-panel': [
      './test/specs/release-validation/F25946-details-panel/TC59756-expanded-view.spec.js',
      './test/specs/release-validation/F25946-details-panel/TC59725-accessibility-within-details-panel.spec.js',
      './test/specs/release-validation/F25946-details-panel/TC59677-altering-table-with-rows-expanded.spec.js',
      './test/specs/release-validation/F25946-details-panel/TC60112-tooltips-for-details-elements.spec.js',
    ],
    'F25930-faster-display': [
      './test/specs/release-validation/F25930-faster-display/TC54961-E2E-scenario.spec.js',
    ],
    'F25932-import-attribute-forms': [
      './test/specs/release-validation/F25932-import-attribute-forms/TC59987-attribute-form-display.spec.js',
    ],
    'F25968-object-numbers': [
      './test/specs/release-validation/F25968-object-numbers/TC54853-refresh-button-filter-panel.spec.js',
      './test/specs/release-validation/F25968-object-numbers/TC58932-select-deselect-no-objects.spec.js',
    ],
    'TF7862-regression': [
      './test/specs/release-validation/TF7862-regression/TC59466-binding-importing-the-same-report-twice.spec.js',
      './test/specs/release-validation/TF7862-regression/TC59464-binding-imported-report.spec.js',
    ],
    'TS41441-E2E Sanity checks': [
      './test/specs/release-validation/TS41441-E2E Sanity checks/TC49100-E2E-Import-Prompted-Reports-Import-multiple-objects-Refresh-All-Re-Prompt-Refresh-Edit-Prompts.spec.js',
      './test/specs/release-validation/TS41441-E2E Sanity checks/TC48976-basic-functionalites.spec.js',
      './test/specs/release-validation/TS41441-E2E Sanity checks/TC49134-Part-I.spec.js',
      './test/specs/release-validation/TS41441-E2E Sanity checks/TC49134-Part-II.spec.js',
      './test/specs/release-validation/TS41441-E2E Sanity checks/TC49134-Part-III.spec.js',
    ],
    'F24086-improved-browsing-by-adding-filters': [
      './test/specs/release-validation/F24086-improved-browsing-by-adding-filters/TC54856-filtering-with-type-owner-certified-date.spec.js',
      './test/specs/release-validation/F24086-improved-browsing-by-adding-filters/TC53430-refreshing-and-filtering-during-refresh.spec.js',
    ]
  },
  // Patterns to exclude.
  exclude: [
  // 'path/to/excluded/files'
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 10,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: [{
    maxInstances: 1,
    browserName:
  'chrome',
  }],
  // {
  // maxInstances: 1,
  // browserName:
  // 'safari',
  // }],
  // }, {
  // maxInstances: 1,
  // browserName: 'internet explorer'
  // }],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: 'error',
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner, @wdio/lambda-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  // webdriver: 'info',
  // '@wdio/applitools-service': 'info'
  // },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail:
  0,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl:
  'http://localhost',
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout:
  10000,
  //
  // Default timeout in milliseconds for request
  // if Selenium Grid doesn't send response
  connectionRetryTimeout:
  90000,
  //
  // Default request retries count
  connectionRetryCount:
  3,
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services:
  ['selenium-standalone'],

  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework:
  'jasmine',

  //
  // The number of times to retry the entire specfile when it fails as a whole
  specFileRetries: 3,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter.html
  reporters:
  [['allure', { outputDir: 'allure-results' }]],

  //
  // Options to be passed to Jasmine.
  jasmineNodeOpts:
  {
  //
  // Jasmine default timeout
    defaultTimeoutInterval: 600000,
    //
    // The Jasmine framework allows interception of each assertion in order to log the state of the application
    // or website depending on the result. For example, it is pretty handy to take a screenshot every time
    // an assertion fails.
    expectationResultHandler (passed, assertion) {
      // do something
    }
  },
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
  * Gets executed once before all workers get launched.
  * @param {Object} config wdio configuration object
  * @param {Array.<Object>} capabilities list of capabilities details
  */
  // onPrepare: function (config, capabilities) {
  // },
  /**
  * Gets executed just before initialising the webdriver session and test framework. It allows you
  * to manipulate configurations depending on the capability or spec.
  * @param {Object} config wdio configuration object
  * @param {Array.<Object>} capabilities list of capabilities details
  * @param {Array.<String>} specs List of spec file paths that are to be run
  */
  beforeSession (config, capabilities, specs) {
    require('@babel/register');
  },
  /**
  * Gets executed before test execution begins. At this point you can access to all global
  * variables like `browser`. It is the perfect place to define custom commands.
  * @param {Array.<Object>} capabilities list of capabilities details
  * @param {Array.<String>} specs List of spec file paths that are to be run
  */
  // before: function (capabilities, specs) {
  // },
  /**
  * Runs before a WebdriverIO command gets executed.
  * @param {String} commandName hook command name
  * @param {Array} args arguments that command would receive
  */
  // beforeCommand: function (commandName, args) {
  // },
  /**
  * Hook that gets executed before the suite starts
  * @param {Object} suite suite details
  */
  // beforeSuite: function (suite) {
  // },
  /**
  * Function to be executed before a test (in Mocha/Jasmine) starts.
  */
  // beforeTest: function (test, context) {
  // },
  /**
  * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
  * beforeEach in Mocha)
  */
  // beforeHook: function (test, context) {
  // },
  /**
  * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
  * afterEach in Mocha)
  */
  // afterHook: function (test, context, { error, result, duration, passed, retries }) {
  // },
  /**
  * Function to be executed after a test (in Mocha/Jasmine).
  */
  afterTest (test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
      browser.takeScreenshot();
    }
  },


  /**
  * Hook that gets executed after the suite has ended
  * @param {Object} suite suite details
  */
  // afterSuite: function (suite) {
  // },
  /**
  * Runs after a WebdriverIO command gets executed
  * @param {String} commandName hook command name
  * @param {Array} args arguments that command would receive
  * @param {Number} result 0 - command success, 1 - command error
  * @param {Object} error error object if any
  */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
  * Gets executed after all tests are done. You still have access to all global variables from
  * the test.
  * @param {Number} result 0 - test pass, 1 - test fail
  * @param {Array.<Object>} capabilities list of capabilities details
  * @param {Array.<String>} specs List of spec file paths that ran
  */
  // after: function (result, capabilities, specs) {
  // },
  /**
  * Gets executed right after terminating the webdriver session.
  * @param {Object} config wdio configuration object
  * @param {Array.<Object>} capabilities list of capabilities details
  * @param {Array.<String>} specs List of spec file paths that ran
  */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
  * Gets executed after all workers got shut down and the process is about to exit. An error
  * thrown in the onComplete hook will result in the test run failing.
  * @param {Object} exitCode 0 - success, 1 - fail
  * @param {Object} config wdio configuration object
  * @param {Array.<Object>} capabilities list of capabilities details
  * @param {<Object>} results object containing test results
  */
  // onComplete: function(exitCode, config, capabilities, results) {
  // },
  /**
  * Gets executed when a refresh happens.
  * @param {String} oldSessionId session ID of the old session
  * @param {String} newSessionId session ID of the new session
  */
  // onReload: function(oldSessionId, newSessionId) {
  // }
}
