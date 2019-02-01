/* eslint-disable */
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { HashRouter as Router } from 'react-router-dom';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs.jsx';
import { Header } from './header.jsx';
import { MenuBar } from '../menu-bar/menu-bar.jsx';
import { Footer } from './footer.jsx';
import { FileHistoryContainer } from '../file-history/file-history-container.jsx';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import './home.css';
import { Notifications } from '../notification/notifications.jsx';
import { Authenticate } from '../authentication/auth-component.jsx';
import { sessionHelper } from '../storage/session-helper';
import { Placeholder } from './placeholder.jsx';
/* eslint-enable */

const predefinedEnvUrl = 'https://env-125323.customer.cloud.microstrategy.com/MicroStrategyLibrary/api';

export class _Home extends Component {

  saveMockedLoginValues = () => {
    console.log('saving login info');
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
    console.log(splittedCookiesJar);
    const authToken = splittedCookiesJar.filter((cookie) => {
        return cookie.name === ' iSession';
    });
    console.log(authToken);
    if (authToken[0]) {
        sessionHelper.login(authToken[0].value);
    }
}

componentDidMount = () => {
    this.saveMockedLoginValues();
    this.mockedLoginFlow();
}

componentDidUpdate = () => {
    this.mockedLoginFlow();
}

  render() {
    return (
        <div id='content'>
          <Notifications />
          <Header />
          <MenuBar />
          <FileHistoryContainer />
          <Breadcrumbs />
          <Spin spinning={this.props.loading}>
          {this.props.authToken 
            ? <Placeholder />
            : <Authenticate />}
          </Spin>
          <Footer />
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.sessionReducer.loading,
    authToken: state.sessionReducer.authToken,
  };
}

export const Home = connect(mapStateToProps)(_Home);
