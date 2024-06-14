/* eslint-disable react/no-multi-comp */
import React, { FC, useCallback } from 'react';
import { connect } from 'react-redux';

import { authenticationHelper } from './authentication-helper';

import { AuthenticateComponent } from './auth-component-types';
import { InputProps, LoginProps, SelectInputProps } from './basic-login-types';

import { errorService } from '../error/error-handler';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';
import defaultLoginProps from './default-login-props';

import './basic-login.scss';
import './auth-component.css';

const Input = (props: InputProps): React.ReactElement => {
  const { label } = props;
  return (
    <div className='input-container'>
      <label>
        {label}
        <input {...props} />
      </label>
    </div>
  );
};

const SelectInput = (props: SelectInputProps): React.ReactElement => {
  const { label, children } = props;
  return (
    <div className='input-container'>
      <label>
        {label}
        <select {...props}>{children}</select>
      </label>
    </div>
  );
};

const getApiUrl = (url: string): string => {
  // Remove queries and hash
  const { pathname } = new URL(url);
  const apiURL = new URL(`${pathname}`, url);
  // Remove trailing /
  return apiURL.href.replace(/\/?$/, '');
};

export const AuthenticateNotConnected: FC<AuthenticateComponent> = props => {
  const [formData, setFormData] = React.useState<LoginProps>({
    ...defaultLoginProps,
  });

  const { session, resetState } = props;

  localStorage.removeItem('refreshData');
  resetState();

  const onLoginUser = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (event.currentTarget.checkValidity()) {
        try {
          await authenticationHelper.loginUser(formData);
        } catch (error) {
          console.error(error);
          errorService.handleError(error, { isLogout: true } as any);
        } finally {
          sessionActions.disableLoading();
        }
      }
    },
    [formData]
  );

  const onChange = ({ target }: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>): void => {
    const isCheckbox = target.type === 'checkbox';
    const newFormValue = {
      [target.name]: isCheckbox ? target.checked : target.value,
    };
    setFormData(prevFormData => ({ ...prevFormData, ...newFormValue }));
  };

  const normalizeURL = (url: any): void => {
    const trimmedURL = url.replace(/\/$/, '');
    const normalizedURL = getApiUrl(trimmedURL);
    setFormData(prevFormData => ({ ...prevFormData, envUrl: normalizedURL }));
  };

  return (
    <div id='basic-login' className='auth-form'>
      <header>
        <h1 id='authenticate-message'>Excel</h1>
      </header>

      <form onSubmit={onLoginUser} className='grid-container' autoComplete='on'>
        <Input
          name='username'
          label='Username'
          maxLength={250}
          onChange={onChange}
          placeholder='Username'
          required
          defaultValue={session.username}
        />

        <Input
          name='password'
          label='Password'
          onChange={onChange}
          placeholder='Password'
          type='password'
          defaultValue={session.password}
        />

        <Input
          label='Library URL'
          type='envUrl'
          name='envUrl'
          placeholder='https://domain/MicroStrategyLibrary'
          onChange={onChange}
          onBlur={e => normalizeURL(e.target.value)}
          defaultValue={session.envUrl}
          required
        />

        <SelectInput
          label='Login Mode'
          name='loginMode'
          onChange={onChange}
          defaultValue={session.loginMode}
        >
          <option value={1}>Standard (1)</option>
          <option value={16}>LDAP (16)</option>
        </SelectInput>

        <Input
          checked={session.isRememberMeOn}
          name='rememberMe'
          label='Remember me'
          onChange={onChange}
          type='checkbox'
        />

        <input type='submit' value='Submit' />
      </form>
    </div>
  );
};

function mapStateToProps(state: any): any {
  return { session: state.sessionReducer };
}

const mapDispatchToProps = { resetState: popupActions.resetState };

export const Authenticate = connect(mapStateToProps, mapDispatchToProps)(AuthenticateNotConnected);
