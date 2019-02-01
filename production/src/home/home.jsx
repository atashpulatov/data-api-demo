/* eslint-disable */
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import './home.css';
import { sessionHelper } from '../storage/session-helper';
import { pageBuilder } from './page-builder.js';
import { officeApiHelper } from '../office/office-api-helper';
import { mstrObjectListHelper } from '../mstr-object/mstr-object-list-helper';
/* eslint-enable */

const predefinedEnvUrl = 'https://env-125323.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

export class _Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: null,
        }
    }

    saveMockedLoginValues = () => {
        const values = {
            username: 'mstr',
            envUrl: predefinedEnvUrl,
            isRememberMeOn: true,
        }
        sessionHelper.saveLoginValues(values);
    }

    getCookies = () => {
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

    mockedLoginFlow = () => {
        const splittedCookiesJar = this.getCookies();
        const authToken = splittedCookiesJar.filter((cookie) => {
            return cookie.name === ' iSession';
        });
        if (authToken[0]) {
            sessionHelper.logIn(authToken[0].value);
        }
    }

    componentDidMount = async () => {
        await officeApiHelper.loadExistingReportBindingsExcel();
        const { loading, authToken, reportArray } = this.props;
        this.saveMockedLoginValues();
        this.mockedLoginFlow();
        const page = pageBuilder.getPage(loading, authToken, reportArray);
        sessionHelper.disableLoading();
        this.setState({
            page,
        });
    }

    componentDidUpdate = (prevProps) => {
        const { loading, authToken, reportArray } = this.props;
        const reportArraysEqual = mstrObjectListHelper.compareMstrObjectArrays(prevProps.reportArray, reportArray);
        if (prevProps.loading === loading
            && authToken === this.props.authToken
            && reportArraysEqual) {
            return;
        }
        const page = pageBuilder.getPage(loading, authToken, reportArray);
        this.setState({
            page,
        });
        this.mockedLoginFlow();
    }

    render() {
        return (
            <div>
                {this.state.page}
            </div>)
    }
}

function mapStateToProps(state) {
    return {
        loading: state.sessionReducer.loading,
        authToken: state.sessionReducer.authToken,
        reportArray: state.officeReducer.reportArray,
    };
}

export const Home = connect(mapStateToProps)(_Home);
