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
