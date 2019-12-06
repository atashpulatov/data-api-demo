import { createWriteStream } from 'fs';
import { browser } from 'protractor';

export async function takeScreenshot(fileName) {
  browser.takeScreenshot().then(function(png) {
    const stream = createWriteStream(`./REPORTS/e2e/screenshots/${fileName}.png`);
    stream.write(new Buffer(png, 'base64'));
    stream.end();
  });
}
