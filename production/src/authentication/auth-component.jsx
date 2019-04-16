import React, {Component} from 'react';
import './auth-component.css';
import {reduxStore} from '../store';
import {Form, Icon, Input, Button} from 'antd';
import {authenticationHelper} from './authentication-helper';
import {connect} from 'react-redux';
import {resetState} from '../popup/popup-actions';
const FormItem = Form.Item;

export class _Authenticate extends Component {
  constructor(props) {
    super(props);
    this.props.resetState();
  }

  onLoginUser = async (event) => {
    event.preventDefault();
    const validateFields = this.props.form.validateFields;
    await validateFields(async (err, values) => authenticationHelper.loginUser(err, values));
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <article>
        <header>
          <h1 id='authenticate-message'>
            Connect to MicroStrategy Environment
          </h1>
        </header>
        <Form onSubmit={(event) => this.onLoginUser(event)} className='login-form grid-container padding'>
          <FormItem
            label='Username'>
            {getFieldDecorator('username', {
              rules: [{required: true, message: 'Please input your username!'}],
            })(
                <Input
                  prefix={
                    <Icon type='user' style={{color: 'rgba(0,0,0,.25)'}} />}
                  placeholder='Username' />
            )}
          </FormItem>
          <FormItem
            label='Password'>
            {getFieldDecorator('password', {
              rules: [{message: 'Please input your Password!'}],
            })(
                <Input
                  prefix={
                    <Icon type='lock' style={{color: 'rgba(0,0,0,.25)'}} />}
                  type='password'
                  placeholder='Password' />
            )}
          </FormItem>
          <FormItem
            label='Environment URL'>
            {getFieldDecorator('envUrl', {
              initialValue: this.props.envUrl || '',
              rules: [{required: true, message: 'Please input environment URL!', type: 'url'}],
            })(
                <Input
                  prefix={
                    <Icon type='link' style={{color: 'rgba(0,0,0,.25)'}} />}
                  placeholder='environment URL' />
            )}
          </FormItem>
          <div
            className='centered-fields-container'>
            <FormItem>
              <Button type='primary' htmlType='submit' className='login-form-button'>
                Log in
              </Button>
            </FormItem>
          </div>
        </Form>
      </article>
    );
  }
}

function mapStateToProps(state) {
  return {
    envUrl: state.sessionReducer.envUrl,
  };
}

const mapDispatchToProps = {
  resetState,
};

export const Authenticate = connect(mapStateToProps, mapDispatchToProps)(Form.create()(_Authenticate));
