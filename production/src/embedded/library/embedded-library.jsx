import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Empty } from '@mstr/connector-components/';
import { popupHelper } from '../../popup/popup-helper';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import scriptInjectionHelper from '../utils/script-injection-helper';
import './library.css';

const { microstrategy, Office } = window;

export default class EmbeddedLibraryNotConnected extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.msgRouter = null;
    this.onEmbeddedError = this.onEmbeddedError.bind(this);
    this.embeddedLibrary = null;
    this.state = { loadingFrame: true };
  }

  componentDidMount() {
    const origUserAgent = window.navigator.userAgent;
    Object.defineProperty(window.navigator, 'userAgent', {
      get() {
        return `${origUserAgent} MSTRExcel/1.0`;
      },
      configurable: true,
    });
    scriptInjectionHelper.watchForIframeAddition(
      this.container.current,
      this.onIframeLoad
    );
    this.loadEmbeddedLibrary(this.container.current);
  }

  componentWillUnmount() {
    if (this.msgRouter) {
      const { handleSelection } = this.props;
      const { EventType } = microstrategy.dossier;
      this.msgRouter.removeEventhandler(
        EventType.ON_LIBRARY_ITEM_SELECTED,
        handleSelection
      );
      this.msgRouter.removeEventhandler(
        EventType.ON_ERROR,
        this.onEmbeddedError
      );
    }
  }

  /**
   * This function is called after the embedded library iframe is added into the DOM
   * @param {*} iframe
   */
  onIframeLoad = (iframe) => {
    iframe.addEventListener('load', () => {
      const { contentDocument } = iframe;
      const { handleIframeLoadEvent } = this.props;
      // DE160793 - Throw session expired error when library redirects to login (iframe 'load' event)
      handleIframeLoadEvent();
      if (!scriptInjectionHelper.isLoginPage(contentDocument)) {
        // DE158588 - Not able to open library in embedding api on excel desktop in windows
        const isOfficeOnline = Office.context
          ? Office.context.platform === Office.PlatformType.OfficeOnline
          : false;
        const isIE = /Trident\/|MSIE /.test(window.navigator.userAgent);
        if (!isOfficeOnline && isIE) {
          scriptInjectionHelper.applyFile(
            contentDocument,
            'javascript/mshtmllib.js'
          );
        }
        scriptInjectionHelper.applyFile(
          contentDocument,
          'javascript/embeddingsessionlib.js'
        );
      }
    });
  };

  /**
   * Handles the event throwed after new error in embedded library.
   * Retrives the error type (based on title).
   * If error type is not a notification - handles it by closing the window
   *
   * @param {Object} error - payload throwed by embedded.api after the error occured
   */
  // eslint-disable-next-line class-methods-use-this
  onEmbeddedError = (error) => {
    const { title } = error;
    if (title !== 'Notification') {
      // TODO: improve this, so it doesn't depend on i18n
      error.mstrObjectType = mstrObjectEnum.mstrObjectType.dossier.name;
      popupHelper.handlePopupErrors(error);
    }
  };

  loadEmbeddedLibrary = async (container) => {
    const { mstrData, handleEmbeddedLibraryLoad, handleSelection } = this.props;
    const { envUrl, authToken } = mstrData;

    const serverUrl = envUrl.slice(0, envUrl.lastIndexOf('/api'));
    // delete last occurence of '/api' from the enviroment url

    const { CustomAuthenticationType, EventType } = microstrategy.dossier;

    try {
      const props = {
        serverUrl,
        enableCustomAuthentication: true,
        customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
        enableResponsive: true,
        currentPage: { key: 'all' },
        libraryItemSelectMode: 'single',
        getLoginToken() {
          return Promise.resolve(authToken);
        },
        placeholder: container,
        onMsgRouterReadyHandler: ({ MsgRouter }) => {
          this.msgRouter = MsgRouter;
          this.msgRouter.registerEventHandler(EventType.ON_LIBRARY_ITEM_SELECTED, handleSelection);
          this.msgRouter.registerEventHandler(EventType.ON_ERROR, this.onEmbeddedError);
        },
      };

      if (microstrategy && microstrategy.embeddingContexts) {
        const embeddedLibrary = await microstrategy.embeddingContexts.embedLibraryPage(props);
        this.embeddedLibrary = embeddedLibrary;

        this.setState({ loadingFrame: false });
        handleEmbeddedLibraryLoad();
      } else {
        console.warn(
          'Cannot find microstrategy.embeddingContexts, please check embeddinglib.js is present in your environment'
        );
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  render() {
    const { loadingFrame } = this.state;
    return (
      /*
      Height needs to be passed for container because without it, embedded api will set default height: 600px;
      We need to calculate actual height, regarding the size of other elements:
      58px for header, 19px for header and title margin and 68px for buttons.
      */
      <>
        {loadingFrame && <Empty isLoading />}
        <div ref={this.container} className="library-iframe" />
      </>
    );
  }
}

EmbeddedLibraryNotConnected.propTypes = {
  mstrData: PropTypes.shape({
    envUrl: PropTypes.string,
    authToken: PropTypes.string,
  }),
  handleIframeLoadEvent: PropTypes.func,
  handleEmbeddedLibraryLoad: PropTypes.func,
  handleSelection: PropTypes.func,
};

EmbeddedLibraryNotConnected.defaultProps = {
  mstrData: {
    envUrl: 'no env url',
    authToken: null,
  },
  handleSelection: () => {},
};

const mapStateToProps = (state) => {
  const { sessionReducer: { envUrl, authToken } } = state;
  const mstrData = {
    envUrl,
    authToken,
  };
  return { mstrData };
};

export const EmbeddedLibrary = connect(mapStateToProps)(
  EmbeddedLibraryNotConnected
);
