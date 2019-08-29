import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import './home.css';
import { withTranslation } from 'react-i18next';
import { sessionHelper } from '../storage/session-helper';
import HomeContent from './home-content';
import { officeApiHelper } from '../office/office-api-helper';
import { homeHelper } from './home-helper';
import { toggleRenderSettingsFlag } from '../office/office-actions';

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
    return (<HomeContent {...this.props} />);
  }
}

function mapStateToProps(state) {
  return {
    loading: state.sessionReducer.loading,
    loadingReport: state.officeReducer.loading || state.officeReducer.popupOpen,
    popupOpen: state.officeReducer.popupOpen,
    authToken: state.sessionReducer.authToken,
    reportArray: state.officeReducer.reportArray,
    shouldRenderSettings: state.officeReducer.shouldRenderSettings,
  };
}

const mapDispatchToProps = {
  toggleRenderSettingsFlag,
};

_Home.defaultProps = {
  t: (text) => text,
};

export const Home = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_Home));
