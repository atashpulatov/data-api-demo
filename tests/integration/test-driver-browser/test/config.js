const settings = {
  officeOnline: {
    url: 'https://www.office.com/launch/excel?auth=2',
    // English United States - default
    'en-us': {
      username: 'test@microstrategytest.onmicrosoft.com',
      password: 'FordFocus2019',
    },
    // Spanish Spain
    'es-es': {
      username: 'testes@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
    // French France
    'fr-fr': {
      username: 'testfr@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
    // Italian Italy
    'it-it': {
      username: 'testit@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
    // Chinese Simplified
    'zn-cn': {
      username: 'testcn@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
    // Chinese Traditional
    'zn-tw': {
      username: 'testcn2@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
    // German Germany
    'de-de': {
      username: 'testde@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
    // Dutch Nederlands
    'nl-nl': {
      username: 'testnl@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
    // Danish Denmark
    'da-dk': {
      username: 'testdk@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
    // Swedish Sweden
    'sv-se': {
      username: 'testse@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
    // Portugese Brazil
    'pt-br': {
      username: 'testpt@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
    // Japanese Japan
    'ja-jp': {
      username: 'testjp@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
    // Korean Korea
    'ko-kr': {
      username: 'testkr@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
    // Polish Poland
    'pl-pl': {
      username: 'testpl@microstrategytest.onmicrosoft.com',
      password: 'Testing1212'
    },
  },
  args: parseArgs(),
  env: {
    username: 'a',
    password: '',
    chineseSimplifiedUser: 'ChineseUser',
    germanUser: 'User_German',
  }
};

/**
 * Parses arguments passed to terminal
 * Syntax of passing arguments - argument="value", f.e. npm run test-suite acceptance env="env-123453" lang="ko-kr"
 * @return {Object} arguments
 */
function parseArgs() {
  const { argv } = process;
  const args = { // passing default values when user doesn't provide them
    env: '127.0.0.1',
    lang: 'en-us',
  };
  argv.forEach(argument => {
    if (argument.includes('=')) {
      const [key, value] = argument.split('=');
      args[key] = value.substring(0, value.length);
    }
  });
  return args;
}

export default settings;
