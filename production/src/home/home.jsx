/* eslint-disable */
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import './home.css';
import { sessionHelper } from '../storage/session-helper';
import { pageBuilder } from './page-builder.js';
import { officeApiHelper } from '../office/office-api-helper';
import { reduxStore } from '../store';
import { sessionProperties } from '../storage/session-properties';
/* eslint-enable */

export class _Home extends Component {

  saveMockedLoginValues = () => {
    console.log(window.location);
    const token = reduxStore.getState().sessionReducer.authToken;
    if (window.location.origin.search('localhost') !== -1) {
      if (!token) {
        reduxStore.dispatch({
          type: sessionProperties.actions.logOut,
        });
        return;
      }
    } else {
      const envUrl = `${window.location.origin}/MicroStrategyLibrary/api`;
      const values = {
        username: 'mstr',
        envUrl,
        isRememberMeOn: true,
      };
      sessionHelper.saveLoginValues(values);
    }
  };

  getCookiesToArray = () => {
    const cookieJar = document.cookie;
    const splittedCookies = cookieJar.split(';');
    return splittedCookies.map((cookie) => {
      const slicedCookie = cookie.split('=');
      return {
        name: slicedCookie[0],
        value: slicedCookie[1],
      };
    });
  };

  saveTokenFromCookies = () => {
    const splittedCookiesJar = this.getCookiesToArray();
    const authToken = splittedCookiesJar.filter((cookie) => {
      return cookie.name === ' iSession';
    });
    if (authToken[0]) {
      sessionHelper.logIn(authToken[0].value);
    }
  };

  componentDidMount = async () => {
    await officeApiHelper.loadExistingReportBindingsExcel();
    this.saveMockedLoginValues();
    this.saveTokenFromCookies();
    sessionHelper.disableLoading();
  };

  componentDidUpdate = () => {
    this.saveTokenFromCookies();
  };

  render() {
    const { loading, authToken, reportArray } = this.props;
    return (
      <div>
        {pageBuilder.getPage(loading, authToken, reportArray)}
      </div>);
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
