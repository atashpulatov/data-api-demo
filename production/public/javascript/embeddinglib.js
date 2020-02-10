// Placeholder of embeddinglib.js for local development
console.group('Using Add-in outside MicroStrategyLibrary, prompts not available');
console.log('To be able to deploy this locally, please do the following:');
console.log('1) Temporarily run a new instance of Chrome with CORS turned off with the following command: '
  + 'open -n -a "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security '
  + 'in your terminal');
console.log('2) Replace the embeddinglib.js placeholder in /production/public/javascript with actual, up-to-date library, ie. from https://demo.microstrategy.com/MicroStrategyLibrary/javascript/embeddinglib.js');
console.groupEnd();
