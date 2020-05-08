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

/**
 * Temporary inject global variables to embedded dossier iframe, to disable the possibilty of
 * export data from visualiation menu. Remove when DE166960 will be solved from embedded sdk side
 * and there will be prop parameter which results in export data funcitionality being hidden or
 * when export functionality starts to work correctly.
 */
const interval = setInterval(function () {
  if (window.mstrApp.features['web-export-to-excel-privilege'] === false) {
    console.log('interval success');
    clearInterval(interval);
  } else {
    window.mstrApp.features = {
      'web-export-to-excel-privilege': false,
      'web-export-to-pdf-privilege': false,
      'web-export-to-csv-privilege': false,
    };
  }
}, 1000);
