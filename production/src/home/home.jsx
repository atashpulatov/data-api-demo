import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import './home.css';
import { withTranslation } from 'react-i18next';
import { sessionHelper } from '../storage/session-helper';
import { pageBuilder } from './page-builder.js';
import { officeApiHelper } from '../office/office-api-helper';
import { homeHelper } from './home-helper';

export class _Home extends Component {
  componentDidMount = async () => {
    try {
      await officeApiHelper.loadExistingReportBindingsExcel();
      homeHelper.saveLoginValues();
      homeHelper.saveTokenFromCookies();
      sessionHelper.disableLoading();
    } catch (error) {
      console.error(error);
    }
  };

  componentDidUpdate() {
    homeHelper.saveTokenFromCookies();
  }

  render() {
    const {
      loading, loadingReport, authToken, reportArray, popupOpen, t,
    } = this.props;
    return (<div>{pageBuilder.getPage(loading, loadingReport, authToken, reportArray, popupOpen, t)}</div>);
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

_Home.defaultProps = {
  t: (text) => text,
};

export const Home = connect(mapStateToProps)(withTranslation('common')(_Home));
