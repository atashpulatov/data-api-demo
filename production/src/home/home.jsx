import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import {connect} from 'react-redux';
import './home.css';
import {sessionHelper} from '../storage/session-helper';
import {pageBuilder} from './page-builder.js';
import {officeApiHelper} from '../office/office-api-helper';
import {homeHelper} from './home-helper';

export class _Home extends Component {
  componentDidMount = async () => {
    await officeApiHelper.loadExistingReportBindingsExcel();
    homeHelper.saveLoginValues();
    homeHelper.saveTokenFromCookies();
    sessionHelper.disableLoading();
  };

  componentDidUpdate() {
    homeHelper.saveTokenFromCookies();
  };

  render() {
    const {loading, loadingReport, authToken, reportArray, popupOpen} = this.props;
    return pageBuilder.getPage(loading, loadingReport, authToken, reportArray, popupOpen);
  }
}

function mapStateToProps(state) {
  return {
    loading: state.sessionReducer.loading,
    loadingReport: state.officeReducer.loading || state.officeReducer.popupOpen,
    popupOpen: state.officeReducer.popupOpen,
    authToken: state.sessionReducer.authToken,
    reportArray: state.officeReducer.reportArray,
  };
}

export const Home = connect(mapStateToProps)(_Home);
