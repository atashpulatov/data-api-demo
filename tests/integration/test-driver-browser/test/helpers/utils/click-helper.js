
export function waitAndClick(button, timeout = 6000) {
  button.waitForEnabled(timeout, false, `${JSON.stringify(button)} was not found`);
  button.click();
}

export function waitAndRightClick(button, timeout = 6000) {
  button.waitForEnabled(timeout, false, `${JSON.stringify(button)}` + ' was not found');
  button.click({ button: 'right' });
}

export function waitAndDoubleClick(button, timeout = 6000) {
  button.waitForEnabled(timeout, false, `${JSON.stringify(button)} was not found`);
  button.doubleClick();
}
