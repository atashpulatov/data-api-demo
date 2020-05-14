
const settings = {
  officeOnline: {
    username: 'test3@mstrtesting.onmicrosoft.com',
    password: 'FordFocus2019',
    url: 'https://www.office.com/launch/excel?auth=2',
  },
  env: {
    hostname: getEnvironment(),
    username: 'a',
    password: '',
    chineseSimplifiedUser: 'User_SChinese',
    germanUser: 'User_German',
  }
};

/**
 * It checks if last parameter contains "env-#######" if not it returns localhost
 * "npm test env-000000"
 *
 * @returns {string}
 */
function getEnvironment() {
  const env = process.argv[process.argv.length - 1];
  if (env.includes('env-')) {
    return env;
  }
  return '127.0.0.1';
}

export default settings;
