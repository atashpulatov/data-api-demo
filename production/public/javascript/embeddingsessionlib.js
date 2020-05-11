/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

/**
 * event listener injected to iframe, that sends message
 * to extend the session
 *
 * files in public are not transpiled by babel,
 * so it should be done manually, that's the
 * reason of disabling 'func-names' as well as 'prefer-arrow-callback'
 */
['click', 'keydown'].forEach(function (event) {
  document.addEventListener(event, function () {
    return window.parent.postMessage('EXTEND_SESSION', window.origin);
  }, false);
});

// 500ms for interval step
var intervalDelay = 500;
// 10min for max interval period
var maxIntervalSteps = (10 * 60 * 1000) / intervalDelay;
var intervalStepCounter = 0;
/**
 * Inject global variables to embedded dossier iframe, to disable the possibilty of
 * export data from visualiation menu. Remove when DE166960 will be solved from embedded sdk side
 * or when export functionality starts to work correctly.
 *
 * Interval which tryies to inject the variables runs every @param intervalDelay ms.
 * It stops running after reaching @param maxIntervalSteps steps or when
 * the variables are set up to expected values correctly.
 */
var interval = setInterval(function () {
  intervalStepCounter += 1;
  if (window.mstrApp) {
    if (window.mstrApp.features) {
      window.mstrApp.features['web-export-to-excel-privilege'] = false;
      window.mstrApp.features['web-export-to-pdf-privilege'] = false;
      window.mstrApp.features['web-export-to-csv-privilege'] = false;
      clearInterval(interval);
    }
  } else if (intervalStepCounter >= maxIntervalSteps) {
    clearInterval(interval);
  }
}, intervalDelay);
