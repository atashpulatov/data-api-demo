/* eslint-disable */
import React, {Component} from 'react';
import {Form, Radio, Input} from 'antd';
import MSTRCallback from '../utilities/MSTRCallback';

const parameter = new MSTRCallback('parameter');
const restoreUrl = parameter.data ? parameter.data.connectionData.url : null;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
/* eslint-enable */

const formItemLayout = {
    labelCol: {
        sm: {span: 24},
        md: {span: 4},
    },
    wrapperCol: {
        sm: {span: 24},
        md: {span: 20},
    },
    colon: false,
    required: false,
};


class AuthenticationForm extends Component {
    componentWillUpdate(nextProps, nextState) {
        const {getFieldsError} = nextProps.form;
        nextProps.getFormValidity(getFieldsError());
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form id='authForm' onSubmit={this.props.handleSubmit} layout='horizontal'>
                <FormItem label='API Server' {...formItemLayout}>
                    {getFieldDecorator('url', {
                        rules: [{
                            required: true,
                            message: 'Please enter a valid MicroStrategy Library URL',
                            type: 'url',
                        }],
                        initialValue: restoreUrl,
                    })(
                        <Input placeholder='https://<<MSTR Domain>>/MicroStrategyLibrary/' />
                    )}
                </FormItem>
                <div className="h-divider"></div>
                <FormItem label='Authentication' {...formItemLayout}>
                    {getFieldDecorator('loginMode', {
                        initialValue: '1',
                    })(
                        <RadioGroup>
                            <Radio value='1'>Standard</Radio>
                            <Radio value='16'>LDAP</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem label='Username' {...formItemLayout} wrapperCol={{md: {span: 8}}}>
                    {getFieldDecorator('username', {
                        rules: [{
                            required: true,
                            message: 'Please enter your Username',
                        }],
                    })(
                        <Input />
                    )}

                </FormItem>
                <FormItem label='Password' {...formItemLayout} wrapperCol={{md: {span: 8}}}>
                    {getFieldDecorator('password', {
                        rules: [{required: false}],
                    })(
                        <Input type='password' />
                    )}
                </FormItem>
                <div style={{display: 'none'}}>
                    <FormItem label='Submit' {...formItemLayout} wrapperCol={{md: {span: 8}}}>
                        <button type="submit">Submit</button>
                    </FormItem>
                </div>
            </Form>
        );
    }
}

const Authentication = Form.create()(AuthenticationForm);

export default Authentication;
