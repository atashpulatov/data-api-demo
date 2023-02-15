import React, { FC, FormEvent } from 'react';
import {
  Form, Input, Button, Select,
} from 'antd';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { authenticationHelper } from './authentication-helper';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { AuthenticateComponent } from './auth-component-types';
import './auth-component.css';

const FormItem = Form.Item;

export const AuthenticateNotConnected: FC<AuthenticateComponent> = (props) => {
  const [t] = useTranslation();

  const { session, form, resetState } = props;
  const { getFieldDecorator } = form;
  const { Option } = Select;

  localStorage.removeItem('refreshData');
  resetState();

  const onLoginUser = (event: FormEvent) => {
    event.preventDefault();
    form.validateFields((err: Error, values: any) => authenticationHelper.loginUser(err, values));
  };

  return (
    <article>
      <header>
        <h1 id="authenticate-message">
          {t('Connect to MicroStrategy Environment')}
        </h1>
      </header>
      <Form onSubmit={(event) => onLoginUser(event)} className="login-form grid-container padding">
        <FormItem label={t('Username')}>
          {getFieldDecorator('username', {
            initialValue: session.username,
            rules: [{ required: true, message: t('Please input your username!') }],
          })(<Input
            placeholder={t('Username')}
            maxLength={250}
          />)}
        </FormItem>
        <FormItem label={t('Password')}>
          {getFieldDecorator('password', {
            initialValue: session.password || '',
            rules: [{ message: t('Please input your Password!') }],
          })(<Input
            type="password"
            placeholder={t('Password')}
          />)}
        </FormItem>
        <FormItem label={t('Environment URL')}>
          {getFieldDecorator('envUrl', {
            initialValue: session.envUrl || '',
            rules: [{ required: true, message: t('Please input environment URL!'), type: 'url' }],
          })(<Input
            placeholder={t('environment URL')}
          />)}
        </FormItem>
        <FormItem label="Login mode">
          {getFieldDecorator('loginMode', {
            initialValue: session.loginMode || '1',
            rules: [{ required: true }],
          })(<Select>
            <Option value="1">Standard</Option>
            <Option value="16">LDAP</Option>
          </Select>)}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            {t('Log in')}
          </Button>
        </FormItem>
      </Form>
    </article>
  );
};

function mapStateToProps(state: any) {
  return { session: state.sessionReducer };
}

const mapDispatchToProps = { resetState: popupActions.resetState, };

export const Authenticate = connect(mapStateToProps, mapDispatchToProps)(Form.create()(AuthenticateNotConnected));
