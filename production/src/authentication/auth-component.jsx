/* eslint-disable */
import React, { Component } from 'react';
import './auth-component.css';
import { authenticationService } from './auth-rest-service';
import { reduxStore } from '../store';
import { withNavigation } from '../navigation/with-navigation.jsx';
import { sessionHelper } from '../storage/session-helper';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { errorService } from '../error/error-handler';
import { notificationService } from '../notification/notification-service';
import {LibraryFrame} from './library-container.jsx';
const FormItem = Form.Item;
/* eslint-enable */

const predefinedEnvUrl = 'https://env-125323.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

export class _Authenticate extends Component {
    constructor(props) {
        super(props);
        this.stateFromRedux = reduxStore.getState().sessionReducer;
        this.state = {
            username: this.stateFromRedux.username || '',
            envUrl: this.stateFromRedux.envUrl || predefinedEnvUrl,
        };
    }

    saveMockedLoginValues = () =>{
        const values = {
            username: 'mstr',
            envUrl: predefinedEnvUrl,
            isRememberMeOn: false,
        }
        sessionHelper.saveLoginValues(values);
    }

    getCookies = () =>{
        const cookieJar = document.cookie;
        const splittedCookies = cookieJar.split(';');
        return splittedCookies.map((cookie) => {
            const slicedCookie = cookie.split('=');
            return {
                name: slicedCookie[0],
                value: slicedCookie[1],
            }
        });
    }

    mockedLoginFlow = () =>{
        this.saveMockedLoginValues();
        const splittedCookiesJar = this.getCookies();
        console.log(splittedCookiesJar);
        const authToken = splittedCookiesJar.filter((cookie) => {
            return cookie.name === ' iSession';
        });
        if(authToken[0]){
            sessionHelper.login(authToken[0].value);
        }
    }

    componentDidMount = () => {
        this.mockedLoginFlow();
    }

    componentDidUpdate = () => {
        this.mockedLoginFlow();
    }

    openLib = async () => {
        await Office.context.ui.displayDialogAsync('https://env-125323.customer.cloud.microstrategy.com/MicroStrategyLibrary/');
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
                <Button href='https://env-125323.customer.cloud.microstrategy.com/MicroStrategyLibrary/' target="_blank">Auth?</Button>
                <Button href='/MicroStrategyLibrary/build/index.html'>
                    App</Button>
            </article>
        );
    }
}

const AuthenticateForm = Form.create()(_Authenticate);

export const Authenticate = withNavigation(AuthenticateForm);
