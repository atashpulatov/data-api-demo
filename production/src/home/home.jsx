import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import {connect} from 'react-redux';
import './home.css';
import {sessionHelper} from '../storage/session-helper';
import {pageBuilder} from './page-builder.js';
import {officeApiHelper} from '../office/office-api-helper';
import {homeHelper} from './home-helper';
import {authenticationHelper} from '../authentication/authentication-helper';

export class _Home extends Component {

  componentDidMount = async () => {
    await officeApiHelper.loadExistingReportBindingsExcel();
    homeHelper.saveLoginValues();
    homeHelper.saveTokenFromCookies();
    await authenticationHelper.validateAuthToken();
    sessionHelper.disableLoading();
  };

  componentDidUpdate = async () => {
    homeHelper.saveTokenFromCookies();
  };

  render() {
    const {loading, authToken, reportArray} = this.props;
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
