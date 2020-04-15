import React, { Component } from 'react';
import './auth-component.css';
import PropTypes from 'prop-types';
import {
  Form, Icon, Input, Button, Checkbox, Select,
} from 'antd';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { authenticationHelper } from './authentication-helper';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';

const FormItem = Form.Item;

export class AuthenticateNotConnected extends Component {
  constructor(props) {
    super(props);
    localStorage.removeItem('refreshData');
    props.resetState();
  }

  onLoginUser = async (event) => {
    event.preventDefault();
    const { form } = this.props;
    await form.validateFields(async (err, values) => authenticationHelper.loginUser(err, values));
  }

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
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={t('Username')}
              maxLength={250}
            />)}
          </FormItem>
          <FormItem label={t('Password')}>
            {getFieldDecorator('password', {
              initialValue: session.password || '',
              rules: [{ message: t('Please input your Password!') }],
            })(<Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder={t('Password')}
            />)}
          </FormItem>
          <FormItem label={t('Environment URL')}>
            {getFieldDecorator('envUrl', {
              initialValue: session.envUrl || '',
              rules: [{ required: true, message: t('Please input environment URL!'), type: 'url' }],
            })(<Input
              prefix={<Icon type="link" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
AuthenticateNotConnected.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func,
    getFieldDecorator: PropTypes.func
  }),
  session: PropTypes.shape({
    username: PropTypes.string,
    password: PropTypes.string,
    envUrl: PropTypes.string,
    loginMode: PropTypes.string,
    isRememberMeOn: PropTypes.bool
  }),
  resetState: PropTypes.func,
  t: PropTypes.func
};
AuthenticateNotConnected.defaultProps = { t: (text) => text, };

function mapStateToProps(state) {
  return { session: state.sessionReducer, };
}

const mapDispatchToProps = { resetState: popupActions.resetState, };

export const Authenticate = connect(mapStateToProps, mapDispatchToProps)(Form.create()(withTranslation('common')(AuthenticateNotConnected)));
