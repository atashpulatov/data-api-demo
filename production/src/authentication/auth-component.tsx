import React, { FormEvent } from 'react';
import './auth-component.css';
import {
  Form, Input, Button, Checkbox, Select,
} from 'antd';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { LinkOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { authenticationHelper } from './authentication-helper';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { AuthenticateNotConnectedProps } from './auth-component-types';

const FormItem = Form.Item;

export class AuthenticateNotConnected extends React.Component<AuthenticateNotConnectedProps> {
  constructor(props: AuthenticateNotConnectedProps) {
    super(props);
    localStorage.removeItem('refreshData');
    props.resetState();
  }

  onLoginUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields(async (err: Error, values: Object) => authenticationHelper.loginUser(err, values));
  };

  render() {
    const { session, form, t } = this.props;
    const { getFieldDecorator } = form;
    const { Option } = Select;
    return (
      <article>
        <header>
          <h1 id="authenticate-message">
            {t('Connect to MicroStrategy Environment')}
          </h1>
        </header>
        <Form onSubmit={(event) => this.onLoginUser(event)} className="login-form grid-container padding">
          <FormItem label={t('Username')}>
            {getFieldDecorator('username', {
              initialValue: session.username,
              rules: [{ required: true, message: t('Please input your username!') }],
            })(<Input
              prefix={<UserOutlined />}
              placeholder={t('Username')}
              maxLength={250}
            />)}
          </FormItem>
          <FormItem label={t('Password')}>
            {getFieldDecorator('password', {
              initialValue: session.password || '',
              rules: [{ message: t('Please input your Password!') }],
            })(<Input
              prefix={<LockOutlined />}
              type="password"
              placeholder={t('Password')}
            />)}
          </FormItem>
          <FormItem label={t('Environment URL')}>
            {getFieldDecorator('envUrl', {
              initialValue: session.envUrl || '',
              rules: [{ required: true, message: t('Please input environment URL!'), type: 'url' }],
            })(<Input
              prefix={<LinkOutlined />}
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
            {getFieldDecorator('isRememberMeOn', {
              valuePropName: 'checked',
              initialValue: session.isRememberMeOn || false,
            })(<Checkbox>{t('Remember Me')}</Checkbox>)}
          </FormItem>
          <div className="centered-fields-container">
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                {t('Log in')}
              </Button>
            </FormItem>
          </div>
        </Form>
      </article>
    );
  }
}

function mapStateToProps(state: any) {
  return { session: state.sessionReducer, };
}

const mapDispatchToProps = { resetState: popupActions.resetState, };

export const Authenticate = connect(mapStateToProps, mapDispatchToProps)(Form.create()(withTranslation('common')(AuthenticateNotConnected)));
