/* eslint-disable */
import React, { Component } from 'react';
import './auth-component.css';
import { authenticationService } from './auth-rest-service';
import { reduxStore } from '../store';
import { withNavigation } from '../navigation/with-navigation.jsx';
import { sessionHelper } from '../storage/session-helper';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { errorService } from '../error/error-handler';
const FormItem = Form.Item;
/* eslint-enable */

export class _Authenticate extends Component {
    constructor(props) {
        super(props);
        this.stateFromRedux = reduxStore.getState().sessionReducer;
        this.state = {
            username: this.stateFromRedux.username || '',
            envUrl: this.stateFromRedux.envUrl || '',
        };
    }

    onLoginUser = async (event) => {
        event.preventDefault();
        const validateFields = this.props.form.validateFields;
        try {
            await validateFields(async (err, values) => {
                if (!err) {
                    sessionHelper.enableLoading();
                    sessionHelper.saveLoginValues(values);
                    const authToken = await authenticationService.authenticate(
                        values.username, values.password,
                        values.envUrl, this.state.authMode);
                    sessionHelper.login(authToken);
                }
            });
        } catch (error) {
            errorService.handleError(error);
        }
        finally {
            sessionHelper.disableLoading();
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <article>
                <header>
                    <h1 id='authenticate-message'>
                        Connect to MicroStrategy Environment
                    </h1>
                </header>
                <Form onSubmit={this.onLoginUser} className='login-form grid-container padding'>
                    <FormItem
                        label='Username'>
                        {getFieldDecorator('username', {
                            initialValue: this.stateFromRedux.username || '',
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input
                                prefix={
                                    <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder='Username' />
                        )}
                    </FormItem>
                    <FormItem
                        label='Password'>
                        {getFieldDecorator('password', {
                            rules: [{ message: 'Please input your Password!' }],
                        })(
                            <Input
                                prefix={
                                    <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type='password'
                                placeholder='Password' />
                        )}
                    </FormItem>
                    <FormItem
                        label='Environment URL'>
                        {getFieldDecorator('envUrl', {
                            initialValue: this.stateFromRedux.envUrl || '',
                            rules: [{ required: true, message: 'Please input environment URL!' }],
                        })(
                            <Input
                                prefix={
                                    <Icon type='link' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder='environment URL' />
                        )}
                    </FormItem>
                    <div
                        className='centered-fields-container'>
                        <FormItem>
                            {getFieldDecorator('isRememberMeOn', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>Remember me</Checkbox>
                            )}
                        </FormItem>
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

const AuthenticateForm = Form.create()(_Authenticate);

export const Authenticate = withNavigation(AuthenticateForm);
