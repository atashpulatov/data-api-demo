import { LoginProps } from './basic-login-types';

const isDev = process.env.NODE_ENV !== 'production';

// eslint-disable-next-line import/no-mutable-exports
let defaultLoginProps: LoginProps = {
  username: '',
  password: '',
  envUrl: '',
  rememberMe: true,
  loginMode: 1,
};

if (isDev) {
  defaultLoginProps = {
    ...defaultLoginProps,
    username: 'mstr',
    envUrl: 'https://env-000000.customer.cloud.microstrategy.com/MicroStrategyLibrary',
  };
}

export default defaultLoginProps;
