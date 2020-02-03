
export function waitAndClick(button, timeout = 6000) {
  button.waitForEnabled(timeout, false, `${JSON.stringify(button)}` + ' was not found');
  button.click();
}
