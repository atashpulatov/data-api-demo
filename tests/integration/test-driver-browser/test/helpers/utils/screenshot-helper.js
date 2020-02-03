import { createWriteStream } from 'fs';
import { browser } from 'protractor';

// TODO: needs to be refactor for webdriverIO - Currently it is not used
export async function takeScreenshot(fileName) {
  browser.takeScreenshot().then((png) => {
    const stream = createWriteStream(`./REPORTS/e2e/screenshots/${fileName}.png`);
    stream.write(new Buffer(png, 'base64'));
    stream.end();
  });
}
