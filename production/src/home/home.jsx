import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import './home.css';
import { withTranslation } from 'react-i18next';
import { sessionHelper } from '../storage/session-helper';
import HomeContent from './home-content';
import { homeHelper } from './home-helper';
import { toggleRenderSettingsFlag } from '../office/store/office-actions';
import { officeStoreService } from '../office/store/office-store-service';

export class HomeNotConnected extends Component {
  componentDidMount = async () => {
    try {
      await officeStoreService.loadExistingReportBindingsExcel();
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

const mapDispatchToProps = { toggleRenderSettingsFlag, };

HomeNotConnected.defaultProps = { t: (text) => text, };

export const Home = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(HomeNotConnected));
