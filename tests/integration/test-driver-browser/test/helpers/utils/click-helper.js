/**
   * Waits for specified button to be enabled and then clicks it.
   *
   * @param {HTMLElement} button selector that will be clicked
   * @param {Time} timeout time to wait for selector
   *
   */
export function waitAndClick(button, timeout = 6000) {
  button.waitForEnabled(timeout, false, `${JSON.stringify(button)} was not found`);
  button.click();
}

/**
   * Waits for specified button to be enabled and then right clicks it.
   *
   * @param {HTMLElement} button selector that will be clicked
   * @param {Time} timeout time to wait for selector
   *
   */
export function waitAndRightClick(button, timeout = 6000) {
  button.waitForEnabled(timeout, false, `${JSON.stringify(button)}` + ' was not found');
  button.click({ button: 'right' });
}

/**
   * Waits for specified button to be enabled and then doubleclicks it.
   *
   * @param {HTMLElement} button selector that will be clicked
   * @param {Time} timeout time to wait for selector
   *
   */
export function waitAndDoubleClick(button, timeout = 6000) {
  button.waitForEnabled(timeout, false, `${JSON.stringify(button)} was not found`);
  button.doubleClick();
}
