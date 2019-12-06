// import { protractor } from 'protractor';
// const EC = protractor.ExpectedConditions;

export  function waitAndClick(button, timeout = 6000) {
  // await browser.wait(EC.elementToBeClickable(button), timeout, `${button.locator()}` + ' was not found');
  // if (browserName === 'chrome') {
  //   await browser.executeScript('return arguments[0].click()', button);
  // } else {
  //   await button.click();
  // }

  // button.waitForDisplayed(timeout, false, `${button}` + ' was not found');
  button.waitForEnabled(timeout, false, `${JSON.stringify(button)}` + ' was not found');

  //  browser.execute('return arguments[0].click()', button);

  button.click();

}
