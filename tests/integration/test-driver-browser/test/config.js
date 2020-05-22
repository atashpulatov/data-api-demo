import { parse } from '@babel/core';

const settings = {
  officeOnline: {
    url: 'https://www.office.com/launch/excel?auth=2',
    en: {
      username: 'test3@mstrtesting.onmicrosoft.com',
      password: 'FordFocus2019',
    },
    sp: {
      username: 'testes@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
    fr: {
      username: 'testfr@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
    it: {
      username: 'testit@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
    cn: {
      username: 'testcn@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
    cn2: {
      username: 'testcn2@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
    de: {
      username: 'testde@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
    nl: {
      username: 'testnl@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
    dk: {
      username: 'testdk@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
    se: {
      username: 'testse@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
    pt: {
      username: 'testpt@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
    jp: {
      username: 'testjp@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
    kr: {
      username: 'testkr@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
    pl: {
      username: 'testpl@mstrtesting.onmicrosoft.com',
      password: 'Testing1212'
    },
  },
  args: parseArgs(),
  env: {
    username: 'a',
    password: '',
    chineseSimplifiedUser: 'User_SChinese',
    germanUser: 'User_German',
  }
};

/**
 * Parses arguments passed to terminal
 * syntax of passing arguments: argument="value"
 * @return {Object} arguments
 */
function parseArgs() {
  const { argv } = process;
  const args = { // passing default values when user doesn't provide them
    env: '127.0.0.1',
    lang: 'en',
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
